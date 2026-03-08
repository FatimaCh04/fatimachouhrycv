/**
 * Portfolio Admin - Auth & Data (localStorage)
 * Use sessionStorage for login; localStorage for blog, projects, services.
 *
 * Gmail admin: Add your Gmail address below and set up Google OAuth Client ID
 * at https://console.cloud.google.com/apis/credentials (Create OAuth 2.0 Client ID, Web application).
 */

(function (window) {
  'use strict';

  var ADMIN_USER = 'admin';
  var ADMIN_PASS = 'admin123';
  var SESSION_KEY = 'portfolio_admin_session';

  /** Add your Gmail address(es) that can log in as admin. Example: ['you@gmail.com'] */
  var ALLOWED_ADMIN_EMAILS = ['fatimachoudhry94@gmail.com'];

  /**
   * Google OAuth 2.0 Web Client ID from Google Cloud Console.
   * Get it: https://console.cloud.google.com/apis/credentials → Create credentials → OAuth client ID → Web application.
   * Add authorized JavaScript origins (e.g. http://localhost, https://yoursite.com).
   */
  var ADMIN_GOOGLE_CLIENT_ID = '923443213449-i1frve4q81ogdee00k5u59c066f4l3is.apps.googleusercontent.com';

  var KEYS = {
    posts: 'portfolio_blog_posts',
    projects: 'portfolio_projects',
    services: 'portfolio_services',
    profile: 'portfolio_profile'
  };

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  }

  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  function login(username, password) {
    if (String(username).trim() === ADMIN_USER && String(password) === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, '1');
      return true;
    }
    return false;
  }

  /** Login with Gmail: pass the email from Google Sign-In. Returns true if email is allowed. */
  function loginWithGoogle(email) {
    if (!email || typeof email !== 'string') return false;
    var normalized = email.trim().toLowerCase();
    for (var i = 0; i < ALLOWED_ADMIN_EMAILS.length; i++) {
      if (ALLOWED_ADMIN_EMAILS[i].toLowerCase() === normalized) {
        sessionStorage.setItem(SESSION_KEY, '1');
        return true;
      }
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  }

  // ——— Blog posts ———
  function getBlogPosts() {
    try {
      var raw = localStorage.getItem(KEYS.posts);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveBlogPosts(posts) {
    localStorage.setItem(KEYS.posts, JSON.stringify(posts || []));
  }

  // ——— Projects ———
  function getProjects() {
    try {
      var raw = localStorage.getItem(KEYS.projects);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveProjects(projects) {
    localStorage.setItem(KEYS.projects, JSON.stringify(projects || []));
  }

  // ——— Services ———
  function getServices() {
    try {
      var raw = localStorage.getItem(KEYS.services);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveServices(services) {
    localStorage.setItem(KEYS.services, JSON.stringify(services || []));
  }

  // ——— Profile (name, title, tagline, photo) ———
  function getProfile() {
    try {
      var raw = localStorage.getItem(KEYS.profile);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveProfile(profile) {
    if (profile && (profile.name || profile.title || profile.tagline || profile.photo || profile.resumeUrl)) {
      localStorage.setItem(KEYS.profile, JSON.stringify(profile));
    } else {
      localStorage.removeItem(KEYS.profile);
    }
  }

  function nextId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  window.PortfolioAdmin = {
    requireAuth: requireAuth,
    isLoggedIn: isLoggedIn,
    login: login,
    loginWithGoogle: loginWithGoogle,
    getGoogleClientId: function () { return ADMIN_GOOGLE_CLIENT_ID; },
    logout: logout,
    getBlogPosts: getBlogPosts,
    saveBlogPosts: saveBlogPosts,
    getProjects: getProjects,
    saveProjects: saveProjects,
    getServices: getServices,
    saveServices: saveServices,
    getProfile: getProfile,
    saveProfile: saveProfile,
    nextId: nextId
  };
})(window);
