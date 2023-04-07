from app import db
from app.data.models import UserAppConfig

DEFAULT_CONFIGS = [
    {"config": "UI_SCALE", "value": "14"},
    {"config": "UI_MENU_TYPE", "value": "static"},
    {"config": "UI_DARK_MODE", "value": "true"},
    {"config": "AUTH_2_FACTOR", "value": "false"}
]


def get_by_user(user_id):
    user_configs = db.session.scalars(db.select(UserAppConfig).filter_by(user_id=user_id)).all()

    for default_config in DEFAULT_CONFIGS:
        user_config = [config for config in user_configs if config.config == default_config.get('config')]
        if len(user_config) == 0:
            user_configs.append(
                UserAppConfig(user_id=user_id, config=default_config.get('config'), value=default_config.get('value')))

    return user_configs
