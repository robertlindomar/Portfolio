(function () {
  'use strict';

  // Theme toggle
  var THEME_KEY = 'portfolio-theme';

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function updateThemeButtons(theme) {
    var isLight = theme === 'light';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      var icon = btn.querySelector('.p-theme-toggle__icon');
      var label = btn.querySelector('.p-theme-toggle__label');
      if (icon) icon.textContent = isLight ? '☾' : '☀';
      if (label) label.textContent = isLight ? 'Tema escuro' : 'Tema claro';
      btn.setAttribute('aria-label', isLight ? 'Ativar tema escuro' : 'Ativar tema claro');
    });
  }

  function setTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      theme = 'dark';
    }
    localStorage.setItem(THEME_KEY, theme);
    updateThemeButtons(theme);
  }

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTheme(getTheme() === 'light' ? 'dark' : 'light');
    });
  });
  updateThemeButtons(getTheme());

  // Copyright
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile menu
  var menuBtn = document.getElementById('p-menu-btn');
  var mobileNav = document.getElementById('p-mobile-nav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('p-nav-open', open);
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('p-nav-open');
      });
    });
  }

  // Rail active state
  var sections = document.querySelectorAll('section[id]');
  var railLinks = document.querySelectorAll('.p-rail__link[data-section]');
  if (sections.length && railLinks.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        railLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.dataset.section === id);
        });
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { observer.observe(s); });
  }

  // Systagio carousel + lightbox
  var root = document.getElementById('systagio-carousel');
  var lightbox = document.getElementById('systagio-lightbox');
  if (!root) return;

  var track = root.querySelector('[data-carousel-track]');
  var prevBtn = root.querySelector('[data-carousel-prev]');
  var nextBtn = root.querySelector('[data-carousel-next]');
  var dotsWrap = root.querySelector('[data-carousel-dots]');
  var slides = root.querySelectorAll('[data-carousel-slide]');
  var lightboxImg = document.getElementById('systagio-lightbox-img');
  var lightboxCaption = document.getElementById('systagio-lightbox-caption');
  var lbPrev = lightbox ? lightbox.querySelector('[data-lightbox-prev]') : null;
  var lbNext = lightbox ? lightbox.querySelector('[data-lightbox-next]') : null;
  var n = slides.length;
  var i = 0;
  var focusBeforeOpen = null;

  function updateLightboxImage() {
    if (!lightboxImg || !slides[i]) return;
    var img = slides[i].querySelector('img');
    if (!img) return;
    lightboxImg.removeAttribute('hidden');
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCaption) {
      lightboxCaption.textContent = img.alt || '';
      lightboxCaption.hidden = !img.alt;
    }
  }

  function apply() {
    track.style.transform = 'translateX(-' + (i * 100) + '%)';
    if (dotsWrap) {
      dotsWrap.querySelectorAll('button').forEach(function (dot, idx) {
        dot.setAttribute('aria-selected', idx === i ? 'true' : 'false');
      });
    }
    if (lightbox && lightbox.classList.contains('is-open')) updateLightboxImage();
  }

  function go(delta) {
    if (n <= 1) return;
    i = (i + delta + n) % n;
    apply();
  }

  function openLightbox() {
    if (!lightbox) return;
    focusBeforeOpen = document.activeElement;
    updateLightboxImage();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var closeBtn = lightbox.querySelector('[data-lightbox-close]');
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lightboxImg) {
      lightboxImg.removeAttribute('src');
      lightboxImg.setAttribute('hidden', '');
    }
    if (focusBeforeOpen && typeof focusBeforeOpen.focus === 'function') focusBeforeOpen.focus();
  }

  if (n <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (dotsWrap) dotsWrap.style.display = 'none';
    if (lbPrev) lbPrev.style.display = 'none';
    if (lbNext) lbNext.style.display = 'none';
  }

  if (n > 1 && dotsWrap) {
    for (var j = 0; j < n; j++) {
      (function (idx) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'p-carousel__dot';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', 'Imagem ' + (idx + 1) + ' de ' + n);
        b.innerHTML = '<span></span>';
        b.addEventListener('click', function () { i = idx; apply(); });
        dotsWrap.appendChild(b);
      })(j);
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', function (e) { e.stopPropagation(); go(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function (e) { e.stopPropagation(); go(1); });

  track.addEventListener('click', function (e) {
    if (e.target.tagName !== 'IMG') return;
    openLightbox();
  });

  if (lightbox) {
    lightbox.querySelectorAll('[data-lightbox-close]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.stopPropagation(); closeLightbox(); });
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target.closest('button')) return;
      if (e.target.id === 'systagio-lightbox-img') return;
      closeLightbox();
    });
    if (lbPrev) lbPrev.addEventListener('click', function (e) { e.stopPropagation(); go(-1); });
    if (lbNext) lbNext.addEventListener('click', function (e) { e.stopPropagation(); go(1); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    });
  }

  apply();
})();
