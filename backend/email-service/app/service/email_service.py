import os
import requests
from flask import current_app as app, abort

from app.service import template_service

DOMAIN_NAME = os.getenv('MAILGUN_DOMAIN_NAME')
API_BASE_URL = os.getenv('MAILGUN_API_BASE_URL')
API_KEY = os.getenv('MAILGUN_API_KEY')
APP_BASE_URL = os.getenv('APP_BASE_URL')


def send(data):
    email_type = data.get('type')
    values = data.get('content')
    values['base_url'] = APP_BASE_URL
    try:
        subject: str = template_service.resolve_subject(email_type)
        html_content: str = template_service.resolve_html_content(email_type, values)
        text_content: str = template_service.resolve_text_content(email_type, values)
        send_request(data.get('email'), subject, html_content, text_content)
    except Exception as e:
        app.logger.warning(f"Failed to send email {email_type} {e}")
        abort(500)


def send_request(to_email: str, subject: str, html_content: str, text_content: str):
    requests.post(
        f"https://api.mailgun.net/v3/{DOMAIN_NAME}/messages",
        auth=("api", API_KEY),
        data={
            "from": f"Quick Quiz Ninja <mailgun@{DOMAIN_NAME}>",
            "to": [to_email],
            "subject": subject,
            "html": html_content,
            "text": text_content,
        }
    )


def check_mail_api_health():
    response = requests.get(
        f"https://api.mailgun.net/v3/{DOMAIN_NAME}/stats/total",
        auth=("api", API_KEY),
        params={"event": ["failed"], "duration": "1h"})
    if response.status_code != 200:
        abort(response.status_code)
