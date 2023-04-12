from app import db


class QuizParticipant(db.Model):
    __tablename__ = "quiz_participant"
    id = db.Column(db.Integer, db.Identity(), primary_key=True)
    user_id = db.Column(db.Integer, index=True)
    quiz_id = db.Column(db.Integer, index=True, nullable=False)
    name = db.Column(db.String(150), nullable=False)
    code = db.Column(db.String(5), nullable=False)
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)

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
