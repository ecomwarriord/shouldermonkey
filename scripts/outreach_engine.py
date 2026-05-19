"""
ShoulderMonkey Outreach Engine
Runs daily via Task Scheduler. Handles enrolment + sequenced email + SMS sending.

Tracking tags on each contact:
  outreach:active           — in sequence
  outreach:complete         — finished sequence
  outreach:replied          — replied (exit condition)
  batch:YYYY-MM-DD          — enrolment date (drives timing)
  sent:email1-5             — which emails sent
  sent:sms1-3               — which SMS sent

Email+SMS sequence (has:email contacts):
  Day 0  → Email 1
  Day 1  → SMS 1   (if has:mobile)
  Day 3  → Email 2
  Day 6  → Email 3
  Day 8  → SMS 2   (if has:mobile)
  Day 10 → SMS 3   (if has:mobile)
  Day 11 → Email 4
  Day 13 → Email 5
  Day 14+ → mark complete

SMS-only sequence (no email, has:mobile):
  Day 0  → SMS 1
  Day 5  → SMS 2
  Day 10 → SMS 3 (final)
  Day 11 → mark complete
"""

import os
import sys
import time
import requests
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

# Fix Windows console unicode
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# Load from .env.local (Next.js convention — same file used by the Next.js app)
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env.local"))

GHL_TOKEN      = os.environ["GHL_TOKEN"]
GHL_LOCATION   = os.environ.get("GHL_LOCATION_ID", os.environ.get("GHL_LOCATION", ""))
GHL_FROM_EMAIL = os.getenv("GHL_FROM_EMAIL", "dee@mail.shouldermonkey.co")
GHL_FROM_NAME  = os.getenv("GHL_FROM_NAME", "Dee")
BASE_URL       = "https://services.leadconnectorhq.com"
HEADERS        = {
    "Authorization": f"Bearer {GHL_TOKEN}",
    "Version":       "2021-07-28",
    "Content-Type":  "application/json",
}

DAILY_ENROL_LIMIT = 100  # contacts to enrol per day (manageable volume)

# ─── SMS copy per vertical ───────────────────────────────────────────────────

SMS = {
    "vertical:salons": {
        1: "Hey! Noticed {{company_name}}'s website could be doing a lot more for you. Built something to show what's possible — text me if you want a look. Dee 0424 841 204",
        2: "Hey, Dee here. Following up on that message about {{company_name}}'s website. Reckon there's a real opportunity here. Text me back. 0424 841 204",
        3: "Last one from me. If the website is ever on the radar, you know where I am. 0424 841 204 Dee",
    },
    "vertical:gyms": {
        1: "Hey! Noticed {{company_name}}'s website could be doing a lot more for your gym. Built something to show what's possible — text me if you want a look. Dee 0424 841 204",
        2: "Hey, Dee here. Following up on that message about {{company_name}}'s website. Reckon there's a real opportunity here. Text me back. 0424 841 204",
        3: "Last one from me. If the website is ever on the radar, you know where I am. 0424 841 204 Dee",
    },
    "vertical:clinics": {
        1: "Hi, I noticed {{company_name}}'s website could be working harder for your practice. Happy to show you what's possible — text me anytime. Dee 0424 841 204",
        2: "Hi, Dee here. Following up on that message about {{company_name}}'s website. Happy to put together a free demo with no obligation. Dee 0424 841 204",
        3: "Last follow-up from me. If this is ever something you'd like to revisit, I'm easy to reach. Dee 0424 841 204",
    },
    "vertical:allied_health": {
        1: "Hi, I noticed {{company_name}}'s website could be working harder for your practice. Happy to show you what's possible — text me anytime. Dee 0424 841 204",
        2: "Hi, Dee here. Following up on that message about {{company_name}}'s website. Happy to put together a free demo with no obligation. Dee 0424 841 204",
        3: "Last follow-up from me. If this is ever something you'd like to revisit, I'm easy to reach. Dee 0424 841 204",
    },
    "vertical:mortgage_brokers": {
        1: "Hi, I noticed {{company_name}}'s online presence could be working harder for your brokerage. Happy to show you what's possible — text me anytime. Dee 0424 841 204",
        2: "Hi, Dee here. Following up regarding {{company_name}}'s website. Happy to provide a free mock-up with no obligation. Dee 0424 841 204",
        3: "Final follow-up from me. If this is something you'd like to revisit, I'm easy to reach. Dee 0424 841 204",
    },
}

# ─── GHL API helpers ──────────────────────────────────────────────────────────

def get_contacts(tag_filter=None, limit=100, after=None):
    params = {"locationId": GHL_LOCATION, "limit": limit}
    if tag_filter:
        params["query"] = tag_filter
    if after:
        params["startAfter"] = after
    r = requests.get(f"{BASE_URL}/contacts/", headers=HEADERS, params=params)
    r.raise_for_status()
    return r.json()


def get_all_contacts_with_tag(tag):
    """Paginate through all contacts and filter by tag client-side."""
    contacts = []
    start_after = None
    start_after_id = None
    while True:
        params = {"locationId": GHL_LOCATION, "limit": 100}
        if start_after:
            params["startAfter"] = start_after
            params["startAfterId"] = start_after_id
        r = requests.get(f"{BASE_URL}/contacts/", headers=HEADERS, params=params)
        r.raise_for_status()
        data = r.json()
        batch = data.get("contacts", [])
        if not batch:
            break
        for c in batch:
            if tag in c.get("tags", []):
                contacts.append(c)
        meta = data.get("meta", {})
        if not meta.get("nextPageUrl"):
            break
        start_after = meta["startAfter"]
        start_after_id = meta["startAfterId"]
    return contacts


def add_tags(contact_id, tags):
    r = requests.post(
        f"{BASE_URL}/contacts/{contact_id}/tags",
        headers=HEADERS,
        json={"tags": tags},
    )
    r.raise_for_status()


def remove_tags(contact_id, tags):
    r = requests.delete(
        f"{BASE_URL}/contacts/{contact_id}/tags",
        headers=HEADERS,
        json={"tags": tags},
    )
    r.raise_for_status()


def send_sms(contact_id, message):
    r = requests.post(
        f"{BASE_URL}/conversations/messages",
        headers=HEADERS,
        json={"type": "SMS", "contactId": contact_id, "message": message},
    )
    r.raise_for_status()
    return r.json()


def has_replied(contact_id):
    """Check if contact has any inbound messages (replied)."""
    r = requests.get(
        f"{BASE_URL}/conversations/search",
        headers=HEADERS,
        params={"locationId": GHL_LOCATION, "contactId": contact_id},
    )
    if r.status_code != 200:
        return False
    convos = r.json().get("conversations", [])
    for c in convos:
        if c.get("lastMessageDirection") == "inbound":
            return True
    return False


# ─── Core logic ───────────────────────────────────────────────────────────────

def get_vertical(tags):
    for t in tags:
        if t.startswith("vertical:"):
            return t
    return None


def get_batch_date(tags):
    for t in tags:
        if t.startswith("batch:"):
            try:
                return datetime.strptime(t[6:], "%Y-%m-%d").date()
            except:
                pass
    return None


def build_message(template, contact):
    company = contact.get("companyName") or contact.get("contactName") or "your business"
    return template.replace("{{company_name}}", company)


def enrol_new_contacts(today_str, today_date, dry_run=False):
    """Find un-enrolled contacts with phone numbers and enrol them."""
    print(f"\n{'[DRY RUN] ' if dry_run else ''}=== ENROLMENT ({today_str}) ===")
    enrolled = 0

    for vertical_tag in SMS.keys():
        if enrolled >= DAILY_ENROL_LIMIT:
            break

        # Get contacts with this vertical tag who aren't yet in outreach
        all_contacts = get_all_contacts_with_tag(vertical_tag)
        eligible = []
        for c in all_contacts:
            tags = c.get("tags", [])
            if ("outreach:active" not in tags
                    and "outreach:complete" not in tags
                    and "outreach:replied" not in tags
                    and c.get("phone")):
                eligible.append(c)

        limit = min(DAILY_ENROL_LIMIT - enrolled, len(eligible))
        batch = eligible[:limit]

        print(f"  {vertical_tag}: {len(eligible)} eligible, enrolling {len(batch)}")

        for c in batch:
            if dry_run:
                print(f"    [DRY RUN] Would enrol: {c.get('companyName')} ({c['id']})")
                continue
            try:
                new_tags = ["outreach:active", f"batch:{today_str}"]
                add_tags(c["id"], new_tags)
                # Send SMS 1 immediately on enrolment
                vertical = get_vertical(c.get("tags", []))
                if vertical and vertical in SMS:
                    msg = build_message(SMS[vertical][1], c)
                    send_sms(c["id"], msg)
                    add_tags(c["id"], ["sent:sms1"])
                    print(f"    ✓ Enrolled + SMS1: {c.get('companyName','?')} ({c['phone']})")
                time.sleep(0.3)  # rate limit
                enrolled += 1
            except Exception as e:
                print(f"    ✗ Error enrolling {c.get('id')}: {e}")

    print(f"  Total enrolled today: {enrolled}")


def run_sequence(today_date, dry_run=False):
    """Send follow-up messages to contacts already in the sequence."""
    print(f"\n{'[DRY RUN] ' if dry_run else ''}=== SEQUENCE RUN ({today_date}) ===")

    active = get_all_contacts_with_tag("outreach:active")
    print(f"  Active contacts: {len(active)}")

    sms2_sent = sms3_sent = completed = replied_exits = 0

    for c in active:
        contact_id = c["id"]
        tags        = c.get("tags", [])
        vertical    = get_vertical(tags)

        if not vertical or vertical not in SMS:
            continue

        # Check if replied
        if "outreach:replied" in tags:
            continue

        if has_replied(contact_id):
            if not dry_run:
                add_tags(contact_id, ["outreach:replied"])
                remove_tags(contact_id, ["outreach:active"])
            print(f"    → Replied exit: {c.get('companyName','?')}")
            replied_exits += 1
            continue

        batch_date = get_batch_date(tags)
        if not batch_date:
            continue

        days_elapsed = (today_date - batch_date).days

        # Day 5 → SMS 2
        if days_elapsed == 5 and "sent:sms2" not in tags:
            if dry_run:
                print(f"    [DRY RUN] SMS2 → {c.get('companyName','?')} (day {days_elapsed})")
            else:
                try:
                    msg = build_message(SMS[vertical][2], c)
                    send_sms(contact_id, msg)
                    add_tags(contact_id, ["sent:sms2"])
                    print(f"    ✓ SMS2: {c.get('companyName','?')} ({c.get('phone','')})")
                    sms2_sent += 1
                    time.sleep(0.3)
                except Exception as e:
                    print(f"    ✗ SMS2 error {contact_id}: {e}")

        # Day 10 → SMS 3 (final)
        elif days_elapsed == 10 and "sent:sms3" not in tags:
            if dry_run:
                print(f"    [DRY RUN] SMS3 → {c.get('companyName','?')} (day {days_elapsed})")
            else:
                try:
                    msg = build_message(SMS[vertical][3], c)
                    send_sms(contact_id, msg)
                    add_tags(contact_id, ["sent:sms3"])
                    print(f"    ✓ SMS3 (final): {c.get('companyName','?')} ({c.get('phone','')})")
                    sms3_sent += 1
                    time.sleep(0.3)
                except Exception as e:
                    print(f"    ✗ SMS3 error {contact_id}: {e}")

        # Day 11+ → complete
        elif days_elapsed >= 11 and "sent:sms3" in tags:
            if not dry_run:
                remove_tags(contact_id, ["outreach:active"])
                add_tags(contact_id, ["outreach:complete"])
            completed += 1

    print(f"  SMS2 sent: {sms2_sent} | SMS3 sent: {sms3_sent} | Completed: {completed} | Replied exits: {replied_exits}")


def status_report():
    """Print a quick status of where the outreach is."""
    print("\n=== OUTREACH STATUS ===")
    for label, tag in [
        ("Active",    "outreach:active"),
        ("Complete",  "outreach:complete"),
        ("Replied",   "outreach:replied"),
    ]:
        contacts = get_all_contacts_with_tag(tag)
        print(f"  {label:12} {len(contacts)}")


# ─── Entry point ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    mode     = sys.argv[1] if len(sys.argv) > 1 else "run"
    dry_run  = "--dry-run" in sys.argv
    today    = datetime.now(timezone.utc).date()
    today_str = today.strftime("%Y-%m-%d")

    print(f"ShoulderMonkey Outreach Engine — {today_str}")
    print(f"Mode: {mode} {'(DRY RUN)' if dry_run else ''}")

    if mode == "status":
        status_report()

    elif mode == "enrol":
        enrol_new_contacts(today_str, today, dry_run=dry_run)

    elif mode == "run":
        run_sequence(today, dry_run=dry_run)

    elif mode == "daily":
        # Full daily job: run sequence first, then enrol new batch
        run_sequence(today, dry_run=dry_run)
        enrol_new_contacts(today_str, today, dry_run=dry_run)
        status_report()

    else:
        print(f"Unknown mode: {mode}")
        print("Usage: python outreach_engine.py [status|enrol|run|daily] [--dry-run]")
