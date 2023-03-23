from app import cache
from app.data.models import Service


def save(service: Service):
    services: set[Service] = cache.get(service.name)
    if not services:
        services = set[Service]()
    services.add(service)
    cache.set(service.name, services)


def remove(service: Service):
    services: set[Service] = cache.get(service.name)
    if service in services:
        services.remove(service)
    cache.set(service.name, services)


def get_all() -> list[Service]:
    services = list[Service]()
    for key in cache.cache._cache:
        if cache.has(key):
            values = cache.get(key)
            if values is not None:
                for value in values:
                    services.append(value)
    return services


def get(service_name: str) -> set[Service]:
    return cache.get(service_name)
