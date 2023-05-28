from app import db


class Quiz(db.Model):
    __tablename__ = "quiz"
    id = db.Column(db.Integer, db.Identity(), primary_key=True)
    user_id = db.Column(db.Integer, nullable=False, index=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(1000))
    status = db.Column(db.String(25), nullable=False)
    time_allowed = db.Column(db.Integer, nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {field.name: getattr(self, field.name) for field in self.__table__.c}


class QuizConfig(db.Model):
    __tablename__ = "quiz_config"
    id = db.Column(db.Integer, db.Identity(), primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quiz.id", ondelete='CASCADE'), nullable=False, index=True)
    config = db.Column(db.String(50), nullable=False)
    value = db.Column(db.String(150), nullable=False)

    def to_dict(self):
        return {field.name: getattr(self, field.name) for field in self.__table__.c}


class Question(db.Model):
    __tablename__ = "question"
    id = db.Column(db.Integer, db.Identity(), primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quiz.id", ondelete='CASCADE'), nullable=False, index=True)
    text = db.Column(db.String(150), nullable=False)
    type = db.Column(db.String(25), nullable=False)
    order = db.Column(db.Integer, nullable=False)
    answers = db.relationship("Answer", backref='question', cascade='all, delete-orphan', order_by='asc(Answer.order)')

    def to_dict(self):
        return {field.name: getattr(self, field.name) for field in self.__table__.c}


class Answer(db.Model):
    __tablename__ = "answer"
    id = db.Column(db.Integer, db.Identity(), primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey("question.id", ondelete='CASCADE'), nullable=False, index=True)
    text = db.Column(db.String(150), nullable=False)
    correct = db.Column(db.Boolean, nullable=False)
    order = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {field.name: getattr(self, field.name) for field in self.__table__.c}
