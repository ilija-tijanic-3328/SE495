from app import db


class Participant(db.Model):
    __tablename__ = "quiz_participant"
    id = db.Column(db.Integer, db.Identity(), primary_key=True)
    user_id = db.Column(db.Integer, index=True)
    quiz_id = db.Column(db.Integer, index=True, nullable=False)
    name = db.Column(db.String(150), nullable=False)
    code = db.Column(db.String(5), nullable=False)
    invitation_type = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(150))
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    answers = db.relationship("ParticipantAnswer", backref='quiz_participant', cascade='all, delete-orphan')

    def to_dict(self):
        return {field.name: getattr(self, field.name) for field in self.__table__.c}


class ParticipantAnswer(db.Model):
    __tablename__ = "participant_answer"
    id = db.Column(db.Integer, db.Identity(), primary_key=True)
    quiz_participant_id = db.Column(db.Integer, db.ForeignKey("quiz_participant.id"), index=True, nullable=False)
    question_id = db.Column(db.Integer, index=True, nullable=False)
    value = db.Column(db.String(500), nullable=False)

    def to_dict(self):
        return {field.name: getattr(self, field.name) for field in self.__table__.c}
