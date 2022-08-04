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
    
    migrate = Migrate(app, db)
    db.init_app(app)
    app.app_context().push()

    app.config['SQLALCHEMY_DATABASE_URI'] = 


    from .views import views

    app.register_blueprint(views)

    from .models import Word1
    from .models import Progress
    from .models import Mark

    admin = Admin(app)
    admin.add_view(ModelView(Word1, db.session))
    admin.add_view(ModelView(Progress, db.session))
    admin.add_view(ModelView(Mark, db.session))


    return app
