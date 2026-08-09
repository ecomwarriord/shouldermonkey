import json
import os
import re
import time
import uuid
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent / '.env')

CHAT_ID = int(os.getenv('TELEGRAM_CHAT_ID', '706738923'))
PASSPHRASE = os.getenv('JARVIS_PASSPHRASE', '').lower()
POLL_INTERVAL = 30  # seconds

CONFIRM_PATTERN = re.compile(
    r'\b(yes|yeah|yep|yup|do it|go ahead|proceed|confirmed|confirm|sure|ok|okay)\b',
    re.IGNORECASE,
)

# Lazy-init Redis so import doesn't fail when env vars are absent
_redis = None


def _get_redis():
    global _redis
    if _redis is None:
        from upstash_redis import Redis
        _redis = Redis(
            url=os.getenv('UPSTASH_REDIS_REST_URL', ''),
            token=os.getenv('UPSTASH_REDIS_REST_TOKEN', ''),
        )
    return _redis


def verify_auth(message: str, passphrase: str) -> bool:
    """Check passphrase is present in message (case-insensitive)."""
    return passphrase.lower() in message.lower()


def parse_job(raw: str) -> dict:
    """Parse a JSON job from the Redis queue."""
    return json.loads(raw)


def is_confirmation(message: str) -> bool:
    """Return True if message is a yes/confirm response."""
    return bool(CONFIRM_PATTERN.search(message))


def process_job(job: dict) -> None:
    """Handle a single code execution job."""
    from context_loader import load_context
    from executor import detect_complexity, execute, plan_only
    from project_router import discover_projects, route_model, route_project
    from telegram_client import send_message

    message = job['message']
    chat_id = job.get('chat_id', CHAT_ID)

    # Discover projects
    projects = discover_projects()

    # Route project and model
    project_path = route_project(message, projects)
    model = route_model(message)

    if not project_path:
        send_message(
            chat_id,
            "I couldn't figure out which project you mean. Can you be more specific?"
        )
        return

    project_name = os.path.basename(project_path)

    # Load context
    context = load_context(message, project_path)

    # Determine complexity
    complexity = detect_complexity(message)

    if complexity == 'complex':
        # Plan first, wait for confirmation
        send_message(chat_id, f"On it. Let me look at {project_name}...")
        plan = plan_only(message, model, context, project_path)

        # Store pending job in Redis
        _get_redis().set(
            f"jarvis:code:pending:{chat_id}",
            json.dumps({
                "id": str(uuid.uuid4()),
                "original_message": message,
                "project_path": project_path,
                "model": model,
                "context": context,
            }),
            ex=600,  # expires in 10 minutes
        )
        send_message(chat_id, plan)

    else:
        # Simple — brief confirm then execute
        send_message(chat_id, f"Quick change in {project_name}. Doing it now...")
        reply, files_changed = execute(message, model, context, project_path)
        send_message(chat_id, reply)
        _get_redis().set('jarvis:last_execution', json.dumps({
            'message': message,
            'result': reply,
            'files_changed': files_changed,
            'project': project_name,
            'timestamp': __import__('datetime').datetime.now().isoformat(),
        }))


def process_confirmation(chat_id: int) -> bool:
    """
    Check if there's a pending job for this chat_id and execute it.
    Returns True if a pending job was found and executed.
    """
    from executor import execute
    from telegram_client import send_message

    redis = _get_redis()
    pending_raw = redis.get(f"jarvis:code:pending:{chat_id}")
    if not pending_raw:
        return False

    pending = json.loads(pending_raw)
    redis.delete(f"jarvis:code:pending:{chat_id}")

    send_message(chat_id, "Got it. Executing now...")

    reply, files_changed = execute(
        pending['original_message'],
        pending['model'],
        pending['context'],
        pending['project_path'],
    )
    send_message(chat_id, reply)
    _get_redis().set('jarvis:last_execution', json.dumps({
        'message': pending['original_message'],
        'result': reply,
        'files_changed': files_changed,
        'project': os.path.basename(pending['project_path']),
        'timestamp': __import__('datetime').datetime.now().isoformat(),
    }))
    return True


def run() -> None:
    """Main polling loop."""
    import sys
    from telegram_client import send_message

    log_path = Path(__file__).parent / 'daemon.log'
    log = open(log_path, 'a', buffering=1)

    def log_print(msg: str) -> None:
        import datetime
        line = f"[{datetime.datetime.now().isoformat()}] {msg}"
        print(line, flush=True)
        log.write(line + '\n')

    log_print(f"Daemon starting. Polling every {POLL_INTERVAL}s.")
    try:
        send_message(CHAT_ID, "JARVIS daemon online. Ready for commands.")
        log_print("Startup message sent to Telegram.")
    except Exception as e:
        log_print(f"Warning: startup message failed: {e}")

    while True:
        try:
            # Pop job from queue
            raw = _get_redis().lpop('jarvis:code:queue')
            if raw:
                job = parse_job(raw if isinstance(raw, str) else json.dumps(raw))

                # Check if this is a confirmation response
                message = job.get('message', '')
                chat_id = job.get('chat_id', CHAT_ID)

                if is_confirmation(message):
                    handled = process_confirmation(chat_id)
                    if not handled:
                        pass  # Confirmation with no pending job — ignore
                else:
                    # Verify passphrase
                    if not verify_auth(message, PASSPHRASE):
                        send_message(chat_id, "Missing passphrase. Command ignored.")
                    else:
                        # Strip passphrase from message before processing
                        clean_message = re.sub(
                            re.escape(PASSPHRASE), '', message, flags=re.IGNORECASE
                        ).strip()
                        job['message'] = clean_message
                        process_job(job)

        except Exception as e:
            log_print(f"Error: {e}")
            try:
                send_message(CHAT_ID, f"Something went wrong in the daemon: {e}")
            except Exception:
                pass

        time.sleep(POLL_INTERVAL)


if __name__ == '__main__':
    run()
