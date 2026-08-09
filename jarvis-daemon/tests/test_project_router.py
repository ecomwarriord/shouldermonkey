import pytest
from unittest.mock import patch
from project_router import route_project, route_model, PROJECT_ALIASES

def test_route_project_by_exact_name():
    projects = {
        'maikah-finance': r'C:\Code\maikah-finance',
        'ironbloom': r'C:\Code\ironbloom',
    }
    result = route_project("Change the loan label in Maikah Finance", projects)
    assert result == r'C:\Code\maikah-finance'

def test_route_project_by_alias():
    projects = {'ironbloom': r'C:\Code\ironbloom'}
    result = route_project("update the fitness tracker", projects)
    assert result == r'C:\Code\ironbloom'

def test_route_project_returns_none_when_unknown():
    projects = {'maikah-finance': r'C:\Code\maikah-finance'}
    result = route_project("what's the weather today", projects)
    assert result is None

def test_route_model_ui_task():
    model = route_model("Change the button colour on the landing page")
    assert model == 'claude-fable-5'

def test_route_model_complex_task():
    model = route_model("Add a new authentication system with OAuth")
    assert model == 'claude-opus-5'

def test_route_model_simple_task():
    model = route_model("Fix the typo in the label")
    assert model == 'claude-opus-4-8'
