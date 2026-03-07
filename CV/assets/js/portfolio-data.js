/**
 * Public read-only access to portfolio data (localStorage).
 * Same keys as admin so content managed in admin appears on the site.
 * Default projects shown when none in localStorage.
 */
(function (window) {
  'use strict';
  var KEYS = {
    posts: 'portfolio_blog_posts',
    projects: 'portfolio_projects',
    services: 'portfolio_services',
    profile: 'portfolio_profile'
  };
  function get(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function getProfile() {
    try {
      var raw = localStorage.getItem(KEYS.profile);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
  var defaultProjects = [
    { id: 'proj-web-1', title: 'Project One', description: 'Full-stack web application with React and Node.js. REST API, auth, and responsive UI.', technologies: ['React', 'Node'], category: 'web-development', githubLink: '', demoLink: '', image: '' },
    { id: 'proj-react-1', title: 'React SPA', description: 'Single-page app with React, state management, and modern UI components.', technologies: ['React', 'Tailwind'], category: 'react-development', githubLink: '', demoLink: '', image: '' },
    { id: 'proj-api-1', title: 'API Service', description: 'FastAPI backend with PostgreSQL, JWT auth, and OpenAPI documentation.', technologies: ['Python', 'FastAPI'], category: 'web-development', githubLink: '', demoLink: '', image: '' },
    { id: 'proj-dash-1', title: 'Dashboard & Admin Tool', description: 'Internal dashboard with charts, tables, and role-based access. Built with React and Tailwind.', technologies: ['React', 'Tailwind'], category: 'web-development', githubLink: '', demoLink: '', image: '' },
    { id: 'proj-blog-1', title: 'Blog Platform', description: 'Personal blog with CMS, comments, and responsive layout.', technologies: ['Blogger', 'HTML/CSS'], category: 'blogger', githubLink: '', demoLink: '', image: '' },
    { id: 'proj-mobile-1', title: 'Mobile App', description: 'Cross-platform mobile app with modern framework. Performance and UX focused.', technologies: ['React Native', 'Mobile'], category: 'mobile-app', githubLink: '', demoLink: '', image: '' },
    { id: 'proj-wp-1', title: 'WordPress Site', description: 'Custom theme and plugins. SEO-friendly and easy to manage.', technologies: ['WordPress', 'PHP'], category: 'wordpress', githubLink: '', demoLink: '', image: '' },
    { id: 'proj-desktop-1', title: 'Desktop Tool', description: 'Electron-based desktop application for productivity and automation.', technologies: ['Electron', 'Desktop'], category: 'desktop', githubLink: '', demoLink: '', image: '' }
  ];
  function getProjects() {
    var list = get(KEYS.projects);
    return list && list.length > 0 ? list : defaultProjects;
  }
  window.PortfolioData = {
    getBlogPosts: function () { return get(KEYS.posts); },
    getProjects: getProjects,
    getServices: function () { return get(KEYS.services); },
    getProfile: getProfile
  };
})(window);
