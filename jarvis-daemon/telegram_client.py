import os
import requests
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
BASE_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"


def send_message(chat_id: int, text: str) -> None:
    """Send a Telegram message to chat_id."""
    requests.post(
        f"{BASE_URL}/sendMessage",
        json={"chat_id": chat_id, "text": text, "parse_mode": "Markdown"},
        timeout=10,
    )
