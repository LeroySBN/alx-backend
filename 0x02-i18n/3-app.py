#!/usr/bin/env python3
""" Basic Flask app, Basic Babel setup, Get locale from request,
    Parametrize templates
"""
from flask import Flask, render_template, request
from flask_babel import Babel
from flask_babel import gettext as _

app = Flask(__name__)
app.url_map.strict_slashes = False


class Config(object):
    """ Config class for Babel object
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app.config.from_object(Config)


# @babel.locale
def get_locale() -> str:
    """ Determines the best match with our supported languages.
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


babel = Babel(app)
babel.init_app(app, locale_selector=get_locale)


@app.route('/')
def get_index() -> str:
    """ GET /
        Return: 3-index.html
    """
    return render_template(
        '3-index.html',
        title=_('home_title'),
        header=_('home_header'))


if __name__ == "__main__":
    app.run()
