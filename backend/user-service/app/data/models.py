from app.api.main_api import db


class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, db.Identity(), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    phone_number = db.Column(db.String(15))
    status = db.Column(db.String(15), nullable=False)
    role = db.Column(db.String(10), nullable=False)


class UserAppConfig(db.Model):
    __tablename__ = "user_app_config"
    id = db.Column(db.Integer, db.Identity(), primary_key=True)
    config = db.Column(db.String(20), nullable=False)
    value = db.Column(db.String(150), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
