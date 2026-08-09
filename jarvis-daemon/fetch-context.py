import json
import os
from pathlib import Path
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent / '.env')

REDIS_URL = os.getenv('UPSTASH_REDIS_REST_URL', '')
REDIS_TOKEN = os.getenv('UPSTASH_REDIS_REST_TOKEN', '')
CHAT_ID = os.getenv('TELEGRAM_CHAT_ID', '706738923')


def redis_get(key: str):
    if not REDIS_URL or not REDIS_TOKEN:
        return None
    try:
        r = requests.get(
            f'{REDIS_URL}/get/{key}',
            headers={'Authorization': f'Bearer {REDIS_TOKEN}'},
            timeout=5,
        )
        result = r.json().get('result')
        if isinstance(result, str):
            try:
                return json.loads(result)
            except Exception:
                return result
        return result
    except Exception:
        return None


def main():
    try:
        history = redis_get(f'jarvis:{CHAT_ID}') or []
        briefing = redis_get('jarvis:briefing')
        last_exec = redis_get('jarvis:last_execution')

        lines = []

        if last_exec:
            ts = last_exec.get('timestamp', '')
            msg = last_exec.get('message', '')
            result = last_exec.get('result', '')
            files = last_exec.get('files_changed', [])
            lines.append(f'JARVIS MOBILE - last execution ({ts}):')
            lines.append(f'  Task: {msg}')
            lines.append(f'  Result: {result[:300]}')
            if files:
                lines.append(f'  Files changed: {", ".join(files)}')

        if briefing:
            ts = briefing.get('timestamp', '')
            lines.append(f'\nTELEGRAM BRIEFING ({ts}):')
            lines.append(briefing.get('summary', ''))

        if history:
            recent = history[-8:]
            lines.append(f'\nRECENT TELEGRAM ({len(recent)} messages):')
            for m in recent:
                role = 'Dee' if m['role'] == 'user' else 'JARVIS'
                content = m['content']
                if len(content) > 150:
                    content = content[:150] + '...'
                lines.append(f'  {role}: {content}')

        if lines:
            print('\n'.join(lines))
    except Exception:
        pass  # Never crash Claude Code session


if __name__ == '__main__':
    main()
