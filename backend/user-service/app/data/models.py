import os
from sqlalchemy import text
from app import db


class User(db.Model):
    __tablename__ = "user_account"
    id = db.Column(db.Integer, db.Identity(), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True, index=True)
    phone_number = db.Column(db.String(15))
    status = db.Column(db.String(15), nullable=False)
    role = db.Column(db.String(10), nullable=False)

    def to_dict(self):
        return {field.name: getattr(self, field.name) for field in self.__table__.c}


class UserAppConfig(db.Model):
    __tablename__ = "user_app_config"
    id = db.Column(db.Integer, db.Identity(), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user_account.id"), nullable=False, index=True)
    config = db.Column(db.String(20), nullable=False)
    value = db.Column(db.String(150), nullable=False)

    def to_dict(self):
        return {field.name: getattr(self, field.name) for field in self.__table__.c}


@db.event.listens_for(User.__table__, 'after_create')
def initial_data(target, connection, **kw):
    connection.execute(text(os.getenv('INIT_DATA')))
