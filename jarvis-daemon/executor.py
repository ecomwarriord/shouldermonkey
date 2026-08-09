import os
import re
import subprocess
from dataclasses import dataclass, field
from pathlib import Path
import anthropic
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent / '.env')

COMPLEX_PATTERN = re.compile(
    r'\b(add|create|build|new|implement|integrate|refactor|system|multiple|several|all)\b',
    re.IGNORECASE,
)

_client: anthropic.Anthropic | None = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
    return _client


@dataclass
class ExecutionPlan:
    summary: str
    files_affected: list[str] = field(default_factory=list)
    is_complex: bool = False


def detect_complexity(message: str) -> str:
    """Return 'complex' if task is multi-file/architectural, else 'simple'."""
    matches = COMPLEX_PATTERN.findall(message)
    return 'complex' if len(matches) >= 2 else 'simple'


def build_tools(project_path: str) -> list[dict]:
    """Build Claude tool definitions for file operations."""
    return [
        {
            "name": "read_file",
            "description": "Read the contents of a file in the project",
            "input_schema": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Relative path from project root"}
                },
                "required": ["path"],
            },
        },
        {
            "name": "write_file",
            "description": "Write content to a file in the project",
            "input_schema": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Relative path from project root"},
                    "content": {"type": "string", "description": "Full file content to write"},
                },
                "required": ["path", "content"],
            },
        },
        {
            "name": "run_git",
            "description": "Run a git command in the project directory. Only add, commit, push, status, log, diff allowed.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "command": {"type": "string", "description": "Git subcommand e.g. 'status' or 'log --oneline -5'"}
                },
                "required": ["command"],
            },
        },
    ]


def _handle_tool_call(tool_name: str, tool_input: dict, project_path: str) -> str:
    """Execute a tool call and return the result as a string."""
    if tool_name == 'read_file':
        full_path = os.path.join(project_path, tool_input['path'])
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            return f"Error reading file: {e}"

    if tool_name == 'write_file':
        full_path = os.path.join(project_path, tool_input['path'])
        try:
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(tool_input['content'])
            return f"Written: {tool_input['path']}"
        except Exception as e:
            return f"Error writing file: {e}"

    if tool_name == 'run_git':
        ALLOWED = {'add', 'commit', 'push', 'status', 'log', 'diff'}
        cmd_parts = tool_input['command'].split()
        if not cmd_parts or cmd_parts[0] not in ALLOWED:
            return f"Blocked: only {ALLOWED} allowed"
        result = subprocess.run(
            ['git'] + cmd_parts,
            cwd=project_path,
            capture_output=True,
            text=True,
            timeout=30,
        )
        return result.stdout or result.stderr

    return f"Unknown tool: {tool_name}"


def execute(
    message: str,
    model: str,
    context: str,
    project_path: str,
) -> tuple[str, list[str]]:
    """
    Run an agentic Claude loop to execute the task.
    Returns (reply_text, files_changed).
    """
    client = _get_client()
    tools = build_tools(project_path)
    files_changed: list[str] = []
    MAX_ITER = 20
    iterations = 0

    messages = [{"role": "user", "content": message}]

    system = f"""You are JARVIS — Dee's personal AI. Execute the requested code change completely.

{context}

Rules:
- Use read_file to understand existing code before changing it
- Use write_file to make changes — write the COMPLETE file content, not just the diff
- Use run_git to: git add <files>, git commit -m "feat: <description>", git push
- After committing, reply with what you changed, which files, and the commit message
- Be conversational — talk to Dee like you always do
- AUD always, never ZAR unless BridgeGrowth
- If something is unclear, say so before executing"""

    while iterations < MAX_ITER:
        iterations += 1
        response = client.messages.create(
            model=model,
            max_tokens=8192,
            system=system,
            tools=tools,
            messages=messages,
        )

        # Collect any text from this response
        reply_parts = []
        tool_calls = []

        for block in response.content:
            if block.type == 'text':
                reply_parts.append(block.text)
            elif block.type == 'tool_use':
                tool_calls.append(block)

        if response.stop_reason == 'end_turn' or not tool_calls:
            return '\n'.join(reply_parts), files_changed

        # Execute tool calls
        messages.append({"role": "assistant", "content": response.content})
        tool_results = []

        for tool_call in tool_calls:
            result = _handle_tool_call(tool_call.name, tool_call.input, project_path)
            if tool_call.name == 'write_file':
                files_changed.append(tool_call.input.get('path', ''))
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": tool_call.id,
                "content": result,
            })

        messages.append({"role": "user", "content": tool_results})

    # Exceeded max iterations
    return f"Hit max iterations ({MAX_ITER}). Files changed: {files_changed}. Check git log.", files_changed


def plan_only(
    message: str,
    model: str,
    context: str,
    project_path: str,
) -> str:
    """Generate a plan without executing. Used for complex/confirm-first tasks."""
    client = _get_client()

    system = f"""You are JARVIS. The user wants to make a change. Produce a concise plan only — do NOT execute anything.

{context}

Format:
- What you'll do (2-4 bullets)
- Files you'll touch
- End with: "Do it?" on its own line"""

    response = client.messages.create(
        model=model,
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": message}],
    )

    return response.content[0].text
