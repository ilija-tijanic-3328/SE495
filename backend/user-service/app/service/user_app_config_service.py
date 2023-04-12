from flask import abort, g, current_app

from app.data import user_app_config_repo
from app.data.models import UserAppConfig


def validate_two_factor(value):
    from app.data.user_repo import get_by_id
    user = get_by_id(g.current_user_id)
    if user.phone_number is None and value == 'true':
        abort(400, 'Your account must have a phone number in order to use two-factor authentication')


DEFAULT_CONFIGS = [
    {"config": "UI_SCALE", "value": "14"},
    {"config": "UI_MENU_MODE", "value": "static"},
    {"config": "UI_DARK_MODE", "value": "false"},
    {"config": "AUTH_2_FACTOR", "value": "false"}
]

VALIDATIONS = {
    "AUTH_2_FACTOR": validate_two_factor
}


def get_by_user(user_id):
    user_configs: list = user_app_config_repo.get_by_user(user_id)
    for default_config in DEFAULT_CONFIGS:
        user_config = [config for config in user_configs if config.config == default_config.get('config')]
        if len(user_config) == 0:
            user_configs.append(
                UserAppConfig(user_id=user_id, config=default_config.get('config'), value=default_config.get('value')))

    return user_configs


def update(user_id, config, value):
    if config in [c.get('config') for c in DEFAULT_CONFIGS] and value is not None:
        validate_function = VALIDATIONS.get(config)
        if validate_function is not None:
            validate_function(value)

        user_config: UserAppConfig = user_app_config_repo.get_by_user_and_config(user_id, config)
        if user_config is None:
            user_config = UserAppConfig(user_id=user_id, config=config)
        user_app_config_repo.set_value(user_config, value)
    else:
        abort(400, 'Invalid config')
