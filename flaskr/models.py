from . import db

class Word1(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    korean = db.Column(db.String())
    meaning = db.Column(db.String())
    pronounce = db.Column(db.String())
    learning =db.Column(db.String())
    section = db.Column(db.String())

class Progress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    answerrate = db.Column(db.String())
    answered = db.Column(db.String())
    section = db.Column(db.String())

class Mark(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    section = db.Column(db.String())

class Practice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date=db.Column(db.String())
    practice=db.Column(db.String())

