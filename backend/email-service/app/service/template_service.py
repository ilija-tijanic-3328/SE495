from flask import render_template

TEMPLATES = {
    "REGISTRATION": "Confirm your account"
}


def resolve_subject(email_type: str) -> str:
    return TEMPLATES.get(email_type)


def resolve_html_content(email_type: str, values: dict) -> str:
    return render_template(f'{email_type.lower()}.html', **values)


def resolve_text_content(email_type: str, values: dict) -> str:
    return render_template(f'{email_type.lower()}.txt', **values)
