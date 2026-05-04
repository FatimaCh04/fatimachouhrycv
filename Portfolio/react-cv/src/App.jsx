import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import ProjectDetail from './components/ProjectDetail';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Resume from './components/Resume';
import Footer from './components/Footer';
import Seo from './components/Seo';
import { ProfileProvider } from './lib/PublicProfileContext.jsx';

// Admin Components
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import ManageProfile from './admin/pages/ManageProfile';
import ManagePosts from './admin/pages/ManagePosts';
import ManageProjects from './admin/pages/ManageProjects';
import ManageServices from './admin/pages/ManageServices';
import ManageContactLinks from './admin/pages/ManageContactLinks';

/** Har route change par viewport top par — warna nayi page purani scroll position par “end” se dikhti hai */
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function FrontLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/index.html';
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
      root.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
      root.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.classList.remove('mobile-menu-open');
      root.classList.remove('mobile-menu-open');
    };
  }, [mobileMenuOpen]);

  return (
    <ProfileProvider>
      <Seo />
      <div id="mobile-overlay" aria-hidden="true" onClick={() => setMobileMenuOpen(false)}></div>
      <div className="min-h-screen">
        <Navbar
          mobileMenuOpen={mobileMenuOpen}
          onNavClick={() => setMobileMenuOpen(false)}
          onMenuToggle={() => setMobileMenuOpen((v) => !v)}
        />
        {/*
          Navbar is fixed; flow reserve must NOT rely on #site-main padding-top alone (Tailwind p-* on main
          would override it). A physical spacer reserves the bar height in document flow — permanent fix.
        */}
        <main id="site-main" className="flex min-h-screen flex-col px-4 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8">
          <div
            className={`site-main-nav-spacer shrink-0${isHome ? ' site-main-nav-spacer--home' : ''}`}
            aria-hidden="true"
          />
          <div className="flex min-h-0 flex-1 flex-col">
            <Outlet />
            <Footer />
          </div>
        </main>
      </div>
    </ProfileProvider>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/login.html" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard.html" element={<AdminDashboard />} />
          <Route path="manage-profile" element={<ManageProfile />} />
          <Route path="manage-profile.html" element={<ManageProfile />} />
          <Route path="manage-posts" element={<ManagePosts />} />
          <Route path="manage-posts.html" element={<ManagePosts />} />
          <Route path="manage-projects" element={<ManageProjects />} />
          <Route path="manage-projects.html" element={<ManageProjects />} />
          <Route path="manage-services" element={<ManageServices />} />
          <Route path="manage-services.html" element={<ManageServices />} />
          <Route path="manage-contact-links" element={<ManageContactLinks />} />
          <Route path="manage-contact-links.html" element={<ManageContactLinks />} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<FrontLayout />}>
          <Route index element={<Home />} />
          <Route path="index.html" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="about.html" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services.html" element={<Services />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio.html" element={<Portfolio />} />
          <Route path="project/:id" element={<ProjectDetail />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog.html" element={<Blog />} />
          <Route path="resume" element={<Resume />} />
          <Route path="resume.html" element={<Resume />} />
          <Route path="contact" element={<Contact />} />
          <Route path="contact.html" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
