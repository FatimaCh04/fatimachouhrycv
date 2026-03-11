import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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

// Admin Components
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import ManageProfile from './admin/pages/ManageProfile';
import ManagePosts from './admin/pages/ManagePosts';
import ManageProjects from './admin/pages/ManageProjects';
import ManageServices from './admin/pages/ManageServices';
import ManageContactLinks from './admin/pages/ManageContactLinks';

function FrontLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  React.useEffect(() => {
    if (mobileMenuOpen) document.body.classList.add('mobile-menu-open');
    else document.body.classList.remove('mobile-menu-open');
    return () => document.body.classList.remove('mobile-menu-open');
  }, [mobileMenuOpen]);
  return (
    <>
      <div id="mobile-overlay" aria-hidden="true" onClick={() => setMobileMenuOpen(false)}></div>
      <div className="min-h-screen">
        <Navbar
          mobileMenuOpen={mobileMenuOpen}
          onNavClick={() => setMobileMenuOpen(false)}
          onMenuToggle={() => setMobileMenuOpen((v) => !v)}
        />
        <main id="site-main" className="pt-28 md:pt-28 p-4 sm:p-6 md:p-8 min-h-screen">
          <Outlet />
          <Footer />
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
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
