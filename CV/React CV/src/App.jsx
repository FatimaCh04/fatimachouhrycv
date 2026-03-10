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

function FrontLayout() {
  return (
    <>
      <div id="mobile-overlay" aria-hidden="true"></div>
      <button type="button" id="mobile-menu-btn" className="hidden" aria-label="Open menu">
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>
      <div className="flex min-h-screen">
        <Navbar />
        <main id="site-main" className="flex-1 ml-72 p-8">
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
