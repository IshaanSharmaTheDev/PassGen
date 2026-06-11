# PassGen

A CLI password generator with a strength meter and breach checking. Generates secure passwords, rates them, and optionally checks if they've appeared in known data breaches (via HaveIBeenPwned's API — sends only a hash prefix, never your actual password).

I made this because I was curious how password strength is actually calculated and how the HIBP k-anonymity model works. Ended up being a useful tool too.

## Usage

```bash
# Generate a password (default: 16 chars, mixed)
python passgen.py

# Specify length
python passgen.py --length 24

# Memorable word-based passphrase
python passgen.py --words 4

# Check strength of an existing password
python passgen.py --check

# Check if a password has appeared in breaches
python passgen.py --breach-check
```

## Strength meter

The strength score is based on:
- Length (longer = much better)
- Character variety (uppercase, lowercase, digits, symbols)
- Entropy calculation
- Common pattern detection (keyboard walks, repeated chars, dictionary words)
- Known breach count (if you use `--breach-check`)

Output looks like:
```
Password: Kx9#mP2$vLqN8@Rw
Strength: ████████████░░░░ 78/100 (Strong)
Entropy:  ~95 bits
Breaches: Not found in known breaches ✓
```

## The breach check

Uses HaveIBeenPwned's k-anonymity API. Your password is hashed with SHA-1, only the first 5 characters of the hash are sent to the API, and it returns all hashes starting with those 5 chars. Your actual password never leaves your machine. The check is completely private.

## Requirements

```bash
pip install requests  # only needed for --breach-check, everything else is stdlib
```

---

Python 3.7+. Fully works without internet for generation and strength checking.
