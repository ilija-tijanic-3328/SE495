import urllib.request

from app.data import service_repo


def register(service_name, location):
    service_repo.save(service_name, location)


def check_health():
    instances: dict = service_repo.get_all()
    for service_name in instances:
        for location in instances[service_name]:
            try:
                urllib.request.urlopen(location + '/health')
            except:
                unregister(service_name, location)


def get_active(service_name: str):
    instances: set[str] = service_repo.get(service_name)
    if instances is not None and len(instances) > 0:
        return instances.pop()
    return None


def unregister(service_name, location):
    service_repo.remove(service_name, location)
