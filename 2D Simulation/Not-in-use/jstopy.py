from flask import Flask
app = Flask(__name__)

@app.route('/getmethod/<jsdata>')
def get_javascript_data(jsdata):
    return jsdata