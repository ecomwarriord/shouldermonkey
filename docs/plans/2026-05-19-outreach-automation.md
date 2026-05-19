# ShoulderMonkey Outreach Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fully automated email + SMS outreach engine that reads NeverBounce-verified leads, updates GHL contacts with emails, and runs a 14-day multi-touch sequence daily via Windows Task Scheduler.

**Architecture:** Python scripts read verified CSVs, upsert contacts in GHL via REST API, then a daily scheduler runs `outreach_engine.py` which enrolls 100 new contacts per day and sends the right email/SMS at each day offset using tag-based state tracking (no GHL workflow builder needed).

**Tech Stack:** Python 3.x, GHL REST API v2021-07-28, `phonenumbers` library (E.164 normalisation), `requests`, `python-dotenv`, Windows Task Scheduler

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `scripts/enriched/*.valids.csv` | SAVE (5 files) | NeverBounce-verified leads from Dee |
| `.env.local` | MODIFY | Move GHL token here, add from address |
| `scripts/ghl-email-update.py` | CREATE | Match verified emails to GHL contacts by phone, add email + `has:email` tag |
| `scripts/outreach_engine.py` | MODIFY | Load token from env; add full email sequence alongside existing SMS logic |
| `scripts/start-outreach.bat` | CREATE | Batch file for Windows Task Scheduler to call daily |

---

## Task 1: Save Verified CSV Files

**Files:**
- Create: `scripts/enriched/allied_health.valids.csv`
- Create: `scripts/enriched/clinics.valids.csv`
- Create: `scripts/enriched/gyms.valids.csv`
- Create: `scripts/enriched/mortgage_brokers.valids.csv`
- Create: `scripts/enriched/salons.valids.csv`

The five `.valids.csv` files from NeverBounce must be saved to `scripts/enriched/`. They were shared in the session and contain the verified leads.

- [ ] **Step 1: Save the 5 NeverBounce output files**

Save each attachment from the session into `C:\Users\derol\Documents\Claude\Code Projects\shouldermonkey\scripts\enriched\` with filenames:
- `allied_health.valids.csv`
- `clinics.valids.csv`
- `gyms.valids.csv`
- `mortgage_brokers.valids.csv`
- `salons.valids.csv`

Column format (confirmed): `Business Name, Phone, Address, Website, Website Status, Website Notes, Email, Rating, Review Count, Google Maps URL, Vertical, City, Tags, Mobile, email_status`

- [ ] **Step 2: Verify files are present**

```powershell
Get-ChildItem "C:\Users\derol\Documents\Claude\Code Projects\shouldermonkey\scripts\enriched" -Filter "*.valids.csv"
```

Expected: 5 files listed.

- [ ] **Step 3: Spot-check row count**

```powershell
$dir = "C:\Users\derol\Documents\Claude\Code Projects\shouldermonkey\scripts\enriched"
foreach ($f in Get-ChildItem $dir -Filter "*.valids.csv") {
    $rows = (Import-Csv $f.FullName).Count
    Write-Output "$($f.Name): $rows rows"
}
```

Expected approximate counts: allied_health ~268, clinics ~363, gyms ~224, mortgage_brokers ~129, salons ~178 (total ~1,162).

- [ ] **Step 4: Commit**

```bash
cd "C:\Users\derol\Documents\Claude\Code Projects\shouldermonkey"
git add scripts/enriched/*.valids.csv
git commit -m "feat: add NeverBounce-verified email CSVs for all 5 verticals"
```

---

## Task 2: Fix Security — Move GHL Credentials to Env

**Files:**
- Modify: `.env.local`
- Modify: `scripts/outreach_engine.py` (lines 31–38)

The GHL API token is currently hardcoded on line 31 of `outreach_engine.py`. Move it to `.env.local` and load via `python-dotenv`.

- [ ] **Step 1: Install python-dotenv**

```bash
pip install python-dotenv phonenumbers -q
```

Expected: installed without errors.

- [ ] **Step 2: Add GHL credentials to .env.local**

Open `.env.local` and add these lines (the file already exists with Next.js env vars — append to it):

```
GHL_TOKEN=pit-791e22b0-710c-4790-8520-4958fbb722c5
GHL_LOCATION=1VSwRCgoLwovLpXjZd1h
GHL_FROM_EMAIL=dee@mail.shouldermonkey.co
GHL_FROM_NAME=Dee
```

- [ ] **Step 3: Update outreach_engine.py header to load from env**

Replace lines 1–38 (the import block and credential constants) in `scripts/outreach_engine.py`:

```python
"""
ShoulderMonkey Outreach Engine
Runs daily via Task Scheduler. Handles enrolment + sequenced email + SMS sending.

Tracking tags on each contact:
  outreach:active           — in sequence
  outreach:complete         — finished sequence
  outreach:replied          — replied (exit condition)
  batch:YYYY-MM-DD          — enrolment date (drives timing)
  sent:email1 / email2 / email3 / email4 / email5
  sent:sms1 / sms2 / sms3

Sequence (email + SMS for has:email contacts):
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
  Day 10 → SMS 3
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

# Load env from .env.local (Next.js convention)
load_dotenv(".env.local")

GHL_TOKEN    = os.environ["GHL_TOKEN"]
GHL_LOCATION = os.environ["GHL_LOCATION"]
GHL_FROM_EMAIL = os.getenv("GHL_FROM_EMAIL", "dee@mail.shouldermonkey.co")
GHL_FROM_NAME  = os.getenv("GHL_FROM_NAME", "Dee")
BASE_URL     = "https://services.leadconnectorhq.com"
HEADERS      = {
    "Authorization": f"Bearer {GHL_TOKEN}",
    "Version":       "2021-07-28",
    "Content-Type":  "application/json",
}

DAILY_ENROL_LIMIT = 100
```

- [ ] **Step 4: Verify script still imports cleanly**

```bash
cd "C:\Users\derol\Documents\Claude\Code Projects\shouldermonkey"
python scripts/outreach_engine.py status
```

Expected: prints outreach status counts (no import errors).

- [ ] **Step 5: Commit**

```bash
git add scripts/outreach_engine.py .env.local
git commit -m "fix: move GHL credentials to .env.local, load via python-dotenv"
```

---

## Task 3: Build ghl-email-update.py

**Files:**
- Create: `scripts/ghl-email-update.py`

Reads each `*.valids.csv`, normalises phone numbers to E.164, looks up the matching GHL contact via upsert (phone as key), adds the email field and `has:email` tag. Dry-run mode prints what would happen without writing anything.

- [ ] **Step 1: Create scripts/ghl-email-update.py**

```python
"""
ghl-email-update.py

Reads scripts/enriched/*.valids.csv, matches each row to an existing GHL contact
by phone number (E.164 normalised), updates the email field, and adds the has:email tag.

Usage:
    python scripts/ghl-email-update.py            # live run
    python scripts/ghl-email-update.py --dry-run  # print only, no writes
"""

import os
import sys
import csv
import time
import requests
import phonenumbers
from phonenumbers import PhoneNumberFormat
from pathlib import Path
from dotenv import load_dotenv

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

load_dotenv(".env.local")

GHL_TOKEN    = os.environ["GHL_TOKEN"]
GHL_LOCATION = os.environ["GHL_LOCATION"]
BASE_URL     = "https://services.leadconnectorhq.com"
HEADERS      = {
    "Authorization": f"Bearer {GHL_TOKEN}",
    "Version":       "2021-07-28",
    "Content-Type":  "application/json",
}


def normalize_phone(raw: str) -> str | None:
    """Normalize Australian phone number to E.164 (+61xxxxxxxxx)."""
    if not raw:
        return None
    s = str(raw).strip()
    digits = "".join(c for c in s if c.isdigit())
    # Handle 614xx without leading +
    if digits.startswith("614") and not s.startswith("+"):
        s = "+" + digits
    # Handle 00 international prefix
    elif digits.startswith("00"):
        s = "+" + digits[2:]
    try:
        num = phonenumbers.parse(s, "AU")
        if phonenumbers.is_valid_number(num):
            return phonenumbers.format_number(num, PhoneNumberFormat.E164)
    except phonenumbers.NumberParseException:
        pass
    return None


def upsert_contact_email(phone_e164: str, email: str, company_name: str, dry_run: bool) -> str:
    """
    Upsert a GHL contact by phone, adding the email field.
    Returns 'updated', 'created', or 'skipped'.
    """
    if dry_run:
        print(f"  [DRY RUN] Would upsert: {company_name} | {phone_e164} | {email}")
        return "dry_run"

    body = {
        "locationId": GHL_LOCATION,
        "phone": phone_e164,
        "email": email,
        "firstName": company_name,
        "companyName": company_name,
    }
    r = requests.post(f"{BASE_URL}/contacts/upsert", headers=HEADERS, json=body)
    if r.status_code not in (200, 201):
        print(f"  ✗ Upsert failed ({r.status_code}): {company_name} — {r.text[:120]}")
        return "error"

    contact_id = r.json().get("contact", {}).get("id")
    action = r.json().get("action", "updated")  # GHL returns 'created' or 'updated'
    if not contact_id:
        print(f"  ✗ No contact ID returned for {company_name}")
        return "error"

    # Add has:email tag separately to avoid overwriting existing tags
    tag_r = requests.post(
        f"{BASE_URL}/contacts/{contact_id}/tags",
        headers=HEADERS,
        json={"tags": ["has:email"]},
    )
    if tag_r.status_code not in (200, 201):
        print(f"  ⚠ Tag add failed for {company_name}: {tag_r.text[:80]}")

    return action


def process_csv(csv_path: Path, dry_run: bool) -> dict:
    stats = {"total": 0, "updated": 0, "created": 0, "no_phone": 0, "bad_phone": 0, "error": 0, "dry_run": 0}

    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    stats["total"] = len(rows)
    print(f"\n── {csv_path.stem}: {len(rows)} rows ──")

    for i, row in enumerate(rows):
        company = row.get("Business Name", "").strip()
        email   = row.get("Email", "").strip()
        phone   = row.get("Phone", "").strip()

        if not email:
            continue  # skip rows without email (shouldn't happen in .valids.csv)

        if not phone:
            stats["no_phone"] += 1
            process.stdout.write("n")
            continue

        phone_e164 = normalize_phone(phone)
        if not phone_e164:
            # Try Mobile column as fallback
            phone_e164 = normalize_phone(row.get("Mobile", ""))

        if not phone_e164:
            stats["bad_phone"] += 1
            sys.stdout.write("?")
            sys.stdout.flush()
            continue

        result = upsert_contact_email(phone_e164, email, company, dry_run)
        stats[result] = stats.get(result, 0) + 1

        if not dry_run:
            sys.stdout.write("." if result in ("updated", "created") else "x")
            sys.stdout.flush()
            time.sleep(0.3)  # respect GHL rate limits

        if (i + 1) % 50 == 0:
            print(f"\n  [{i+1}/{len(rows)}]")

    print(f"\n  Done: updated={stats['updated']} created={stats['created']} "
          f"no_phone={stats['no_phone']} bad_phone={stats['bad_phone']} error={stats['error']}")
    return stats


def main():
    dry_run = "--dry-run" in sys.argv
    enriched_dir = Path("scripts/enriched")
    csv_files = sorted(enriched_dir.glob("*.valids.csv"))

    if not csv_files:
        print("No .valids.csv files found in scripts/enriched/")
        sys.exit(1)

    print(f"GHL Email Updater — {'DRY RUN' if dry_run else 'LIVE'}")
    print(f"Found {len(csv_files)} CSV files\n")

    totals = {"total": 0, "updated": 0, "created": 0, "no_phone": 0, "bad_phone": 0, "error": 0}
    for csv_path in csv_files:
        stats = process_csv(csv_path, dry_run)
        for k in totals:
            totals[k] += stats.get(k, 0)

    print(f"\n── TOTAL ──")
    print(f"  Processed: {totals['total']}")
    print(f"  Updated:   {totals['updated']}")
    print(f"  Created:   {totals['created']}")
    print(f"  No phone:  {totals['no_phone']}")
    print(f"  Bad phone: {totals['bad_phone']}")
    print(f"  Errors:    {totals['error']}")


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Dry run — first 5 rows only as a sanity check**

```bash
cd "C:\Users\derol\Documents\Claude\Code Projects\shouldermonkey"
python scripts/ghl-email-update.py --dry-run 2>&1 | head -30
```

Expected: prints `[DRY RUN] Would upsert: <company> | +61xxx | email@domain` for each row, no API calls.

- [ ] **Step 3: Live run on ONE file first (salons — smallest risk)**

Temporarily edit `main()` to only process `salons.valids.csv` by changing the glob to `glob("salons.valids.csv")`, then run:

```bash
python scripts/ghl-email-update.py
```

Watch output. Should print dots (`.` = updated). Check GHL contacts after — one salon contact should now have an email and the `has:email` tag.

- [ ] **Step 4: Restore glob to `*.valids.csv` and run all 5**

```bash
python scripts/ghl-email-update.py
```

Expected output:
```
GHL Email Updater — LIVE
Found 5 CSV files

── allied_health: 268 rows ──
..........
── TOTAL ──
  Processed: ~1162
  Updated:   ~1100+
  Errors:    <10
```

- [ ] **Step 5: Verify in GHL**

In GHL → Contacts → filter by tag `has:email` → count should be 1000+.

- [ ] **Step 6: Commit**

```bash
git add scripts/ghl-email-update.py
git commit -m "feat: add ghl-email-update script — upserts verified emails into GHL contacts"
```

---

## Task 4: Extend outreach_engine.py with Email Sequence

**Files:**
- Modify: `scripts/outreach_engine.py`

Add `send_email()` function and extend `enrol_new_contacts()` and `run_sequence()` to handle the full 14-day email + SMS sequence for `has:email` contacts.

All email copy is drawn from `06-ShoulderMonkey/Workflows.md` in the vault.

### Email Copy Constants

- [ ] **Step 1: Add EMAIL copy dict after the existing SMS dict in outreach_engine.py**

Add this block immediately after the closing `}` of the `SMS = {...}` dict (around line 70):

```python
BOOKING_LINK = "https://api.shouldermonkey.co/widget/booking/8U5JLwmKnUeDVkD4ATNm"
FOOTER = "---\nShoulderMonkey | Sydney, NSW\n{unsubscribe}"

EMAIL = {
    "vertical:salons": {
        "greeting": "Hey",
        "demo_url": "shouldermonkey.co/salon",
        "vertical_label": "salon",
        "customer_word": "customers",
        "subjects": {
            1: "{company}",
            2: "Re: {company}",
            3: "Re: {company}",
            4: "Re: {company}",
            5: "Re: {company}",
        },
        "bodies": {
            1: (
                "Hey,\n\nNoticed {company}'s website could be working a lot harder for you.\n\n"
                "Had a look and reckon we could do something much better — get a lot more customers finding you online.\n\n"
                "Here's what we built for a salon like yours: shouldermonkey.co/salon\n\n"
                "Flick me a text or WhatsApp if you want me to put something together specifically for {company}. 0424 841 204\n\n"
                "Dee\n" + FOOTER
            ),
            2: (
                "Hey,\n\nReached out a few days ago about your website — have you had a chance to look at that demo I sent through?\n\n"
                "Reckon you'd get a lot more out of your online presence. And it's not gonna break the bank either 🤷\n\n"
                "Let me know what you think.\n\nDee 0424 841 204\n" + FOOTER
            ),
            3: (
                "Hey,\n\nQuick one — most people searching for a salon in {city} are doing it on their phone. "
                "If your site doesn't load well on mobile, they're bouncing straight to the next result.\n\n"
                "Worth a look at what we'd fix: shouldermonkey.co/salon\n\n"
                "Text me if you want to chat. 0424 841 204\n\nDee\n" + FOOTER
            ),
            4: (
                "Hey,\n\nLast one before I leave you alone.\n\n"
                "Happy to put together a free mock-up of what we'd build for {company} before you commit to anything. No strings attached.\n\n"
                f"Book a quick 15 min chat here: {BOOKING_LINK}\n\n"
                "Or just text. 0424 841 204\n\nDee\n" + FOOTER
            ),
            5: (
                "Alright, I'll leave you to it.\n\n"
                "If you ever want to see what a proper website could do for {company}, the demo's still there: shouldermonkey.co/salon\n\n"
                "And if you decide to go for it down the track, feel free to text anytime. 0424 841 204\n\nAll the best, Dee\n" + FOOTER
            ),
        },
    },
    "vertical:gyms": {
        "greeting": "Hey",
        "demo_url": "shouldermonkey.co/gym",
        "vertical_label": "gym",
        "customer_word": "members",
        "subjects": {1: "{company}", 2: "Re: {company}", 3: "Re: {company}", 4: "Re: {company}", 5: "Re: {company}"},
        "bodies": {
            1: (
                "Hey,\n\nNoticed {company}'s website could be working a lot harder for you.\n\n"
                "Had a look and reckon we could do something much better — get a lot more members finding you online.\n\n"
                "Here's what we built for a gym like yours: shouldermonkey.co/gym\n\n"
                "Flick me a text or WhatsApp if you want me to put something together specifically for {company}. 0424 841 204\n\n"
                "Dee\n" + FOOTER
            ),
            2: (
                "Hey,\n\nReached out a few days ago about your website — have you had a chance to look at that demo I sent through?\n\n"
                "Reckon you'd get a lot more out of your online presence. And it's not gonna break the bank either 🤷\n\n"
                "Let me know what you think.\n\nDee 0424 841 204\n" + FOOTER
            ),
            3: (
                "Hey,\n\nQuick one — most people searching for a gym in {city} are doing it on their phone. "
                "If your site doesn't load well on mobile, they're bouncing straight to the next result.\n\n"
                "Worth a look at what we'd fix: shouldermonkey.co/gym\n\n"
                "Text me if you want to chat. 0424 841 204\n\nDee\n" + FOOTER
            ),
            4: (
                "Hey,\n\nLast one before I leave you alone.\n\n"
                "Happy to put together a free mock-up of what we'd build for {company} before you commit to anything. No strings attached.\n\n"
                f"Book a quick 15 min chat here: {BOOKING_LINK}\n\n"
                "Or just text. 0424 841 204\n\nDee\n" + FOOTER
            ),
            5: (
                "Alright, I'll leave you to it.\n\n"
                "If you ever want to see what a proper website could do for {company}, the demo's still there: shouldermonkey.co/gym\n\n"
                "And if you decide to go for it down the track, feel free to text anytime. 0424 841 204\n\nAll the best, Dee\n" + FOOTER
            ),
        },
    },
    "vertical:clinics": {
        "greeting": "Hi",
        "demo_url": "shouldermonkey.co/clinic",
        "vertical_label": "clinic",
        "customer_word": "patients",
        "subjects": {1: "{company} — your website", 2: "Re: {company}", 3: "Re: {company}", 4: "Re: {company}", 5: "Re: {company}"},
        "bodies": {
            1: (
                "Hi,\n\nNoticed {company}'s website could be working a lot harder for you.\n\n"
                "I help clinics and health practices in {city} build websites that bring in patients and build trust before the first appointment. "
                "Most practices I come across are leaving a lot on the table online.\n\n"
                "Here's an example of what we build for practices like yours: shouldermonkey.co/clinic\n\n"
                "Happy to answer any questions — feel free to text or reply. 0424 841 204\n\nDee\n" + FOOTER
            ),
            2: (
                "Hi,\n\nJust following up on the email I sent about your website — have you had a chance to take a look at the demo?\n\n"
                "A well-built site does a lot of the selling before a patient even calls. It's worth getting right, and it doesn't cost as much as most practices expect.\n\n"
                "Let me know if you'd like to talk it through.\n\nDee 0424 841 204\n" + FOOTER
            ),
            3: (
                "Hi,\n\nOne thing I see consistently with health practice websites — the majority of patients are now searching on mobile, "
                "but most sites are still built for desktop. If {company}'s site isn't optimised for mobile, a significant chunk of potential patients are going elsewhere.\n\n"
                "Here's how we address it: shouldermonkey.co/clinic\n\nHappy to walk you through it if that's helpful.\n\nDee 0424 841 204\n" + FOOTER
            ),
            4: (
                "Hi,\n\nI'll keep this short — if you'd like to see what we'd actually build for {company} before making any decisions, "
                "I'm happy to put together a free mock-up. No obligation.\n\n"
                f"Book a quick 15-minute call here: {BOOKING_LINK}\n\n"
                "Or text me directly. 0424 841 204\n\nDee\n" + FOOTER
            ),
            5: (
                "Hi,\n\nI'll leave it here — I've followed up a few times and don't want to take up more of your time.\n\n"
                "If you'd like to revisit this at any point, the demo is still live: shouldermonkey.co/clinic\n\n"
                "And I'm easy to reach by text whenever it suits you. 0424 841 204\n\nBest, Dee\n" + FOOTER
            ),
        },
    },
    "vertical:allied_health": {
        "greeting": "Hi",
        "demo_url": "shouldermonkey.co/allied-health",
        "vertical_label": "allied health practice",
        "customer_word": "patients",
        "subjects": {1: "{company} — your website", 2: "Re: {company}", 3: "Re: {company}", 4: "Re: {company}", 5: "Re: {company}"},
        "bodies": {
            1: (
                "Hi,\n\nNoticed {company}'s website could be working a lot harder for you.\n\n"
                "I help allied health professionals in {city} build websites that bring in patients and build trust before the first appointment. "
                "Most practices I come across are leaving a lot on the table online.\n\n"
                "Here's an example of what we build: shouldermonkey.co/allied-health\n\n"
                "Happy to answer any questions — feel free to text or reply. 0424 841 204\n\nDee\n" + FOOTER
            ),
            2: (
                "Hi,\n\nJust following up on the email I sent about your website — have you had a chance to take a look at the demo?\n\n"
                "A well-built site does a lot of the selling before a patient even calls. It's worth getting right, and it doesn't cost as much as most practices expect.\n\n"
                "Let me know if you'd like to talk it through.\n\nDee 0424 841 204\n" + FOOTER
            ),
            3: (
                "Hi,\n\nOne thing I see consistently with allied health websites — the majority of patients are now searching on mobile, "
                "but most sites are still built for desktop. If {company}'s site isn't optimised for mobile, "
                "a significant chunk of potential patients — whether you're a physio, chiro, or osteo — are going elsewhere.\n\n"
                "Here's how we address it: shouldermonkey.co/allied-health\n\nHappy to walk you through it.\n\nDee 0424 841 204\n" + FOOTER
            ),
            4: (
                "Hi,\n\nI'll keep this short — if you'd like to see what we'd actually build for {company} before making any decisions, "
                "I'm happy to put together a free mock-up. No obligation.\n\n"
                f"Book a quick 15-minute call here: {BOOKING_LINK}\n\n"
                "Or text me directly. 0424 841 204\n\nDee\n" + FOOTER
            ),
            5: (
                "Hi,\n\nI'll leave it here — I've followed up a few times and don't want to take up more of your time.\n\n"
                "If you'd like to revisit this at any point, the demo is still live: shouldermonkey.co/allied-health\n\n"
                "And I'm easy to reach by text whenever it suits you. 0424 841 204\n\nBest, Dee\n" + FOOTER
            ),
        },
    },
    "vertical:mortgage_brokers": {
        "greeting": "Hi",
        "demo_url": "shouldermonkey.co/mortgage-broker",
        "vertical_label": "brokerage",
        "customer_word": "clients",
        "subjects": {1: "{company} — online presence", 2: "Re: {company}", 3: "Re: {company}", 4: "Re: {company}", 5: "Re: {company}"},
        "bodies": {
            1: (
                "Hi,\n\nNoticed {company}'s website could be working a lot harder for you.\n\n"
                "I work with mortgage brokers and financial professionals across {city} to build websites that establish credibility and convert online enquiries. "
                "For most brokers, the website is the first impression a prospective client gets — and it matters more than most realise.\n\n"
                "Here's an example of what we build for brokers in a similar position: shouldermonkey.co/mortgage-broker\n\n"
                "I'd be glad to discuss how this might apply to {company}.\n\nDee 0424 841 204\n" + FOOTER
            ),
            2: (
                "Hi,\n\nFollowing up on the email I sent regarding your website — have you had a chance to review the demo?\n\n"
                "A professional, well-structured website builds trust before you've had the first conversation with a client. "
                "It's one of the higher-return investments a broker can make, and typically costs far less than expected.\n\n"
                "Let me know if you'd like to discuss further.\n\nDee 0424 841 204\n" + FOOTER
            ),
            3: (
                "Hi,\n\nOne thing worth noting: prospective financial services clients consistently research their broker online before making contact. "
                "A site that looks dated or doesn't load correctly on mobile creates doubt before the relationship has started.\n\n"
                "Here's how we approach this for brokers: shouldermonkey.co/mortgage-broker\n\n"
                "Happy to walk through it with you.\n\nDee 0424 841 204\n" + FOOTER
            ),
            4: (
                "Hi,\n\nOne final note — if you'd like to see a mock-up of what we'd build for {company} before committing to anything, "
                "I'm happy to provide that at no cost.\n\n"
                f"A 15-minute call is all it takes: {BOOKING_LINK}\n\n"
                "Alternatively, feel free to text directly. 0424 841 204\n\nDee\n" + FOOTER
            ),
            5: (
                "Hi,\n\nI'll leave it there — I've reached out several times and don't want to take up more of your time.\n\n"
                "The demo remains available if you'd like to revisit: shouldermonkey.co/mortgage-broker\n\n"
                "And I'm easy to reach whenever it suits. 0424 841 204\n\nBest regards, Dee\n" + FOOTER
            ),
        },
    },
}
```

### Email Sending Function

- [ ] **Step 2: Add send_email() function after send_sms() in outreach_engine.py**

After the existing `send_sms()` function, add:

```python
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
    )
    r.raise_for_status()
    return r.json()
```

### Build Message Helper

- [ ] **Step 3: Add build_email_message() helper after the existing build_message() function**

```python
def build_email_message(template: str, contact: dict) -> str:
    company = contact.get("companyName") or contact.get("contactName") or "your business"
    city    = contact.get("city") or "your city"
    # GHL contact city field
    loc = contact.get("customFields", [])
    for f in loc:
        if f.get("key") == "city":
            city = f.get("field_value", city)
            break
    return (template
            .replace("{company}", company)
            .replace("{city}", city)
            .replace("{unsubscribe}", contact.get("unsubscribeUrl", "Reply STOP to unsubscribe")))
```

### Enrollment — Email Path

- [ ] **Step 4: Update enrol_new_contacts() to send Email 1 (not SMS 1) for has:email contacts**

Replace the entire `enrol_new_contacts()` function:

```python
def enrol_new_contacts(today_str: str, today_date, dry_run: bool = False):
    """Find un-enrolled contacts and enrol them. Email 1 sent immediately for has:email; SMS 1 for SMS-only."""
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
                print(f"    [DRY RUN] Would enrol: {c.get('companyName')} ({c.get('id')})")
                continue
            try:
                tags = c.get("tags", [])
                new_tags = ["outreach:active", f"batch:{today_str}"]
                add_tags(c["id"], new_tags)
                vertical = get_vertical(tags)
                has_email = "has:email" in tags
                has_mobile = "has:mobile" in tags

                if has_email and vertical in EMAIL and c.get("email"):
                    # Email path: send Email 1
                    tmpl = EMAIL[vertical]
                    subject = tmpl["subjects"][1].format(company=c.get("companyName", ""))
                    body = build_email_message(tmpl["bodies"][1], c)
                    send_email(c["id"], c["email"], subject, body)
                    add_tags(c["id"], ["sent:email1"])
                    print(f"    ✓ Enrolled + Email1: {c.get('companyName','?')} ({c.get('email','')})")
                elif has_mobile and vertical in SMS:
                    # SMS-only path
                    msg = build_message(SMS[vertical][1], c)
                    send_sms(c["id"], msg)
                    add_tags(c["id"], ["sent:sms1"])
                    print(f"    ✓ Enrolled + SMS1: {c.get('companyName','?')} ({c.get('phone','')})")

                time.sleep(0.3)
                enrolled += 1
            except Exception as e:
                print(f"    ✗ Error enrolling {c.get('id')}: {e}")

    print(f"  Total enrolled today: {enrolled}")
```

### Sequence Runner — Full Email + SMS

- [ ] **Step 5: Replace run_sequence() with full 14-day email+SMS logic**

Replace the entire `run_sequence()` function:

```python
def run_sequence(today_date, dry_run: bool = False):
    """Send follow-ups to active contacts based on days elapsed since enrolment."""
    print(f"\n{'[DRY RUN] ' if dry_run else ''}=== SEQUENCE RUN ({today_date}) ===")

    active = get_all_contacts_with_tag("outreach:active")
    print(f"  Active contacts: {len(active)}")

    counters = {k: 0 for k in ("email2","email3","email4","email5","sms1","sms2","sms3","completed","replied_exits")}

    for c in active:
        contact_id = c["id"]
        tags       = c.get("tags", [])
        vertical   = get_vertical(tags)
        if not vertical:
            continue
        if "outreach:replied" in tags:
            continue
        if has_replied(contact_id):
            if not dry_run:
                add_tags(contact_id, ["outreach:replied"])
                remove_tags(contact_id, ["outreach:active"])
            counters["replied_exits"] += 1
            continue

        batch_date = get_batch_date(tags)
        if not batch_date:
            continue
        d = (today_date - batch_date).days

        has_email  = "has:email" in tags and c.get("email")
        has_mobile = "has:mobile" in tags

        # ── EMAIL PATH ──────────────────────────────────────────────────
        if has_email and vertical in EMAIL:
            tmpl = EMAIL[vertical]

            def _send_email(num: int, counter_key: str):
                if dry_run:
                    print(f"    [DRY RUN] Email{num} → {c.get('companyName','?')} (day {d})")
                    return
                subject = tmpl["subjects"][num].format(company=c.get("companyName", ""))
                body    = build_email_message(tmpl["bodies"][num], c)
                send_email(contact_id, c["email"], subject, body)
                add_tags(contact_id, [f"sent:email{num}"])
                print(f"    ✓ Email{num}: {c.get('companyName','?')}")
                counters[counter_key] += 1
                time.sleep(0.3)

            def _send_sms(num: int, counter_key: str):
                if not has_mobile:
                    return
                if dry_run:
                    print(f"    [DRY RUN] SMS{num} → {c.get('companyName','?')} (day {d})")
                    return
                msg = build_message(SMS[vertical][num], c)
                send_sms(contact_id, msg)
                add_tags(contact_id, [f"sent:sms{num}"])
                print(f"    ✓ SMS{num}: {c.get('companyName','?')}")
                counters[counter_key] += 1
                time.sleep(0.3)

            try:
                if d == 1 and "sent:sms1" not in tags:
                    _send_sms(1, "sms1")
                elif d == 3 and "sent:email2" not in tags:
                    _send_email(2, "email2")
                elif d == 6 and "sent:email3" not in tags:
                    _send_email(3, "email3")
                elif d == 8 and "sent:sms2" not in tags:
                    _send_sms(2, "sms2")
                elif d == 10 and "sent:sms3" not in tags:
                    _send_sms(3, "sms3")
                elif d == 11 and "sent:email4" not in tags:
                    _send_email(4, "email4")
                elif d == 13 and "sent:email5" not in tags:
                    _send_email(5, "email5")
                elif d >= 14 and "sent:email5" in tags:
                    if not dry_run:
                        remove_tags(contact_id, ["outreach:active"])
                        add_tags(contact_id, ["outreach:complete"])
                    counters["completed"] += 1
            except Exception as e:
                print(f"    ✗ Error {contact_id}: {e}")

        # ── SMS-ONLY PATH ────────────────────────────────────────────────
        elif has_mobile and vertical in SMS:
            try:
                if d == 5 and "sent:sms2" not in tags:
                    if dry_run:
                        print(f"    [DRY RUN] SMS2 → {c.get('companyName','?')} (day {d})")
                    else:
                        msg = build_message(SMS[vertical][2], c)
                        send_sms(contact_id, msg)
                        add_tags(contact_id, ["sent:sms2"])
                        print(f"    ✓ SMS2: {c.get('companyName','?')}")
                        counters["sms2"] += 1
                        time.sleep(0.3)
                elif d == 10 and "sent:sms3" not in tags:
                    if dry_run:
                        print(f"    [DRY RUN] SMS3 → {c.get('companyName','?')} (day {d})")
                    else:
                        msg = build_message(SMS[vertical][3], c)
                        send_sms(contact_id, msg)
                        add_tags(contact_id, ["sent:sms3"])
                        print(f"    ✓ SMS3: {c.get('companyName','?')}")
                        counters["sms3"] += 1
                        time.sleep(0.3)
                elif d >= 11 and "sent:sms3" in tags:
                    if not dry_run:
                        remove_tags(contact_id, ["outreach:active"])
                        add_tags(contact_id, ["outreach:complete"])
                    counters["completed"] += 1
            except Exception as e:
                print(f"    ✗ Error {contact_id}: {e}")

    print(f"  Email: 2={counters['email2']} 3={counters['email3']} 4={counters['email4']} 5={counters['email5']}")
    print(f"  SMS:   1={counters['sms1']} 2={counters['sms2']} 3={counters['sms3']}")
    print(f"  Completed: {counters['completed']} | Replied exits: {counters['replied_exits']}")
```

- [ ] **Step 6: Dry-run the updated engine**

```bash
cd "C:\Users\derol\Documents\Claude\Code Projects\shouldermonkey"
python scripts/outreach_engine.py daily --dry-run
```

Expected: enrolment section prints `[DRY RUN] Would enrol:` lines, sequence section prints `[DRY RUN] Email1/SMS1 →` lines for any already-enrolled contacts. No API writes.

- [ ] **Step 7: Run status check**

```bash
python scripts/outreach_engine.py status
```

Expected: shows Active / Complete / Replied counts.

- [ ] **Step 8: Commit**

```bash
git add scripts/outreach_engine.py
git commit -m "feat: extend outreach engine with full 14-day email + SMS sequence"
```

---

## Task 5: Windows Task Scheduler Setup

**Files:**
- Create: `scripts/start-outreach.bat`

A batch file the Task Scheduler can call daily at 9am AEST. Activates the correct Python and runs the daily mode.

- [ ] **Step 1: Create scripts/start-outreach.bat**

```bat
@echo off
cd /d "C:\Users\derol\Documents\Claude\Code Projects\shouldermonkey"
python scripts/outreach_engine.py daily >> logs\outreach.log 2>&1
```

- [ ] **Step 2: Create logs directory**

```powershell
New-Item -ItemType Directory -Force "C:\Users\derol\Documents\Claude\Code Projects\shouldermonkey\logs"
```

- [ ] **Step 3: Register the Task Scheduler task**

Run this in PowerShell as Administrator:

```powershell
$action  = New-ScheduledTaskAction -Execute "cmd.exe" -Argument '/c "C:\Users\derol\Documents\Claude\Code Projects\shouldermonkey\scripts\start-outreach.bat"'
$trigger = New-ScheduledTaskTrigger -Daily -At "9:00AM"
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 1) -RunOnlyIfNetworkAvailable $true

Register-ScheduledTask `
    -TaskName "ShoulderMonkey-Outreach" `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Daily outreach engine for ShoulderMonkey leads" `
    -RunLevel Highest `
    -Force
```

Expected: `TaskName: ShoulderMonkey-Outreach` in the output.

- [ ] **Step 4: Verify task is registered**

```powershell
Get-ScheduledTask -TaskName "ShoulderMonkey-Outreach" | Select-Object TaskName, State
```

Expected: `State: Ready`

- [ ] **Step 5: Test run manually via Task Scheduler**

```powershell
Start-ScheduledTask -TaskName "ShoulderMonkey-Outreach"
Start-Sleep -Seconds 10
Get-Content "C:\Users\derol\Documents\Claude\Code Projects\shouldermonkey\logs\outreach.log" -Tail 20
```

Expected: log shows today's date and outreach status output.

- [ ] **Step 6: Commit**

```bash
git add scripts/start-outreach.bat logs/.gitkeep
git commit -m "feat: add Task Scheduler batch file and logs directory for daily outreach"
```

---

## Self-Review

### Spec coverage
- [x] Save verified CSV files → Task 1
- [x] Fix hardcoded token security → Task 2
- [x] ghl-email-update.py with dry-run → Task 3
- [x] Email sequence in outreach_engine.py → Task 4
- [x] Task Scheduler setup → Task 5
- [x] Phone normalisation (E.164 via phonenumbers) → Task 3 `normalize_phone()`
- [x] All email copy for 5 verticals → Task 4 Step 1

### Placeholder scan
No TBD, TODO, or vague steps present. All code blocks are complete.

### Type consistency
- `normalize_phone()` returns `str | None` — used correctly in Task 3
- `send_email()` signature `(contact_id, contact_email, subject, body)` — matches calls in Task 4
- `build_email_message()` signature `(template, contact)` — matches calls in Task 4
- `EMAIL` dict keyed on `vertical:salons` etc — matches `get_vertical()` return values from existing engine
