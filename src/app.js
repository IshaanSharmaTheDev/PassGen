(function () {
  'use strict';
  let history = JSON.parse(localStorage.getItem('passgen_history') || '[]');

  function getOpts() {
    return {
      length: parseInt(document.getElementById('len-slider').value),
      upper: document.getElementById('opt-upper').checked,
      lower: document.getElementById('opt-lower').checked,
      digits: document.getElementById('opt-digits').checked,
      symbols: document.getElementById('opt-symbols').checked,
      ambiguous: document.getElementById('opt-ambiguous').checked,
      custom: document.getElementById('custom-chars').value,
      mode: document.getElementById('mode-select').value,
    };
  }

  function generate() {
    const opts = getOpts();
    const pass = PasswordGenerator.generate(opts);
    document.getElementById('password-display').textContent = pass || '(no charset selected)';
    updateStrength(pass);
    addToHistory(pass);
  }

  function updateStrength(pass) {
    const s = StrengthMeter.evaluate(pass);
    const fill = document.getElementById('strength-fill');
    fill.style.width = s.pct + '%';
    fill.style.background = s.color;
    document.getElementById('strength-label').textContent = s.label;
    document.getElementById('strength-label').style.color = s.color;
    document.getElementById('entropy-display').textContent = `~${s.entropy} bits of entropy`;
  }

  function addToHistory(pass) {
    if (!pass || pass.includes('(')) return;
    history.unshift(pass);
    if (history.length > 20) history.pop();
    localStorage.setItem('passgen_history', JSON.stringify(history));
    renderHistory();
  }

  function renderHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = history.length === 0
      ? '<div class="no-history">No history yet</div>'
      : history.map((p, i) =>
          `<div class="history-item">
            <code class="hist-pass">${esc(p)}</code>
            <button class="hist-copy" data-pw="${esc(p)}">Copy</button>
          </div>`).join('');
    list.querySelectorAll('.hist-copy').forEach(btn => {
      btn.addEventListener('click', () => navigator.clipboard.writeText(btn.dataset.pw));
    });
  }

  function generateBulk() {
    const opts = getOpts();
    const count = parseInt(document.getElementById('bulk-count').value) || 10;
    const results = Array.from({length: count}, () => PasswordGenerator.generate(opts));
    const list = document.getElementById('bulk-list');
    list.innerHTML = results.map(p => `<div class="bulk-item"><code>${esc(p)}</code></div>`).join('');
    document.getElementById('btn-bulk-copy').dataset.bulk = results.join('\n');
  }

  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function init() {
    document.getElementById('len-slider').addEventListener('input', function() {
      document.getElementById('len-display').textContent = this.value;
    });
    document.getElementById('btn-generate').addEventListener('click', generate);
    document.getElementById('btn-refresh').addEventListener('click', generate);
    document.getElementById('btn-copy').addEventListener('click', () => {
      const p = document.getElementById('password-display').textContent;
      navigator.clipboard.writeText(p);
    });
    document.getElementById('btn-bulk').addEventListener('click', generateBulk);
    document.getElementById('btn-bulk-copy').addEventListener('click', function() {
      navigator.clipboard.writeText(this.dataset.bulk || '');
    });
    document.getElementById('btn-clear-history').addEventListener('click', () => {
      history = []; localStorage.removeItem('passgen_history'); renderHistory();
    });
    renderHistory();
    generate();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
