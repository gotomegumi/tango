from flask import Flask, appcontext_popped
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_migrate import Migrate
from flask_admin.contrib.sqla import ModelView
from os import path
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'dsafhisdf'
    app.config['SQLALCHEMY_DATABASE_URI'] =  'postgresql://postgres:4869@localhost:5432/tango1'
    migrate = Migrate(app, db)
    db.init_app(app)



    from .views import views

    app.register_blueprint(views)

    from .models import Word1
    from .models import Progress

    db.create_all(app=app)





    admin = Admin(app)
    admin.add_view(ModelView(Word1, db.session))
    admin.add_view(ModelView(Progress, db.session))


    return app