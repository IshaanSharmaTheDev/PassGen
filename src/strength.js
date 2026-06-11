const StrengthMeter = (() => {
  'use strict';
  const COMMON = ['password','123456','qwerty','abc123','letmein','monkey','master','dragon','111111','iloveyou'];

  function evaluate(password) {
    if (!password) return { score: 0, label: '—', entropy: 0 };
    const len = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    const isCommon = COMMON.includes(password.toLowerCase());

    // Estimate charset size for entropy
    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasDigit) poolSize += 10;
    if (hasSymbol) poolSize += 32;
    const entropy = poolSize > 0 ? Math.floor(len * Math.log2(poolSize)) : 0;

    let score = 0;
    if (len >= 8) score++;
    if (len >= 12) score++;
    if (len >= 16) score++;
    if (hasUpper && hasLower) score++;
    if (hasDigit) score++;
    if (hasSymbol) score++;
    if (isCommon) score = 0;
    if (entropy > 60) score = Math.max(score, 4);
    if (entropy > 80) score = 5;

    const labels = ['—', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    const colors = ['#555', '#f44336', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3'];
    const capped = Math.min(score, 5);
    return {
      score: capped,
      label: labels[capped],
      color: colors[capped],
      entropy,
      pct: (capped / 5) * 100,
    };
  }

  return { evaluate };
})();
