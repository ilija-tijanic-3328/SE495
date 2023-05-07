from flask import abort

from app.data import quiz_config_repo
from app.data.models import QuizConfig

DEFAULT_CONFIGS = {
    "Questions have random order": "false",
    "Answers have random order": "false",
    "Participants can view leaderboard": "true",
    "Participants can view report": "false"
}


def get_by_quiz(quiz_id):
    quiz_configs: list = quiz_config_repo.get_by_quiz(quiz_id)

    for default_config in DEFAULT_CONFIGS:
        quiz_config = [config for config in quiz_configs if config.config == default_config]
        if len(quiz_config) == 0:
            quiz_configs.append(
                QuizConfig(quiz_id=quiz_id, config=default_config, value=DEFAULT_CONFIGS.get(default_config)))

    quiz_configs.sort(key=lambda c: c.config)

    return quiz_configs


def update(quiz_id, configs):
    for config in configs:
        config_key = config.get('config')
        config_value = config.get('value')

        if config_key in DEFAULT_CONFIGS and config_value is not None:
            quiz_config: QuizConfig = quiz_config_repo.get_by_quiz_and_config(quiz_id, config_key)

            if quiz_config is None:
                quiz_config = QuizConfig(quiz_id=quiz_id, config=config_key)

            quiz_config_repo.set_value(quiz_config, str(config_value).lower())
        else:
            abort(400, f'Invalid config: {config_key}')


def get_default():
    defaults = []

    for default_key in DEFAULT_CONFIGS:
        defaults.append({'config': default_key, 'value': DEFAULT_CONFIGS.get(default_key)})

    defaults.sort(key=lambda c: c.get('config'))

    return defaults


def delete_for_quiz(quiz_id):
    quiz_config_repo.delete_for_quiz(quiz_id)


def should_shuffle_questions(quiz_id):
    return quiz_config_repo.get_by_quiz_and_config(quiz_id, 'Questions have random order').value == 'true'


def should_shuffle_answers(quiz_id):
    return quiz_config_repo.get_by_quiz_and_config(quiz_id, 'Answers have random order').value == 'true'
