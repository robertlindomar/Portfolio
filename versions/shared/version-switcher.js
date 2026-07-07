(function () {
  'use strict';

  var root = document.getElementById('version-picker');
  if (!root) return;

  var btn = document.getElementById('version-picker-btn');
  var panel = document.getElementById('version-picker-panel');
  var backdrop = document.getElementById('version-picker-backdrop');
  if (!btn || !panel || !backdrop) return;

  function open() {
    root.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    backdrop.hidden = false;
    document.body.classList.add('p-ver-open');
  }

  function close() {
    root.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    panel.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;
    document.body.classList.remove('p-ver-open');
  }

  function toggle() {
    if (root.classList.contains('is-open')) close();
    else open();
  }

  btn.addEventListener('click', toggle);
  backdrop.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('is-open')) close();
  });
})();
