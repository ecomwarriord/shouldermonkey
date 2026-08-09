import pytest
from unittest.mock import patch, MagicMock
from executor import build_tools, detect_complexity, ExecutionPlan

def test_detect_complexity_simple():
    assert detect_complexity("fix the typo in the label") == 'simple'

def test_detect_complexity_complex():
    assert detect_complexity("add a new tab with three components and update the nav") == 'complex'

def test_build_tools_returns_list():
    tools = build_tools(project_path=r'C:\test')
    assert isinstance(tools, list)
    assert any(t['name'] == 'read_file' for t in tools)
    assert any(t['name'] == 'write_file' for t in tools)
    assert any(t['name'] == 'run_git' for t in tools)

def test_execution_plan_has_required_fields():
    plan = ExecutionPlan(
        summary="Change label to include %",
        files_affected=["src/components/LoanCard.tsx"],
        is_complex=False,
    )
    assert plan.summary
    assert isinstance(plan.files_affected, list)
    assert isinstance(plan.is_complex, bool)
