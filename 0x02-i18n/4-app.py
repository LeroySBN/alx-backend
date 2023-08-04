#!/usr/bin/env python3
""" Basic Flask app, Basic Babel setup, Get locale from request,
    Parametrize templates, Force locale with URL parameter
"""
from flask import Flask, render_template, request
from flask_babel import Babel

app = Flask(__name__)
app.url_map.strict_slashes = False


class Config(object):
    """ Config class for Babel object
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale() -> str:
    """ Determines the best match with our supported languages.
    """
    if request.args.get('locale') in app.config['LANGUAGES']:
        return request.args.get('locale')
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def get_index() -> str:
    """ GET /
        Return: 4-index.html
    """
    return render_template('4-index.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")
