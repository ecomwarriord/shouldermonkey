from unittest.mock import patch, MagicMock
from telegram_client import send_message


def test_send_message_calls_correct_endpoint():
    with patch('telegram_client.requests.post') as mock_post:
        mock_post.return_value = MagicMock(status_code=200)
        send_message(chat_id=706738923, text="Hello Dee")
        mock_post.assert_called_once()
        call_args = mock_post.call_args
        assert 'sendMessage' in call_args[0][0]
        assert call_args[1]['json']['chat_id'] == 706738923
        assert call_args[1]['json']['text'] == "Hello Dee"


def test_send_message_uses_markdown():
    with patch('telegram_client.requests.post') as mock_post:
        mock_post.return_value = MagicMock(status_code=200)
        send_message(chat_id=706738923, text="*bold*")
        call_args = mock_post.call_args
        assert call_args[1]['json']['parse_mode'] == 'Markdown'
