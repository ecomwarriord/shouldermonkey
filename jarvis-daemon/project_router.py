import os
import re
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent / '.env')

PROJECTS_ROOT = os.getenv('PROJECTS_ROOT', r'C:\Users\derol\Documents\Claude\Code Projects')

# Aliases map common terms to project folder names
PROJECT_ALIASES: dict[str, list[str]] = {
    'maikah-finance': ['maikah', 'finance', 'finance app', 'loans', 'super', 'tax'],
    'ironbloom': ['ironbloom', 'forge', 'fitness', 'workout', 'meal', 'tracker'],
    'holmes': ['holmes', 'voice ai', 'voice assistant', 'agents'],
    'donna': ['donna', 'personal assistant'],
    'shouldermonkey': ['shoulder monkey', 'shouldermonkey', 'ghl', 'crm'],
    'qaneri': ['qaneri'],
    'thebunnyco': ['bunny', 'bunny co', 'bunnyco', 'food', 'orders'],
    'ai-unlocked': ['ai unlocked', 'webinar', 'course'],
    'kpnaidoo': ['kp naidoo', 'immigration', 'migration law', 'visa'],
    'veridian': ['veridian', 'school', 'tutor'],
}

# UI/design keywords → Fable 5
UI_KEYWORDS = re.compile(
    r'\b(ui|design|colour|color|style|css|font|layout|button|card|page|landing|frontend|visual|icon|theme|modal|animation|responsive)\b',
    re.IGNORECASE,
)

# Complex/architecture keywords → Opus 5
COMPLEX_KEYWORDS = re.compile(
    r'\b(architecture|system|integration|auth|oauth|database|schema|migration|refactor|api|endpoint|multi.file|build|deploy|infrastructure)\b',
    re.IGNORECASE,
)


def discover_projects() -> dict[str, str]:
    """Scan PROJECTS_ROOT and return {folder_name_lowercase: full_path}."""
    projects = {}
    if not os.path.exists(PROJECTS_ROOT):
        return projects
    for entry in os.scandir(PROJECTS_ROOT):
        if entry.is_dir() and not entry.name.startswith('.'):
            projects[entry.name.lower()] = entry.path
    return projects


def route_project(message: str, projects: dict[str, str] | None = None) -> str | None:
    """Return the project path that best matches the message, or None."""
    if projects is None:
        projects = discover_projects()

    msg_lower = message.lower()

    # Check aliases first
    for folder, aliases in PROJECT_ALIASES.items():
        for alias in aliases:
            if alias.lower() in msg_lower:
                # Find matching project path
                for proj_name, proj_path in projects.items():
                    if folder in proj_name or proj_name in folder:
                        return proj_path

    # Fall back to direct folder name match
    for proj_name, proj_path in projects.items():
        if proj_name in msg_lower:
            return proj_path

    return None


def route_model(message: str) -> str:
    """Select Claude model based on task type."""
    if UI_KEYWORDS.search(message):
        return 'claude-fable-5'
    if COMPLEX_KEYWORDS.search(message):
        return 'claude-opus-5'
    return 'claude-opus-4-8'
