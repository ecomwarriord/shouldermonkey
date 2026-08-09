import pytest
from unittest.mock import patch
from daemon import verify_auth, parse_job, is_confirmation


def test_verify_auth_correct_passphrase():
    assert verify_auth("JARVIS fix the label", "JARVIS") is True


def test_verify_auth_wrong_passphrase():
    assert verify_auth("fix the label", "JARVIS") is False


def test_verify_auth_case_insensitive():
    assert verify_auth("jarvis fix the label", "JARVIS") is True


def test_parse_job_extracts_message():
    raw = '{"id": "abc", "message": "fix the label", "chat_id": 706738923}'
    job = parse_job(raw)
    assert job['message'] == "fix the label"
    assert job['chat_id'] == 706738923


def test_is_confirmation_yes():
    assert is_confirmation("yes") is True
    assert is_confirmation("Yes do it") is True
    assert is_confirmation("yeah") is True
    assert is_confirmation("yep go ahead") is True


def test_is_confirmation_no():
    assert is_confirmation("no") is False
    assert is_confirmation("what else is there") is False
