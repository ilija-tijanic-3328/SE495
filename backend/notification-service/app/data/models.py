from app import db


class Notification(db.Model):
    __tablename__ = "notification"
    id = db.Column(db.Integer, db.Identity(), primary_key=True)
    user_id = db.Column(db.Integer, nullable=False, index=True)
    content = db.Column(db.String(500), nullable=False)
    type = db.Column(db.String(25), nullable=False)
    deep_link = db.Column(db.String(200))
    seen_time = db.Column(db.DateTime)
    creation_time = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {field.name: getattr(self, field.name) for field in self.__table__.c}
