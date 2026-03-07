/**
 * Portfolio data: pehle data/*.json (permanent), phir localStorage, phir defaults.
 * Live site par JSON use hota hai – profile, projects, services, posts sab same dikhte hain.
 */
(function (window) {
  'use strict';
  var KEYS = {
    posts: 'portfolio_blog_posts',
    projects: 'portfolio_projects',
    services: 'portfolio_services',
    profile: 'portfolio_profile'
  };
  var cache = { profile: null, projects: null, services: null, posts: null };
  var readyPromise = null;

  function get(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function getProfileSync() {
    try {
      var raw = localStorage.getItem(KEYS.profile);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  var defaultProjects = [
    { id: 'proj-web-1', title: 'Project One', description: 'Full-stack web application with React and Node.js. REST API, auth, and responsive UI.', technologies: ['React', 'Node'], category: 'web-development', githubLink: '', demoLink: '', image: 'https://placehold.co/800x480/1e293b/64748b?text=Web+App' },
    { id: 'proj-react-1', title: 'React SPA', description: 'Single-page app with React, state management, and modern UI components.', technologies: ['React', 'Tailwind'], category: 'react-development', githubLink: '', demoLink: '', image: 'https://placehold.co/800x480/1e293b/64748b?text=React+SPA' },
    { id: 'proj-api-1', title: 'API Service', description: 'FastAPI backend with PostgreSQL, JWT auth, and OpenAPI documentation.', technologies: ['Python', 'FastAPI'], category: 'web-development', githubLink: '', demoLink: '', image: 'https://placehold.co/800x480/1e293b/64748b?text=API' },
    { id: 'proj-dash-1', title: 'Dashboard & Admin Tool', description: 'Internal dashboard with charts, tables, and role-based access. Built with React and Tailwind.', technologies: ['React', 'Tailwind'], category: 'web-development', githubLink: '', demoLink: '', image: 'https://placehold.co/800x480/1e293b/64748b?text=Dashboard' },
    { id: 'proj-blog-1', title: 'Blog Platform', description: 'Personal blog with CMS, comments, and responsive layout.', technologies: ['Blogger', 'HTML/CSS'], category: 'blogger', githubLink: '', demoLink: '', image: 'https://placehold.co/800x480/1e293b/64748b?text=Blog' },
    { id: 'proj-mobile-1', title: 'Mobile App', description: 'Cross-platform mobile app with modern framework. Performance and UX focused.', technologies: ['React Native', 'Mobile'], category: 'mobile-app', githubLink: '', demoLink: '', image: 'https://placehold.co/800x480/1e293b/64748b?text=Mobile+App' },
    { id: 'proj-wp-1', title: 'WordPress Site', description: 'Custom theme and plugins. SEO-friendly and easy to manage.', technologies: ['WordPress', 'PHP'], category: 'wordpress', githubLink: '', demoLink: '', image: 'https://placehold.co/800x480/1e293b/64748b?text=WordPress' },
    { id: 'proj-desktop-1', title: 'Desktop Tool', description: 'Electron-based desktop application for productivity and automation.', technologies: ['Electron', 'Desktop'], category: 'desktop', githubLink: '', demoLink: '', image: 'https://placehold.co/800x480/1e293b/64748b?text=Desktop' }
  ];

  function loadFromJSON() {
    if (readyPromise) return readyPromise;
    var dataDir = 'data/';
    readyPromise = Promise.all([
      fetch(dataDir + 'profile.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }),
      fetch(dataDir + 'projects.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }),
      fetch(dataDir + 'services.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }),
      fetch(dataDir + 'posts.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
    ]).then(function (arr) {
      cache.profile = arr[0];
      cache.projects = Array.isArray(arr[1]) ? arr[1] : null;
      cache.services = Array.isArray(arr[2]) ? arr[2] : null;
      cache.posts = Array.isArray(arr[3]) ? arr[3] : null;
      return cache;
    });
    return readyPromise;
  }

  function getProfile() {
    if (cache.profile !== null) return cache.profile;
    return getProfileSync();
  }

  function getProjects() {
    if (cache.projects && cache.projects.length > 0) return cache.projects;
    var list = get(KEYS.projects);
    return list && list.length > 0 ? list : defaultProjects;
  }

  function getServices() {
    if (cache.services && cache.services.length >= 0) return cache.services;
    return get(KEYS.services);
  }

  function getBlogPosts() {
    if (cache.posts && cache.posts.length >= 0) return cache.posts;
    return get(KEYS.posts);
  }

  loadFromJSON();

  window.PortfolioData = {
    getBlogPosts: getBlogPosts,
    getProjects: getProjects,
    getServices: getServices,
    getProfile: getProfile,
    ready: function () { return loadFromJSON(); }
  };
})(window);
