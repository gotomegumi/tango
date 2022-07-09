from random import random
from flask import Blueprint, render_template, request, jsonify
from sqlalchemy import func
from .models import Word1
from . import db

views = Blueprint('views', __name__, url_prefix='/')

@views.route('/', methods=['GET'])
def home():
    # words = Word1.query.all()
    # for word in words:
    #     word.learning = 0
    # db.session.commit()
    answer = Word1.query.filter_by(learning=1, section=1).count()
    progress = Word1.query.filter_by(learning=0, section=1).count()
    total = Word1.query.filter_by(section=1).count()
    answer_rate = round(answer / total * 100)
    progress = round((1- progress / total) * 100)
    return render_template('home.html', answer_rate=answer_rate, progress=progress)

@views.route('/section1/test')
def test():
    new_count = Word1.query.filter_by(learning=0).count()
    yes_count = Word1.query.filter_by(learning=1).count()
    no_count = Word1.query.filter_by(learning=3).count()

    def w0(a):
        return Word1.query.order_by(func.random()).filter_by(section=1, learning=0).limit(a).all()
    def w1(b):
        return Word1.query.order_by(func.random()).filter_by(section=1, learning=1).limit(b).all()
    def w3(c):
        return Word1.query.order_by(func.random()).filter_by(section=1, learning=3).limit(c).all()

    if yes_count == 0 and no_count == 0:
        words0 = w0(15)
        words1 = w1(0)
        words3 = w3(0)
    elif new_count == 0:
        if no_count <12:
            words0 = w0(0)
            words1 = w1(15-no_count)
            words3 = w3(no_count)
        else:
            words0 = w0(0)
            words1 = w1(3) #3
            words3 = w3(12) #12
    elif new_count < 8:
        if no_count < 8 - new_count + 7:
            words0 = w0(new_count)
            words1 = w1(15-no_count-new_count)  #15-no-new
            words3 = w3(no_count) 
        else:
            words0 = w0(new_count)
            words1 = w1(0)
            words3 = w3(15-new_count)    
    elif new_count>=8:
        if no_count < 7:
            words0 = w0(a=8)
            words1 = w1(b=7-no_count)
            words3 = w3(c=no_count)
        else:
            words0 = w0(8)
            words1 = w1(7)
            words3 = w3(0)

    return render_template('section.html', words=words1 + words3 + words0)

@views.route('/section1/up', methods=['POST'])    
def section1_up():
    word_id = request.form.get('id')
    learning = request.form.get('learning')
    word = Word1.query.filter_by(id=word_id).first()

    word.learning = learning
    db.session.commit()
    return render_template('section.html')

@views.route('/section1/result', methods=['GET'])
def result():
    answer = Word1.query.filter_by(learning=1, section=1).count()
    total = Word1.query.filter_by(section=1).count()
    answer_rate = str(round(answer / total * 100))
    
    return answer_rate