#!/usr/bin/env python3
""" Mock logging in a user, Use user locale to display welcome message.
"""
from flask import Flask, render_template, request, g
from flask_babel import Babel
from flask_babel import gettext as _

app = Flask(__name__)
app.url_map.strict_slashes = False

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


class Config(object):
    """ Config class for Babel object
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


babel = Babel(app)
app.config.from_object(Config)


@babel.localeselector # Not needed if using flask_babel package
def get_locale() -> str:
    """ Determines the best match with our supported languages.
    """
    if 'locale' in request.args:
        if request.args['locale'] in app.config['LANGUAGES']:
            return request.args['locale']
    return request.accept_languages.best_match(app.config['LANGUAGES'])


def get_user(user_id: int):
    """ Returns the user dictionary or None if not found
    """
    if user_id and user_id in users:
        return users.get(user_id)
    return None


@app.before_request
def before_request():
    """ Executed before all other functions
    Sets the user g.user to the global variable
    """
    user_id = request.args.get('login_as', type=int)
    g.user = get_user(user_id)


@app.route("/")
def get_index() -> str:
    """ GET /
    Return:
      - 5-index.html
    """
    return render_template("5-index.html")


if __name__ == "__main__":
    app.run()
