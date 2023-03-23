import json

import requests
from flask import request, Response, abort, Blueprint, current_app as app

from app.data.models import Service
from app.service import registry_service

main = Blueprint('main', __name__)


@main.route('/register', methods=['POST'])
def register():
    data = json.loads(request.json)
    service: Service = Service(data['name'], data['location'])
    registry_service.register(service)
    return 'OK', 200


@main.route('/', defaults={'path': ''}, methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
@main.route('/<path:path>')
def forward(path):
    service_name = request.headers.get("service_name")
    instance: Service = registry_service.get_active(service_name)

    if instance is None:
        app.logger.warning(f'No instance found for {service_name}')
        abort(502)

    response = requests.request(request.method, f"{instance.location}{path}", json=request.json, params=request.args,
                                headers=request.headers)

    excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
    headers = [(name, value) for (name, value) in response.raw.headers.items() if name.lower() not in excluded_headers]
    filtered_response = Response(response.content, response.status_code, headers)
    return filtered_response
