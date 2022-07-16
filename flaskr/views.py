from random import random
from flask import Blueprint, render_template, request, jsonify, redirect
from sqlalchemy import func
from .models import Word1, Progress
from . import db
from sqlalchemy import desc

views = Blueprint('views', __name__, url_prefix='/')



@views.route('/', methods=['GET'])
def home():
    answer = db.session.query(Word1).filter_by(learning='1', section='2').count()
    answered = Word1.query.filter_by(learning='0', section='2').count()
    total = Word1.query.filter_by(section='2').count()
    answer_rate = round(answer / total * 100)
    answered = round((1- answered / total) * 100)

    progresses = Progress.query.order_by(Progress.section).all()

    return render_template('home.html', answer_rate=answer_rate, progress=answered, progresses=progresses)

@views.route('/section/<int:section1>')
def test(section1):
    section = str(section1)
    new_count = Word1.query.filter_by(learning='0', section=section).count()
    yes_count = Word1.query.filter_by(learning='1', section=section).count()
    no_count = Word1.query.filter_by(learning='3', section=section).count()

    def w0(a):
        return Word1.query.order_by(func.random()).filter_by(section=section, learning='0').limit(a).all()
    def w1(b):
        return Word1.query.order_by(func.random()).filter_by(section=section, learning='1').limit(b).all()
    def w3(c):
        return Word1.query.order_by(func.random()).filter_by(section=section, learning='3').limit(c).all()
    #最初
    if yes_count == 0 and no_count == 0:
        words0 = w0(15)
        words1 = w1(0)
        words3 = w3(0)
    #すべての単語に目を通した
    elif new_count == 0:
        if yes_count >= 40:
            if no_count <12:
                words0 = w0(0)
                words1 = w1(15-no_count)
                words3 = w3(no_count)
            else:
                words0 = w0(0)
                words1 = w1(2) #3
                words3 = w3(13) #12
        #ほとんど覚えてない
        else:
            words0 = w0(0)
            words1 = w1(0)
            words3 = w3(15)
    #もうすぐですべての単語を周回
    elif new_count < 8:
        if no_count < 8 - new_count + 7:
            words0 = w0(new_count)
            words1 = w1(15-no_count-new_count)  #15-no-new
            words3 = w3(no_count) 
        else:
            words0 = w0(new_count)
            words1 = w1(0)
            words3 = w3(15-new_count)  
    #半分は新しい単語、半分は習った覚えてないもの
    elif new_count>=8:
        if no_count < 6:
            words0 = w0(a=9)
            words1 = w1(b=6-no_count)
            words3 = w3(c=no_count)
        else:
            words0 = w0(9)
            words1 = w1(6)
            words3 = w3(0)

    return render_template('section.html', words=words1 + words3 + words0, section=section)

@views.route('/sectionmistake/<int:section>')
def mistake(section):
    section=str(section)
    words = Word1.query.order_by(func.random()).filter_by(section=section, learning='3').limit(15).all()
    return render_template('section.html', words=words)

@views.route('/section/up', methods=['POST'])    
def section1_up():
    word_id = request.form.get('id')
    learning = request.form.get('learning')
    word = Word1.query.filter_by(id=word_id).first()

    word.learning = learning
    db.session.commit()
    return render_template('section.html')

@views.route('/section/result<int:section>', methods=['GET'])
def result(section):
    section=str(section)
    answer_count = Word1.query.filter_by(learning='1', section=section).count()
    answered_count = Word1.query.filter_by(learning='0', section=section).count()
    total = Word1.query.filter_by(section=section).count()
    answer_rate = str(round(answer_count / total * 100))
    answered = round((1- answered_count / total) * 100)

    progress = Progress.query.filter_by(section=section).first()
    if progress:
        progress.answered = answered
        progress.answerrate = answer_rate
        db.session.commit()
    else:
        first_progress = Progress(answered = answered, answerrate = answer_rate, section = section)
        db.session.add(first_progress)
        db.session.commit()


    return answer_rate

@views.route('/reset')
def reset():
    words = Word1.query.filter_by(section=1).all()
    for word in words:
        word.learning = 0
    db.session.commit()

    return redirect('/')

@views.route('/f')
def f():
    word=Word1(meaning='赤い', korean='붉다', pronounce='プッタ', learning=0, section=2)
    db.session.add(word)
    prg = Progress(section=1, answerrate=10, answered=10)
    db.session.add(prg)
    db.session.commit()
    return 'yew!'