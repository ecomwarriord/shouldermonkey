import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

PROJECTS_ROOT = os.getenv('PROJECTS_ROOT', r'C:\Users\derol\Documents\Claude\Code Projects')
OBSIDIAN_VAULT = os.getenv('OBSIDIAN_VAULT', r'C:\Users\derol\Documents\Claude\ClaudeVault')
CLAUDE_MEMORY_ROOT = os.getenv('CLAUDE_MEMORY_ROOT', r'C:\Users\derol\.claude\projects')


def find_memory_root() -> str | None:
    """Find the auto-memory directory under .claude/projects/."""
    if not os.path.exists(CLAUDE_MEMORY_ROOT):
        return None
    for entry in os.scandir(CLAUDE_MEMORY_ROOT):
        if entry.is_dir():
            memory_path = os.path.join(entry.path, 'memory')
            if os.path.exists(memory_path):
                return memory_path
    return None


def _read_file(path: str) -> str:
    """Read file content, return empty string on error."""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception:
        return ''


def load_memory_context() -> str:
    """Load MEMORY.md and all linked memory files."""
    memory_root = find_memory_root()
    if not memory_root:
        return ''

    sections = []
    memory_index_path = os.path.join(memory_root, 'MEMORY.md')
    memory_index = _read_file(memory_index_path)
    if memory_index:
        sections.append(f"## Memory Index\n{memory_index}")

    # Load each memory file referenced in the index
    for entry in os.scandir(memory_root):
        if entry.name != 'MEMORY.md' and entry.name.endswith('.md'):
            content = _read_file(entry.path)
            if content:
                sections.append(f"## {entry.name}\n{content}")

    return '\n\n'.join(sections)


def load_obsidian_context() -> str:
    """Load master task list from Obsidian vault."""
    task_list_path = os.path.join(OBSIDIAN_VAULT, '04-Plans', 'master-task-list.md')
    content = _read_file(task_list_path)
    if content:
        return f"## Master Task List (Obsidian)\n{content}"
    return ''


def load_project_context(project_path: str) -> str:
    """Load CLAUDE.md and recent git log for a specific project."""
    sections = []

    claude_md = os.path.join(project_path, 'CLAUDE.md')
    content = _read_file(claude_md)
    if content:
        sections.append(f"## Project Rules (CLAUDE.md)\n{content}")

    try:
        result = subprocess.run(
            ['git', 'log', '--oneline', '-10'],
            cwd=project_path,
            capture_output=True,
            text=True,
            timeout=10,
        )
        if result.returncode == 0 and result.stdout:
            sections.append(f"## Recent Commits\n{result.stdout}")
    except Exception:
        pass

    return '\n\n'.join(sections)


def load_context(message: str, project_path: str | None = None) -> str:
    """Load full context for a Claude API call."""
    sections = [
        "# JARVIS — Full Context\n",
        load_memory_context(),
        load_obsidian_context(),
    ]
    if project_path:
        sections.append(load_project_context(project_path))
    return '\n\n'.join(s for s in sections if s)
