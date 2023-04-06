from app import cache


def save(service_name, location):
    instances: set[str] = cache.get(service_name) or set[str]()
    instances.add(location)
    cache.set(service_name, instances)
    services: set[str] = cache.get('services') or set[str]()
    services.add(service_name)
    cache.set('services', services)


def remove(service_name, location):
    instances: set[str] = cache.get(service_name)
    if location in instances:
        instances.remove(location)
    cache.set(service_name, instances)
    services: set[str] = cache.get('services')
    if len(instances) == 0 and service_name in services:
        services.remove(service_name)
    cache.set('services', services)


def get_all() -> dict:
    instances = dict()
    services = cache.get('services')
    for key in services:
        if cache.has(key):
            values = cache.get(key)
            instances[key] = values
    return instances


def get(service_name: str) -> set[str]:
    return cache.get(service_name)
