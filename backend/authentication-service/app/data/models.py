from app import db


class UserAuth(db.Model):
    __tablename__ = "user_auth"
    id = db.Column(db.Integer, db.Identity(), primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    last_logged_in = db.Column(db.String(100), nullable=False)
    failed_login_count = db.Column(db.Integer, nullable=False)
    failed_login_time = db.Column(db.datetime, nullable=False)


class Token(db.Model):
    __tablename__ = "token"
    id = db.Column(db.Integer, db.Identity(), primary_key=True)
    config = db.Column(db.String(20), nullable=False)
    value = db.Column(db.String(150), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
