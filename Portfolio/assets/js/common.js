(function () {
  'use strict';

  /** Profile (name, title, tagline, photo) comes only from admin – no change on site. */
  function applyProfileFromAdmin() {
    var profile = typeof PortfolioData !== 'undefined' && PortfolioData.getProfile ? PortfolioData.getProfile() : null;
    if (!profile) return;
    if (profile.name) {
      document.querySelectorAll('.profile-name').forEach(function (el) { el.textContent = profile.name; });
    }
    if (profile.title) {
      document.querySelectorAll('.profile-title').forEach(function (el) { el.textContent = profile.title; });
    }
    if (profile.tagline) {
      document.querySelectorAll('.profile-tagline').forEach(function (el) { el.textContent = profile.tagline; });
    }
    if (profile.photo) {
      document.querySelectorAll('.profile-photo').forEach(function (img) {
        if (img && img.tagName === 'IMG') img.src = profile.photo;
      });
    }
  }

  function initTypingEffect() {
    var el = document.getElementById('tagline-typed');
    if (!el) return;
    var text = 'The Only way to do great work is to love what you do.|';
    var i = 0;
    var cursor = '|';
    function tick() {
      var show = text.slice(0, i + 1);
      if (show.endsWith('|')) show = show.slice(0, -1) + cursor;
      else show += cursor;
      el.textContent = show;
      i = (i + 1) % (text.length + 1);
      if (i === 0) setTimeout(tick, 2000);
      else setTimeout(tick, 120);
    }
    setTimeout(tick, 500);
  }

  function initMobileMenu() {
    var btn = document.getElementById('mobile-menu-btn');
    var nav = document.getElementById('mobile-nav');
    var overlay = document.getElementById('mobile-overlay');
    if (!btn || !nav) return;
    function openMenu() { 
      nav.classList.remove('hidden');
      if(overlay) overlay.classList.remove('hidden');
    }
    function closeMenu() { 
      nav.classList.add('hidden');
      if(overlay) overlay.classList.add('hidden');
    }
    btn.addEventListener('click', function () {
      if (nav.classList.contains('hidden')) {
        openMenu();
      } else {
        closeMenu();
      }
    });
    if (overlay) overlay.addEventListener('click', closeMenu);
    document.querySelectorAll('#mobile-nav a[href]').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTypingEffect();
    initMobileMenu();
    if (window.PortfolioData && window.PortfolioData.ready) {
      PortfolioData.ready().then(function () { applyProfileFromAdmin(); });
    } else {
      applyProfileFromAdmin();
    }
  });
})();
