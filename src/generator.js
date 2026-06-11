const PasswordGenerator = (() => {
  'use strict';
  const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const DIGITS = '0123456789';
  const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const AMBIGUOUS = /[0O1lI]/g;
  const WORDS = ['apple','bridge','cloud','delta','ember','frost','grove','haven','ivory','jewel','knoll','lunar','maple','noble','ocean','prism','quest','river','stone','thorn','ultra','vault','water','xenon','yield','zephyr','amber','blaze','crisp','dusk','eagle','flame','gleam','haze','iron','jade','keen','lark','mist','nova','onyx','pine','quartz','ridge','sage','tide','umbra','veil','wave','xylem','yore'];

  function buildCharset(opts) {
    let chars = '';
    if (opts.upper) chars += UPPER;
    if (opts.lower) chars += LOWER;
    if (opts.digits) chars += DIGITS;
    if (opts.symbols) chars += SYMBOLS;
    if (opts.custom) chars += opts.custom;
    if (opts.ambiguous) chars = chars.replace(AMBIGUOUS, '');
    return [...new Set(chars.split(''))].join('');
  }

  function secureRandom(max) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }

  function generateRandom(opts) {
    const charset = buildCharset(opts);
    if (!charset) return '';
    let pass = '';
    // Ensure at least one of each required type
    const required = [];
    if (opts.upper) required.push(UPPER[secureRandom(UPPER.length)]);
    if (opts.lower) required.push(LOWER[secureRandom(LOWER.length)]);
    if (opts.digits) required.push(DIGITS[secureRandom(DIGITS.length)]);
    if (opts.symbols) required.push(SYMBOLS[secureRandom(SYMBOLS.length)]);
    for (let i = required.length; i < opts.length; i++) {
      required.push(charset[secureRandom(charset.length)]);
    }
    // Fisher-Yates shuffle
    for (let i = required.length - 1; i > 0; i--) {
      const j = secureRandom(i + 1);
      [required[i], required[j]] = [required[j], required[i]];
    }
    return required.join('');
  }

  function generateMemorable(opts) {
    const segments = Math.max(2, Math.floor(opts.length / 5));
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const vowels = 'aeiou';
    let pass = '';
    for (let s = 0; s < segments; s++) {
      const syllables = Math.ceil(opts.length / segments / 2);
      for (let i = 0; i < syllables; i++) {
        pass += consonants[secureRandom(consonants.length)];
        pass += vowels[secureRandom(vowels.length)];
      }
      if (s < segments - 1 && opts.symbols) pass += ['!', '@', '#', '-'][secureRandom(4)];
    }
    if (opts.upper) pass = pass[0].toUpperCase() + pass.slice(1);
    if (opts.digits) pass += secureRandom(99);
    return pass.slice(0, opts.length);
  }

  function generatePassphrase(wordCount = 4) {
    const words = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(WORDS[secureRandom(WORDS.length)]);
    }
    return words.join('-');
  }

  function generatePIN(length = 6) {
    let pin = '';
    for (let i = 0; i < length; i++) pin += secureRandom(10);
    return pin;
  }

  function generate(opts) {
    switch (opts.mode) {
      case 'memorable': return generateMemorable(opts);
      case 'passphrase': return generatePassphrase(Math.max(3, Math.floor(opts.length / 5)));
      case 'pin': return generatePIN(opts.length > 12 ? 8 : opts.length);
      default: return generateRandom(opts);
    }
  }

  return { generate, buildCharset };
})();
