# PassGen

A cryptographically secure password generator with strength analysis, bulk generation, and history.

## Features
- **Secure random** — uses `crypto.getRandomValues()` for true randomness
- **4 modes** — Random, Memorable (pronounceable), Passphrase (word-based), PIN
- **Strength meter** — entropy calculation, visual bar, WCAG contrast check
- **Bulk generate** — up to 100 passwords at once
- **History** — last 20 passwords saved to localStorage
- **Customizable** — length 4–128, toggle uppercase/lowercase/digits/symbols, exclude ambiguous chars, add custom chars

## Structure
```
src/generator.js  # Charset builder, Myers shuffle, 4 generation modes
src/strength.js   # Entropy calc, common password check, strength scoring
src/app.js        # UI wiring, history, bulk mode
```

## Tech
Vanilla JS, Web Crypto API, localStorage. No dependencies.

## License
MIT
