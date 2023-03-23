import atexit
import urllib.request

from apscheduler.schedulers.background import BackgroundScheduler

from app.data import service_repo
from app.data.models import Service


def register(service: Service):
    service_repo.save(service)


def check_health():
    for service in service_repo.get_all():
        try:
            urllib.request.urlopen(service.location + '/health')
        except Exception as e:
            service_repo.remove(service)


scheduler = BackgroundScheduler()
scheduler.add_job(func=check_health, trigger="interval", seconds=30)
scheduler.start()

atexit.register(lambda: scheduler.shutdown())


def get_active(service_name: str) -> Service or None:
    services: set[Service] = service_repo.get(service_name)
    if services is not None and len(services) > 0:
        return services.pop()
    return None
