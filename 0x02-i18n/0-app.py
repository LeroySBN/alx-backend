#!/usr/bin/env python3
""" Basic Flask app
"""
from flask import Flask, render_template

app = Flask(__name__)


@app.route('/', methods=['GET'], strict_slashes=False)
def index() -> str:
    """ GET /
        Return: 0-index.html
    """
    return render_template('0-index.html')


app.run()
