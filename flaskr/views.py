from random import random
from flask import Blueprint, render_template, request, jsonify, redirect
from sqlalchemy import func
from .models import Word1, Progress, Mark
from . import db
from sqlalchemy import desc

views = Blueprint('views', __name__, url_prefix='/')



@views.route('/', methods=['GET'])
def home():
    mark=Mark.query.filter_by(id='1').first()
    section = mark.section

    answer = db.session.query(Word1).filter_by(learning='1', section=section).count()
    answered = Word1.query.filter_by(learning='0', section=section).count()
    total = Word1.query.filter_by(section=section).count()
    answer_rate = round(answer / total * 100)
    answered = round((1- answered / total) * 100)

    progresses = Progress.query.order_by(Progress.id).all()
    
    return render_template('home.html', answer_rate=answer_rate, progress=answered, progresses=progresses, section=section)

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
    #すべての単語に目を通した
    if new_count == 0:
        if yes_count >= 40:
            if no_count <15:
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
    elif new_count < 15:
        if no_count < 15 - new_count:
            words0 = w0(new_count)
            words1 = w1(15-no_count-new_count)  #15-no-new
            words3 = w3(no_count) 
        else:
            words0 = w0(new_count)
            words1 = w1(0)
            words3 = w3(15-new_count)  
    elif new_count>=15:
        words0 = w0(15)
        words1 = w1(0)
        words3 = w3(0)

    #もうすぐですべての単語を周回
    # elif new_count < 8:
    #     if no_count < 8 - new_count + 7:
    #         words0 = w0(new_count)
    #         words1 = w1(15-no_count-new_count)  #15-no-new
    #         words3 = w3(no_count) 
    #     else:
    #         words0 = w0(new_count)
    #         words1 = w1(0)
    #         words3 = w3(15-new_count)  
    # #半分は新しい単語、半分は習った覚えてないもの
    # elif new_count>=8:
    #     if no_count < 6:
    #         words0 = w0(a=9)
    #         words1 = w1(b=6-no_count)
    #         words3 = w3(c=no_count)
    #     else:
    #         words0 = w0(9)
    #         words1 = w1(0)
    #         words3 = w3(6)

    return render_template('section.html', words=words1 + words3 + words0, section=section)

@views.route('/sectionmistake/<int:section1>')
def mistake(section1):
    section=str(section1)
    words = Word1.query.order_by(func.random()).filter_by(section=section, learning='3').limit(15).all()
    return render_template('section.html', words=words, section=section)

@views.route('/sectionnew/<int:section1>')
def new(section1):
    section=str(section1)
    words = Word1.query.order_by(func.random()).filter_by(section=section, learning='0').limit(15).all()
    return render_template('section.html', words=words, section=section)

@views.route('/section/up', methods=['POST'])    
def section1_up():
    word_id = request.form.get('id')
    learning = request.form.get('learning')
    word = Word1.query.filter_by(id=word_id).first()

    word.learning = learning
    word.review = learning
    db.session.commit()
    return render_template('section.html') 

@views.route('/section/result<int:section>', methods=['POST'])
def result(section):
    section=str(section)
    answer_count = Word1.query.filter_by(learning='1', section=section).count()
    answered_count = Word1.query.filter_by(learning='0', section=section).count()
    total = Word1.query.filter_by(section=section).count()
    if answer_count == total:
        answer_rate = 100
    else:
        answer_rate = str(round(answer_count / total * 100))
    if answered_count == total:
        answered = 100
    else:
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

    mark = Mark.query.filter_by(id=1).first()
    mark.section = section
    db.session.commit()

    # return answer_rate
    return jsonify({'answer_rate':answer_rate, 'answered':answered})

@views.route('/reset/<int:section>')
def reset(section):
    section=str(section)
    words = Word1.query.filter_by(section=section).all()
    for word in words:
        word.learning = 0
    progress = Progress.query.filter_by(section=section).first()
    progress.answerrate = 0
    progress.answered = 0
    db.session.commit()

    return redirect('/')

@views.route('/clear/<int:section>')
def clear(section):
    section=str(section)
    words = Word1.query.filter_by(section=section, learning='3').all()
    for word in words:
        word.learning = 0
    progress = Progress.query.filter_by(section=section).first()
    answer_rate = progress.answerrate
    progress.answered = answer_rate
    db.session.commit()

    return redirect('/')
