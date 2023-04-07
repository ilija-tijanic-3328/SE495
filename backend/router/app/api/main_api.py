import json

import requests
from flask import request, Response, abort, Blueprint, current_app as app
from urllib3.exceptions import MaxRetryError, NewConnectionError

from app.service import registry_service

main = Blueprint('main', __name__)


@main.route('/register', methods=['POST'])
def register():
    data = json.loads(request.json)
    app.logger.debug(f"Registering instance: {data['name']} {data['location']}")
    registry_service.register(data['name'], data['location'])
    return 'OK', 200


@main.route('/unregister', methods=['POST'])
def unregister():
    data = json.loads(request.json)
    app.logger.debug(f"Unregistering instance: {data['name']} {data['location']}")
    registry_service.unregister(data['name'], data['location'])
    return 'OK', 200


def resolve_service_instance(service_name):
    instance = registry_service.get_active(service_name)
    if instance is None:
        app.logger.warning(f'No instance found for {service_name}')
        abort(502, f'No instance found for {service_name}')
    return instance


def send_request(path):
    service_name = request.headers.get("service_name")
    instance = resolve_service_instance(service_name)

    # app.logger.debug(f'Request {path} {request.headers} from {instance}')

    try:
        response = requests.request(request.method, f"{instance}/{path}", data=request.data,
                                    params=request.args,
                                    headers=request.headers)

        # app.logger.debug(f'Response {response.status_code} {response.json()} from {instance}')

        return response
    except (MaxRetryError, NewConnectionError):
        app.logger.warning(f'Unregistering unresponsive service instance {instance}')
        registry_service.unregister(service_name, instance)
        return send_request(path)
    except Exception as e:
        app.logger.warning(f'error {e}')
        abort(500)


@main.route('/', defaults={'path': ''}, methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
@main.route('/<path:path>', methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
def forward(path):
    response = send_request(path)
    excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
    headers = [(name, value) for (name, value) in response.raw.headers.items() if name.lower() not in excluded_headers]
    filtered_response = Response(response.content, response.status_code, headers)
    return filtered_response
