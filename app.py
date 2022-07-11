from flaskr import create_app
from flaskr.models import Word1
from flaskr import db

app = create_app()



if __name__ == '__main__':
    app.run(debug=True)