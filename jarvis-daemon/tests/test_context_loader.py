import os
import pytest
from unittest.mock import patch, mock_open, MagicMock
from context_loader import load_context, load_project_context


def test_load_context_includes_memory_index(tmp_path):
    memory_file = tmp_path / "MEMORY.md"
    memory_file.write_text("# Memory Index\n- [User](user.md)")
    with patch('context_loader.CLAUDE_MEMORY_ROOT', str(tmp_path)):
        with patch('context_loader.find_memory_root', return_value=str(tmp_path)):
            ctx = load_context("test message")
    assert "Memory Index" in ctx


def test_load_project_context_includes_claude_md(tmp_path):
    project_dir = tmp_path / "maikah-finance"
    project_dir.mkdir()
    claude_md = project_dir / "CLAUDE.md"
    claude_md.write_text("# Maikah Rules\n- AUD always")
    ctx = load_project_context(str(project_dir))
    assert "Maikah Rules" in ctx


def test_load_project_context_includes_git_log(tmp_path):
    project_dir = tmp_path / "test-project"
    project_dir.mkdir()
    with patch('context_loader.subprocess.run') as mock_run:
        mock_run.return_value = MagicMock(stdout="abc1234 fix: update label\n", returncode=0)
        ctx = load_project_context(str(project_dir))
    assert "abc1234" in ctx
