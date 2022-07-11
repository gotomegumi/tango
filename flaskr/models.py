from . import db

class Word1(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    korean = db.Column(db.String(1000))
    meaning = db.Column(db.String(1000))
    pronounce = db.Column(db.String(1000))
    learning =db.Column(db.String(10))
    section = db.Column(db.String(100))

class Progress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    answerrate = db.Column(db.String(1000))
    answered = db.Column(db.String(1000))
    section = db.Column(db.String(100))
