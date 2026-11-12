"""Renderização da interface web."""

from flask import render_template

from models.neighborhood_model import NEIGHBORHOODS_BY_RPA


def render_home():
    return render_template("index.html", neighborhoods=NEIGHBORHOODS_BY_RPA)
