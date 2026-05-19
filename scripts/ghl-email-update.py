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
from pathlib import Path
from dotenv import load_dotenv

try:
    import phonenumbers
    from phonenumbers import PhoneNumberFormat
    PHONENUMBERS_AVAILABLE = True
except ImportError:
    PHONENUMBERS_AVAILABLE = False
    print("WARNING: phonenumbers library not installed. Run: pip install phonenumbers")
    print("Falling back to basic normalisation.\n")

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env.local"))

GHL_TOKEN    = os.environ["GHL_TOKEN"]
GHL_LOCATION = os.environ.get("GHL_LOCATION_ID", os.environ.get("GHL_LOCATION", ""))
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

    if PHONENUMBERS_AVAILABLE:
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
    else:
        # Basic fallback without phonenumbers library
        digits = "".join(c for c in s if c.isdigit())
        if digits.startswith("614") and len(digits) == 11:
            return "+" + digits
        if digits.startswith("04") and len(digits) == 10:
            return "+61" + digits[1:]
        if digits.startswith("4") and len(digits) == 9:
            return "+61" + digits
        return None


def upsert_contact_email(phone_e164: str, email: str, company_name: str, dry_run: bool) -> str:
    """
    Upsert GHL contact by phone, setting email field.
    Returns 'updated', 'created', 'dry_run', or 'error'.
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

    r = requests.post(f"{BASE_URL}/contacts/upsert", headers=HEADERS, json=body, timeout=15)

    if r.status_code not in (200, 201):
        print(f"\n  ✗ Upsert failed ({r.status_code}): {company_name} — {r.text[:120]}")
        return "error"

    data = r.json()
    contact_id = data.get("contact", {}).get("id")
    action = data.get("action", "updated")

    if not contact_id:
        print(f"\n  ✗ No contact ID returned for {company_name}")
        return "error"

    # Add has:email tag without overwriting existing tags
    tag_r = requests.post(
        f"{BASE_URL}/contacts/{contact_id}/tags",
        headers=HEADERS,
        json={"tags": ["has:email"]},
        timeout=10,
    )
    if tag_r.status_code not in (200, 201):
        print(f"\n  ⚠ Tag add failed for {company_name}: {tag_r.text[:80]}")

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
            continue

        if not phone:
            # Try Mobile column as fallback
            phone = row.get("Mobile", "").strip()

        if not phone:
            stats["no_phone"] += 1
            sys.stdout.write("n")
            sys.stdout.flush()
            continue

        phone_e164 = normalize_phone(phone)

        # If primary Phone failed, try Mobile column
        if not phone_e164:
            mobile = row.get("Mobile", "").strip()
            if mobile:
                phone_e164 = normalize_phone(mobile)

        if not phone_e164:
            stats["bad_phone"] += 1
            sys.stdout.write("?")
            sys.stdout.flush()
            continue

        try:
            result = upsert_contact_email(phone_e164, email, company, dry_run)
        except Exception as e:
            print(f"\n  ✗ Exception for {company}: {e}")
            result = "error"

        stats[result] = stats.get(result, 0) + 1

        if not dry_run:
            sys.stdout.write("." if result in ("updated", "created") else "x")
            sys.stdout.flush()
            time.sleep(0.3)

        if (i + 1) % 50 == 0:
            print(f"\n  [{i+1}/{len(rows)}]")

    print(f"\n  Done: updated={stats['updated']} created={stats['created']} "
          f"no_phone={stats['no_phone']} bad_phone={stats['bad_phone']} error={stats['error']}")
    return stats


def main():
    dry_run = "--dry-run" in sys.argv
    enriched_dir = Path(__file__).parent / "enriched"
    csv_files = sorted(enriched_dir.glob("*.valids.csv"))

    if not csv_files:
        print(f"No .valids.csv files found in {enriched_dir}")
        sys.exit(1)

    print(f"GHL Email Updater — {'DRY RUN' if dry_run else 'LIVE'}")
    print(f"Location: {GHL_LOCATION}")
    print(f"Found {len(csv_files)} CSV files")

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
