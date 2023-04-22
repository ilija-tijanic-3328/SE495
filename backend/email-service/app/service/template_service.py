from flask import render_template

TEMPLATES = {
    "REGISTRATION": "Confirm your account",
    "FORGOT_PASSWORD": "Password reset request",
    "PARTICIPANT_INVITATION": "Invitation to quiz"
}


def resolve_subject(email_type: str) -> str:
    return TEMPLATES.get(email_type)


def resolve_html_content(email_type: str, values: dict) -> str:
    template = resolve_template_name(email_type, '.html')
    return render_template(template, **values)


def resolve_text_content(email_type: str, values: dict) -> str:
    template = resolve_template_name(email_type, '.txt')
    return render_template(template, **values)


def resolve_template_name(email_type: str, file_extension: str) -> str:
    return f"{email_type.lower().replace('_', '-')}{file_extension}"
