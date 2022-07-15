from flask import Flask, appcontext_popped
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_migrate import Migrate
from flask_admin.contrib.sqla import ModelView
from os import path
import os
import psycopg2

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'dsafhisdf'
    # app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or  'postgresql://postgres:4869@localhost:5432/tango1'
    # DATABASE_URL = os.environ['DATABASE_URL']
    # conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    migrate = Migrate(app, db)
    db.init_app(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://hyymjvfgumbpdt:23b9256aa30060cd645b103d65638329293fbde90f6260573693ea273edd7d98@ec2-54-152-28-9.compute-1.amazonaws.com:5432/d23ofadol35oc2'



    from .views import views

    app.register_blueprint(views)

    from .models import Word1
    from .models import Progress

    # db.create_all(app=app)





    admin = Admin(app)
    admin.add_view(ModelView(Word1, db.session))
    admin.add_view(ModelView(Progress, db.session))


    return app