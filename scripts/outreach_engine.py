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

# ─── Email copy per vertical ──────────────────────────────────────────────────

BOOKING_LINK = "https://api.shouldermonkey.co/widget/booking/8U5JLwmKnUeDVkD4ATNm"
_UTM = "utm_source=outreach&utm_medium=email"
_F = '---\nShoulderMonkey | Sydney, NSW\n<a href="{unsubscribe}">Unsubscribe</a>'

def _demo(path: str, campaign: str, email_num: int, label: str) -> str:
    url = f"https://shouldermonkey.co/{path}?{_UTM}&utm_campaign={campaign}&utm_content=email{email_num}"
    return f'<a href="{url}">{label}</a>'

def _book(campaign: str, email_num: int) -> str:
    url = f"{BOOKING_LINK}?{_UTM}&utm_campaign={campaign}&utm_content=email{email_num}"
    return f'<a href="{url}">Book a 15-min call</a>'

EMAIL = {
    "vertical:salons": {
        "subjects": {
            1: "{company}",
            2: "Re: {company}", 3: "Re: {company}", 4: "Re: {company}", 5: "Re: {company}",
        },
        "bodies": {
            1: "I built a demo to show what your salon's website could look like — and how it could work for your business. If it resonates, I can build your version and have it live in 7 days.\n\nHey,\n\nNoticed {company}'s website could be working a lot harder for you.\n\nHad a look and reckon we could do something much better — get a lot more customers finding you online.\n\nHere's what we built for a salon like yours: " + _demo("salon","salons",1,"Salon Demo") + "\n\nFlick me a text or WhatsApp if you want me to put something together specifically for {company}. 0424 841 204\n\nDee\n" + _F,
            2: "Hey,\n\nReached out a few days ago about your website — have you had a chance to look at that demo I sent through?\n\nReckon you'd get a lot more out of your online presence. And it's not gonna break the bank either.\n\nLet me know what you think.\n\nDee 0424 841 204\n" + _F,
            3: "Hey,\n\nQuick one — most people searching for a salon in {city} are doing it on their phone. If your site doesn't load well on mobile, they're bouncing straight to the next result.\n\nWorth a look at what we'd fix: " + _demo("salon","salons",3,"Salon Demo") + "\n\nText me if you want to chat. 0424 841 204\n\nDee\n" + _F,
            4: "Hey,\n\nLast one before I leave you alone.\n\nHappy to put together a free mock-up of what we'd build for {company} before you commit to anything. No strings attached.\n\n" + _book("salons",4) + "\n\nOr just text. 0424 841 204\n\nDee\n" + _F,
            5: "Alright, I'll leave you to it.\n\nIf you ever want to see what a proper website could do for {company}, the demo's still there: " + _demo("salon","salons",5,"Salon Demo") + "\n\nAnd if you decide to go for it down the track, feel free to text anytime. 0424 841 204\n\nAll the best, Dee\n" + _F,
        },
    },
    "vertical:gyms": {
        "subjects": {
            1: "{company}", 2: "Re: {company}", 3: "Re: {company}", 4: "Re: {company}", 5: "Re: {company}",
        },
        "bodies": {
            1: "I built a demo to show what your gym's website could look like — and how it could work for your business. If it resonates, I can build your version and have it live in 7 days.\n\nHey,\n\nNoticed {company}'s website could be working a lot harder for you.\n\nHad a look and reckon we could do something much better — get a lot more members finding you online.\n\nHere's what we built for a gym like yours: " + _demo("gym","gyms",1,"Gym Demo") + "\n\nFlick me a text or WhatsApp if you want me to put something together specifically for {company}. 0424 841 204\n\nDee\n" + _F,
            2: "Hey,\n\nReached out a few days ago about your website — have you had a chance to look at that demo I sent through?\n\nReckon you'd get a lot more out of your online presence. And it's not gonna break the bank either.\n\nLet me know what you think.\n\nDee 0424 841 204\n" + _F,
            3: "Hey,\n\nQuick one — most people searching for a gym in {city} are doing it on their phone. If your site doesn't load well on mobile, they're bouncing straight to the next result.\n\nWorth a look at what we'd fix: " + _demo("gym","gyms",3,"Gym Demo") + "\n\nText me if you want to chat. 0424 841 204\n\nDee\n" + _F,
            4: "Hey,\n\nLast one before I leave you alone.\n\nHappy to put together a free mock-up of what we'd build for {company} before you commit to anything. No strings attached.\n\n" + _book("gyms",4) + "\n\nOr just text. 0424 841 204\n\nDee\n" + _F,
            5: "Alright, I'll leave you to it.\n\nIf you ever want to see what a proper website could do for {company}, the demo's still there: " + _demo("gym","gyms",5,"Gym Demo") + "\n\nAnd if you decide to go for it down the track, feel free to text anytime. 0424 841 204\n\nAll the best, Dee\n" + _F,
        },
    },
    "vertical:clinics": {
        "subjects": {
            1: "{company} — your website", 2: "Re: {company}", 3: "Re: {company}", 4: "Re: {company}", 5: "Re: {company}",
        },
        "bodies": {
            1: "I built a demo to show what your clinic's website could look like — and how it could work for your business. If it resonates, I can build your version and have it live in 7 days.\n\nHi,\n\nNoticed {company}'s website could be working a lot harder for you.\n\nI help clinics and health practices in {city} build websites that bring in patients and build trust before the first appointment. Most practices I come across are leaving a lot on the table online.\n\nHere's an example of what we build for practices like yours: " + _demo("clinic","clinics",1,"Clinic Demo") + "\n\nHappy to answer any questions — feel free to text or reply. 0424 841 204\n\nDee\n" + _F,
            2: "Hi,\n\nJust following up on the email I sent about your website — have you had a chance to take a look at the demo?\n\nA well-built site does a lot of the selling before a patient even calls. It's worth getting right, and it doesn't cost as much as most practices expect.\n\nLet me know if you'd like to talk it through.\n\nDee 0424 841 204\n" + _F,
            3: "Hi,\n\nOne thing I see consistently with health practice websites — the majority of patients are now searching on mobile, but most sites are still built for desktop. If {company}'s site isn't optimised for mobile, a significant chunk of potential patients are going elsewhere.\n\nHere's how we address it: " + _demo("clinic","clinics",3,"Clinic Demo") + "\n\nHappy to walk you through it if that's helpful.\n\nDee 0424 841 204\n" + _F,
            4: "Hi,\n\nI'll keep this short — if you'd like to see what we'd actually build for {company} before making any decisions, I'm happy to put together a free mock-up. No obligation.\n\n" + _book("clinics",4) + "\n\nOr text me directly. 0424 841 204\n\nDee\n" + _F,
            5: "Hi,\n\nI'll leave it here — I've followed up a few times and don't want to take up more of your time.\n\nIf you'd like to revisit this at any point, the demo is still live: " + _demo("clinic","clinics",5,"Clinic Demo") + "\n\nAnd I'm easy to reach by text whenever it suits you. 0424 841 204\n\nBest, Dee\n" + _F,
        },
    },
    "vertical:allied_health": {
        "subjects": {
            1: "{company} — your website", 2: "Re: {company}", 3: "Re: {company}", 4: "Re: {company}", 5: "Re: {company}",
        },
        "bodies": {
            1: "I built a demo to show what your practice's website could look like — and how it could work for your business. If it resonates, I can build your version and have it live in 7 days.\n\nHi,\n\nNoticed {company}'s website could be working a lot harder for you.\n\nI help allied health professionals in {city} build websites that bring in patients and build trust before the first appointment. Most practices I come across are leaving a lot on the table online.\n\nHere's an example of what we build: " + _demo("allied-health","allied_health",1,"Allied Health Demo") + "\n\nHappy to answer any questions — feel free to text or reply. 0424 841 204\n\nDee\n" + _F,
            2: "Hi,\n\nJust following up on the email I sent about your website — have you had a chance to take a look at the demo?\n\nA well-built site does a lot of the selling before a patient even calls. It's worth getting right, and it doesn't cost as much as most practices expect.\n\nLet me know if you'd like to talk it through.\n\nDee 0424 841 204\n" + _F,
            3: "Hi,\n\nOne thing I see consistently with allied health websites — the majority of patients are now searching on mobile, but most sites are still built for desktop. If {company}'s site isn't optimised for mobile, a significant chunk of potential patients — whether you're a physio, chiro, or osteo — are going elsewhere.\n\nHere's how we address it: " + _demo("allied-health","allied_health",3,"Allied Health Demo") + "\n\nHappy to walk you through it.\n\nDee 0424 841 204\n" + _F,
            4: "Hi,\n\nI'll keep this short — if you'd like to see what we'd actually build for {company} before making any decisions, I'm happy to put together a free mock-up. No obligation.\n\n" + _book("allied_health",4) + "\n\nOr text me directly. 0424 841 204\n\nDee\n" + _F,
            5: "Hi,\n\nI'll leave it here — I've followed up a few times and don't want to take up more of your time.\n\nIf you'd like to revisit this at any point, the demo is still live: " + _demo("allied-health","allied_health",5,"Allied Health Demo") + "\n\nAnd I'm easy to reach by text whenever it suits you. 0424 841 204\n\nBest, Dee\n" + _F,
        },
    },
    "vertical:mortgage_brokers": {
        "subjects": {
            1: "{company} — online presence", 2: "Re: {company}", 3: "Re: {company}", 4: "Re: {company}", 5: "Re: {company}",
        },
        "bodies": {
            1: "I built a demo to show what your brokerage's website could look like — and how it could work for your business. If it resonates, I can build your version and have it live in 7 days.\n\nHi,\n\nNoticed {company}'s website could be working a lot harder for you.\n\nI work with mortgage brokers and financial professionals across {city} to build websites that establish credibility and convert online enquiries. For most brokers, the website is the first impression a prospective client gets — and it matters more than most realise.\n\nHere's an example of what we build for brokers in a similar position: " + _demo("mortgage-broker","mortgage_brokers",1,"Broker Demo") + "\n\nI'd be glad to discuss how this might apply to {company}.\n\nDee 0424 841 204\n" + _F,
            2: "Hi,\n\nFollowing up on the email I sent regarding your website — have you had a chance to review the demo?\n\nA professional, well-structured website builds trust before you've had the first conversation with a client. It's one of the higher-return investments a broker can make, and typically costs far less than expected.\n\nLet me know if you'd like to discuss further.\n\nDee 0424 841 204\n" + _F,
            3: "Hi,\n\nOne thing worth noting: prospective financial services clients consistently research their broker online before making contact. A site that looks dated or doesn't load correctly on mobile creates doubt before the relationship has started.\n\nHere's how we approach this for brokers: " + _demo("mortgage-broker","mortgage_brokers",3,"Broker Demo") + "\n\nHappy to walk through it with you.\n\nDee 0424 841 204\n" + _F,
            4: "Hi,\n\nOne final note — if you'd like to see a mock-up of what we'd build for {company} before committing to anything, I'm happy to provide that at no cost.\n\n" + _book("mortgage_brokers",4) + "\n\nAlternatively, feel free to text directly. 0424 841 204\n\nDee\n" + _F,
            5: "Hi,\n\nI'll leave it there — I've reached out several times and don't want to take up more of your time.\n\nThe demo remains available if you'd like to revisit: " + _demo("mortgage-broker","mortgage_brokers",5,"Broker Demo") + "\n\nAnd I'm easy to reach whenever it suits. 0424 841 204\n\nBest regards, Dee\n" + _F,
        },
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


def send_email(contact_id: str, contact_email: str, subject: str, body: str) -> dict:
    """Send email via GHL conversations API."""
    html_body = body.replace("\n", "<br>")
    r = requests.post(
        f"{BASE_URL}/conversations/messages",
        headers=HEADERS,
        json={
            "type": "Email",
            "contactId": contact_id,
            "subject": subject,
            "html": html_body,
            "emailFrom": f"{GHL_FROM_NAME} <{GHL_FROM_EMAIL}>",
            "emailTo": contact_email,
        },
        timeout=15,
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


def build_email_message(template: str, contact: dict) -> str:
    company = contact.get("companyName") or contact.get("contactName") or "your business"
    city    = contact.get("city") or "your area"
    unsub   = contact.get("unsubscribeUrl") or "Reply to unsubscribe"
    return (template
            .replace("{company}", company)
            .replace("{city}", city)
            .replace("{unsubscribe}", unsub))


def enrol_new_contacts(today_str, today_date, dry_run=False):
    """Enrol new contacts. Email 1 sent for has:email; SMS 1 for SMS-only."""
    print(f"\n{'[DRY RUN] ' if dry_run else ''}=== ENROLMENT ({today_str}) ===")
    enrolled = 0

    for vertical_tag in SMS.keys():
        if enrolled >= DAILY_ENROL_LIMIT:
            break

        all_contacts = get_all_contacts_with_tag(vertical_tag)
        eligible = [
            c for c in all_contacts
            if "outreach:active" not in c.get("tags", [])
            and "outreach:complete" not in c.get("tags", [])
            and "outreach:replied" not in c.get("tags", [])
            and (c.get("phone") or c.get("email"))
        ]

        limit = min(DAILY_ENROL_LIMIT - enrolled, len(eligible))
        batch = eligible[:limit]
        print(f"  {vertical_tag}: {len(eligible)} eligible, enrolling {len(batch)}")

        for c in batch:
            if dry_run:
                print(f"    [DRY RUN] Would enrol: {c.get('companyName')} ({c['id']})")
                continue
            try:
                tags     = c.get("tags", [])
                vertical = get_vertical(tags)
                add_tags(c["id"], ["outreach:active", f"batch:{today_str}"])

                has_email  = "has:email" in tags and c.get("email")
                has_mobile = "has:mobile" in tags

                if has_email and vertical in EMAIL:
                    tmpl    = EMAIL[vertical]
                    subject = tmpl["subjects"][1].format(company=c.get("companyName", ""))
                    body    = build_email_message(tmpl["bodies"][1], c)
                    send_email(c["id"], c["email"], subject, body)
                    add_tags(c["id"], ["sent:email1"])
                    print(f"    ✓ Enrolled + Email1: {c.get('companyName','?')} ({c.get('email','')})")
                elif has_mobile and vertical in SMS:
                    msg = build_message(SMS[vertical][1], c)
                    send_sms(c["id"], msg)
                    add_tags(c["id"], ["sent:sms1"])
                    print(f"    ✓ Enrolled + SMS1: {c.get('companyName','?')} ({c.get('phone','')})")

                time.sleep(0.3)
                enrolled += 1
            except Exception as e:
                print(f"    ✗ Error enrolling {c.get('id')}: {e}")

    print(f"  Total enrolled today: {enrolled}")


def run_sequence(today_date, dry_run=False):
    """Send follow-ups to active contacts based on days since enrolment."""
    print(f"\n{'[DRY RUN] ' if dry_run else ''}=== SEQUENCE RUN ({today_date}) ===")

    active = get_all_contacts_with_tag("outreach:active")
    print(f"  Active contacts: {len(active)}")

    counters = {k: 0 for k in ("e2","e3","e4","e5","sms1","sms2","sms3","completed","replied")}

    for c in active:
        cid      = c["id"]
        tags     = c.get("tags", [])
        vertical = get_vertical(tags)
        if not vertical:
            continue
        if "outreach:replied" in tags:
            continue

        if has_replied(cid):
            if not dry_run:
                add_tags(cid, ["outreach:replied"])
                remove_tags(cid, ["outreach:active"])
            counters["replied"] += 1
            continue

        batch_date = get_batch_date(tags)
        if not batch_date:
            continue
        d = (today_date - batch_date).days

        has_email  = "has:email" in tags and c.get("email")
        has_mobile = "has:mobile" in tags

        # ── Email path ──────────────────────────────────────────────────────
        if has_email and vertical in EMAIL:
            tmpl = EMAIL[vertical]

            def _email(num, key):
                if dry_run:
                    print(f"    [DRY RUN] Email{num} → {c.get('companyName','?')} (d{d})")
                    return
                try:
                    subj = tmpl["subjects"][num].format(company=c.get("companyName", ""))
                    body = build_email_message(tmpl["bodies"][num], c)
                    send_email(cid, c["email"], subj, body)
                    add_tags(cid, [f"sent:email{num}"])
                    print(f"    ✓ Email{num}: {c.get('companyName','?')}")
                    counters[key] += 1
                    time.sleep(0.3)
                except Exception as e:
                    print(f"    ✗ Email{num} error {cid}: {e}")

            def _sms(num, key):
                if not has_mobile:
                    return
                if dry_run:
                    print(f"    [DRY RUN] SMS{num} → {c.get('companyName','?')} (d{d})")
                    return
                try:
                    send_sms(cid, build_message(SMS[vertical][num], c))
                    add_tags(cid, [f"sent:sms{num}"])
                    print(f"    ✓ SMS{num}: {c.get('companyName','?')}")
                    counters[key] += 1
                    time.sleep(0.3)
                except Exception as e:
                    print(f"    ✗ SMS{num} error {cid}: {e}")

            if   d == 1  and "sent:sms1"   not in tags: _sms(1, "sms1")
            elif d == 3  and "sent:email2" not in tags: _email(2, "e2")
            elif d == 6  and "sent:email3" not in tags: _email(3, "e3")
            elif d == 8  and "sent:sms2"   not in tags: _sms(2, "sms2")
            elif d == 10 and "sent:sms3"   not in tags: _sms(3, "sms3")
            elif d == 11 and "sent:email4" not in tags: _email(4, "e4")
            elif d == 13 and "sent:email5" not in tags: _email(5, "e5")
            elif d >= 14 and "sent:email5" in tags:
                if not dry_run:
                    remove_tags(cid, ["outreach:active"])
                    add_tags(cid, ["outreach:complete"])
                counters["completed"] += 1

        # ── SMS-only path ───────────────────────────────────────────────────
        elif has_mobile and vertical in SMS:
            try:
                if   d == 5  and "sent:sms2" not in tags:
                    if dry_run: print(f"    [DRY RUN] SMS2 → {c.get('companyName','?')} (d{d})")
                    else:
                        send_sms(cid, build_message(SMS[vertical][2], c))
                        add_tags(cid, ["sent:sms2"])
                        print(f"    ✓ SMS2: {c.get('companyName','?')}")
                        counters["sms2"] += 1
                        time.sleep(0.3)
                elif d == 10 and "sent:sms3" not in tags:
                    if dry_run: print(f"    [DRY RUN] SMS3 → {c.get('companyName','?')} (d{d})")
                    else:
                        send_sms(cid, build_message(SMS[vertical][3], c))
                        add_tags(cid, ["sent:sms3"])
                        print(f"    ✓ SMS3: {c.get('companyName','?')}")
                        counters["sms3"] += 1
                        time.sleep(0.3)
                elif d >= 11 and "sent:sms3" in tags:
                    if not dry_run:
                        remove_tags(cid, ["outreach:active"])
                        add_tags(cid, ["outreach:complete"])
                    counters["completed"] += 1
            except Exception as e:
                print(f"    ✗ Error {cid}: {e}")

    print(f"  Email: e2={counters['e2']} e3={counters['e3']} e4={counters['e4']} e5={counters['e5']}")
    print(f"  SMS:   1={counters['sms1']} 2={counters['sms2']} 3={counters['sms3']}")
    print(f"  Completed: {counters['completed']} | Replied: {counters['replied']}")


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
