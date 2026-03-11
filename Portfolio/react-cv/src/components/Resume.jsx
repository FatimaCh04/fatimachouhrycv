import React, { useState } from 'react';
import { usePublicProfile } from '../lib/usePublicProfile';
import { useSupabaseQuery } from '../lib/useSupabaseQuery';

const RESUME_PROJECTS_SELECT = 'id, title, description, category, technologies, image, live_link, github_link, created_at';

function Resume() {
  const { profile } = usePublicProfile();
  const { data: projects = [] } = useSupabaseQuery('projects', {
    select: RESUME_PROJECTS_SELECT,
    orderBy: 'created_at',
    orderAsc: false,
    limit: 50,
    cacheKey: 'portfolio_projects',
    cacheTTL: 5 * 60 * 1000,
  });

  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    const el = document.getElementById('resume-content');
    if (!el) return;
    setDownloading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf().set({
        margin: 10,
        filename: 'Fatima_Choudhry_Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }).from(el).save();
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const skills = [
    'Web Development',
    'API Design & Backend',
    'Dashboards & Tools',
    'DevOps & Deployment',
    'React Development',
    'Mobile App Development'
  ];

  return (
    <>
      <style>{`
        .resume-project-img {
          width: 100%;
          height: 140px;
          min-height: 140px;
          object-fit: cover;
          object-position: center;
          border-radius: 0.5rem;
          background: #1e293b;
        }
        .resume-project-img.flex { display: flex; }
        @media print {
          @page { size: A4; margin: 12mm; }
          body, body * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body { zoom: 1 !important; background: #0f172a !important; }
          .no-print { display: none !important; }
          main {
            margin-left: 0 !important;
            max-width: 100% !important;
            padding: 0 !important;
            background: #0f172a !important;
          }
          #site-navbar { display: none !important; }
          #site-navbar-dropdown { display: none !important; }
          #resume-wrapper {
            max-width: 56rem !important;
            margin-left: auto !important;
            margin-right: auto !important;
            width: 100% !important;
            padding: 0 !important;
          }
          #resume-content {
            box-shadow: none !important;
            border: 1px solid #334155 !important;
            border-radius: 0.75rem !important;
            background: rgba(30, 41, 59, 0.95) !important;
            overflow: visible !important;
          }
          #resume-content img {
            max-width: 100%;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #resume-content img:not(.profile-photo) {
            height: auto;
          }
          #resume-content .profile-photo {
            width: 7rem !important;
            height: 7rem !important;
            min-width: 7rem !important;
            min-height: 7rem !important;
            object-fit: cover !important;
            border-radius: 50% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #resume-content .profile-photo-wrapper {
            width: 7rem !important;
            height: 7rem !important;
            min-width: 7rem !important;
            min-height: 7rem !important;
            border-radius: 50% !important;
            overflow: hidden !important;
            border: 2px solid #2dd4bf !important;
            padding: 4px !important;
            flex-shrink: 0 !important;
          }
          #resume-content .resume-project-img {
            width: 100% !important;
            height: 140px !important;
            min-height: 140px !important;
            object-fit: cover !important;
            object-position: center !important;
          }
          #resume-content [class*="bg-slate"],
          #resume-content [class*="border-slate"],
          #resume-content [class*="text-white"],
          #resume-content [class*="text-slate"],
          #resume-content [class*="text-primary"] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto text-left" id="resume-wrapper">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">description</span>
            My Resume
          </h2>
          <button type="button" onClick={handleDownloadPdf} disabled={downloading} id="resume-print-btn" className="inline-flex items-center gap-2 bg-primary text-slate-900 px-5 py-2.5 rounded-lg font-semibold hover:bg-teal-400 transition-colors disabled:opacity-70">
            <span className="material-symbols-outlined text-lg">download</span>
            {downloading ? 'Saving PDF...' : 'Download PDF'}
          </button>
        </div>

        <div id="resume-content" className="print-resume rounded-xl bg-slate-800/50 border border-slate-700 shadow-lg overflow-hidden">
          {/* Resume Header: name & contact left, profile photo right */}
          <div className="p-8 md:p-10 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1 text-center sm:text-left min-w-0 order-2 sm:order-1">
              <h1 className="resume-name text-3xl md:text-4xl font-extrabold text-white mb-2">{profile.name}</h1>
              <p className="resume-title text-lg text-primary font-semibold mb-4">{profile.title}</p>
              <div className="space-y-1 text-slate-300 text-sm">
                <p><span className="text-slate-500">Phone:</span> 0304313364</p>
                <p><span className="text-slate-500">Email:</span> fatimachoudhry94@gmail.com</p>
                <p><span className="text-slate-500">Address:</span> Vehari, Pakistan</p>
                <p><span className="text-slate-500">Languages:</span> English, Urdu, Punjabi</p>
              </div>
            </div>
            <div className="shrink-0 flex justify-center sm:justify-end order-1 sm:order-2">
              <div className="profile-photo-wrapper size-28 md:size-32 rounded-full border-2 border-primary p-1 shadow-glow overflow-hidden flex-shrink-0">
                <img alt="Profile" className="profile-photo size-full rounded-full object-cover object-center" src={profile.photo} onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/profile-placeholder.svg'; }}/>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="p-8 md:p-10 border-b border-slate-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div className="flex justify-between sm:block"><span className="text-slate-500">First Name</span><span className="font-semibold text-white sm:block">Fatima</span></div>
              <div className="flex justify-between sm:block"><span className="text-slate-500">Last Name</span><span className="font-semibold text-white sm:block">Choudhry</span></div>
              <div className="flex justify-between sm:block"><span className="text-slate-500">Date of Birth</span><span className="font-semibold text-white sm:block">11-12-2004</span></div>
              <div className="flex justify-between sm:block"><span className="text-slate-500">Nationality</span><span className="font-semibold text-white sm:block">Pakistan</span></div>
              <div className="flex justify-between sm:block"><span className="text-slate-500">Phone</span><span className="font-semibold text-white sm:block">0304313364</span></div>
              <div className="flex justify-between sm:block"><span className="text-slate-500">Email</span><span className="font-semibold text-white sm:block">fatimachoudhry94@gmail.com</span></div>
              <div className="flex justify-between sm:block"><span className="text-slate-500">Address</span><span className="font-semibold text-white sm:block">Vehari, Pakistan</span></div>
              <div className="flex justify-between sm:block"><span className="text-slate-500">Languages</span><span className="font-semibold text-white sm:block">English, Urdu, Punjabi</span></div>
            </div>
          </div>

          {/* Portfolio */}
          <div className="p-8 md:p-10 border-b border-slate-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">folder_open</span>
              Portfolio
            </h3>
            <div id="resume-portfolio-list" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.length === 0 ? (
                <p className="text-slate-400 col-span-full">No projects yet.</p>
              ) : (
                projects.map((p, i) => {
                  const imgSrc = (p.image && p.image.trim()) || (p.image_url && p.image_url.trim()) || '';
                  const placeholderImg = `https://picsum.photos/800/400?random=resume-${(p.id || i).toString().replace(/[^a-z0-9]/gi, '').slice(-8) || i}`;
                  const displaySrc = imgSrc || placeholderImg;
                  return (
                  <div key={p.id || i} className="rounded-lg border border-slate-700 overflow-hidden bg-slate-800/50 flex flex-col">
                    <div className="shrink-0 relative">
                      <div className="flex items-center justify-center bg-slate-800 overflow-hidden" style={{ minHeight: '140px' }}>
                        <img
                          src={displaySrc}
                          alt={p.title || 'Project'}
                          className="resume-project-img w-full h-full object-cover object-center"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.target.onerror = null;
                            if (e.target.src !== placeholderImg) {
                              e.target.src = placeholderImg;
                            }
                          }}
                        />
                      </div>
                      {p.category && (
                        <p className="text-xs font-bold tracking-wider text-primary bg-slate-900/90 px-2 py-1 text-center">
                          {(p.category || '').replace(/-/g, ' ').toUpperCase()}
                        </p>
                      )}
                    </div>
                    <div className="p-4 flex-1">
                      <p className="font-semibold text-white">{p.title}</p>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                    </div>
                  </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Skills & Expertise */}
          <div className="p-8 md:p-10 border-b border-slate-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">psychology</span>
              Skills & Expertise
            </h3>
            <div id="resume-skills-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((s, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <span className="text-white font-medium">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="p-8 md:p-10 border-b border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">link</span>
              Connect
            </h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <a className="text-primary hover:text-teal-400 transition-colors" href="https://github.com/FatimaCh04/FA23-BSE-123-5B-Fatima-Ch-" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a className="text-primary hover:text-teal-400 transition-colors" href="https://www.linkedin.com/in/fatima-choudhry-714423358/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>

          {/* Footer inside Resume */}
          <footer className="p-6 text-center text-slate-500 text-sm border-t border-slate-700">
            &copy; <span id="resume-year">{new Date().getFullYear()}</span> <span className="resume-name">Fatima Choudhry</span> &mdash; All Rights Reserved.
          </footer>
        </div>
      </div>
    </>
  );
}

export default Resume;
