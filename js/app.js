// ===================================================
// HireIQ — Main App Router & Utilities
// SPA Hash Routing System
// ===================================================

// ---- Toast Notifications ----
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas ${icons[type]}"></i>
    <span>${message}</span>
    <span class="toast-dismiss" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ---- Modal ----
function openModal(content, className = '') {
  const overlay = document.getElementById('modal-overlay');
  const container = document.getElementById('modal-container');
  container.innerHTML = content;
  if (className) container.className = `modal-container ${className}`;
  else container.className = 'modal-container';
  overlay.classList.remove('hidden');
  container.classList.remove('hidden');

  overlay.onclick = closeModal;
  document.addEventListener('keydown', handleEsc);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-container').classList.add('hidden');
  document.removeEventListener('keydown', handleEsc);
}

function handleEsc(e) { if (e.key === 'Escape') closeModal(); }

// ---- Theme Toggle ----
function initTheme() {
  const saved = localStorage.getItem('hireiq_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('hireiq_theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.innerHTML = theme === 'dark'
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
}

// ---- Evaluation Storage ----
function saveEvaluation(evalData) {
  const key = 'hireiq_evaluations';
  try {
    const all = JSON.parse(localStorage.getItem(key) || '[]');
    all.unshift(evalData);
    localStorage.setItem(key, JSON.stringify(all.slice(0, 20)));
  } catch(e) { console.error('Failed to save evaluation', e); }
}

function getEvaluations() {
  try { return JSON.parse(localStorage.getItem('hireiq_evaluations') || '[]'); } catch { return []; }
}

function getEvaluation(id) {
  return getEvaluations().find(e => e.id === id);
}

function updateDecision(evalId, candidateName, decision) {
  try {
    const all = JSON.parse(localStorage.getItem('hireiq_evaluations') || '[]');
    const eval_ = all.find(e => e.id === evalId);
    if (eval_) {
      const candidate = eval_.ranked.find(r => r.name === candidateName);
      if (candidate) candidate.decision = decision;
      localStorage.setItem('hireiq_evaluations', JSON.stringify(all));
    }
  } catch(e) { console.error('Failed to update decision', e); }
}

// ---- State ----
const AppState = {
  currentEval: null, // active evaluation in memory
  pendingResumes: [], // resumes being staged for evaluation
  pendingJD: null,    // JD being staged
};

// ---- SPA Router ----
const Routes = {
  '/': () => renderPage(Pages.Landing),
  '/login': () => renderPage(Pages.Login),
  '/signup': () => renderPage(Pages.Signup),
  '/dashboard': () => {
    if (!Auth.isLoggedIn()) { navigate('/login'); return; }
    renderPage(Pages.Dashboard);
  },
  '/evaluate': () => {
    if (!Auth.isLoggedIn()) { navigate('/login'); return; }
    renderPage(Pages.Evaluate);
  },
  '/results': () => {
    if (!Auth.isLoggedIn()) { navigate('/login'); return; }
    renderPage(Pages.Results);
  },
  '/history': () => {
    if (!Auth.isLoggedIn()) { navigate('/login'); return; }
    renderPage(Pages.History);
  }
};

function navigate(path, params = {}) {
  window.location.hash = path;
}

function getRoute() {
  const hash = window.location.hash.slice(1) || '/';
  return hash.split('?')[0];
}

function renderPage(PageModule) {
  const app = document.getElementById('app');
  const html = PageModule.render();
  app.innerHTML = html;
  if (PageModule.init) PageModule.init();
  updateActiveNav();
}

function updateActiveNav() {
  const path = getRoute();
  document.querySelectorAll('[data-route]').forEach(el => {
    el.classList.toggle('active', el.dataset.route === path);
  });
}

function router() {
  const path = getRoute();
  const handler = Routes[path];
  if (handler) handler();
  else { Routes['/'](); }
}

// ---- Shared Navbar HTML ----
function renderPublicNavbar() {
  const user = Auth.getCurrentUser();
  const path = getRoute();
  return `
    <nav class="navbar">
      <a class="nav-logo" href="#/" onclick="navigate('/')">
        <i class="fas fa-brain"></i>
        HireIQ
      </a>
      <div class="nav-links">
        <button class="theme-toggle" id="theme-toggle" onclick="toggleTheme()" title="Toggle theme"></button>
        ${user ? `
          <button class="nav-btn-ghost" onclick="navigate('/dashboard')"><i class="fas fa-th-large"></i> Dashboard</button>
        ` : `
          <button class="nav-link" onclick="navigate('/login')">Login</button>
          <button class="nav-btn-primary" onclick="navigate('/signup')">Get Started</button>
        `}
      </div>
    </nav>
  `;
}

function renderAppNavbar() {
  const user = Auth.getCurrentUser();
  return `
    <nav class="navbar">
      <div style="display:flex;align-items:center;gap:12px;">
        <button class="mobile-menu-btn" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>
        <a class="nav-logo" href="#/dashboard">
          <i class="fas fa-brain"></i>
          HireIQ
        </a>
      </div>
      <div class="nav-links">
        <button class="theme-toggle" id="theme-toggle" onclick="toggleTheme()" title="Toggle theme"></button>
        <div style="display:flex;align-items:center;gap:10px;padding:6px 14px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);">
          <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;color:#fff;">
            ${user?.avatar || user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span style="font-size:0.875rem;font-weight:600;">${user?.name || 'User'}</span>
        </div>
        <button class="nav-btn-ghost" onclick="handleLogout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
      </div>
    </nav>
  `;
}

function renderSidebar(activePath) {
  const items = [
    { path: '/dashboard', icon: 'fa-home', label: 'Dashboard' },
    { path: '/evaluate', icon: 'fa-play-circle', label: 'New Evaluation' },
    { path: '/history', icon: 'fa-history', label: 'Past Evaluations' },
  ];

  return `
    <div id="sidebar" class="sidebar">
      <div class="sidebar-section">
        <div class="sidebar-label">Main</div>
        ${items.map(item => `
          <button class="sidebar-item ${activePath === item.path ? 'active' : ''}"
            onclick="navigate('${item.path}')">
            <i class="fas ${item.icon}"></i>
            ${item.label}
            ${item.badge ? `<span class="sidebar-badge">${item.badge}</span>` : ''}
          </button>
        `).join('')}
      </div>
      <div class="sidebar-section">
        <div class="sidebar-label">Recent</div>
        ${getEvaluations().slice(0, 3).map(e => `
          <button class="sidebar-item" onclick="loadHistoryEval('${e.id}')">
            <i class="fas fa-file-lines"></i>
            <span class="truncate" style="max-width:140px">${e.title || 'Evaluation'}</span>
          </button>
        `).join('') || `<div class="text-muted text-sm" style="padding:0 12px">No recent evaluations</div>`}
      </div>
      <div class="sidebar-section" style="margin-top:auto;padding-top:20px;border-top:1px solid var(--border)">
        <button class="sidebar-item" onclick="handleLogout()">
          <i class="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
    </div>
    <div class="sidebar-overlay" id="sidebar-overlay" onclick="toggleSidebar()"></div>
  `;
}

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sb) {
    sb.classList.toggle('open');
    overlay?.classList.toggle('visible');
  }
}

function handleLogout() {
  Auth.logout();
  AppState.currentEval = null;
  AppState.pendingResumes = [];
  AppState.pendingJD = null;
  navigate('/');
  showToast('Logged out successfully', 'info');
}

function loadHistoryEval(id) {
  const evalData = getEvaluation(id);
  if (evalData) {
    AppState.currentEval = evalData;
    navigate('/results');
  }
}

// ---- PDF Export (Feature 14) ----
function exportPDF(evalData) {
  if (!window.jspdf) {
    showToast('PDF library loading... please try again', 'warning');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const primaryColor = [99, 102, 241];
  const textColor = [15, 23, 42];
  const mutedColor = [100, 116, 139];

  let y = 20;

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('HireIQ — Candidate Evaluation Report', 15, 22);

  y = 45;
  doc.setTextColor(...textColor);

  // Evaluation details
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Position: ${evalData.title || 'Job Evaluation'}`, 15, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date(evalData.date || Date.now()).toLocaleDateString()}`, 15, y);
  doc.text(`Total Candidates: ${evalData.ranked.length}`, 100, y);
  y += 7;
  doc.text(`Average Score: ${evalData.stats?.avgScore || 0}/100`, 15, y);
  doc.text(`Top Score: ${evalData.stats?.topScore || 0}/100`, 100, y);
  y += 12;

  // Stats summary
  doc.setFillColor(240, 242, 255);
  doc.roundedRect(15, y, 180, 20, 3, 3, 'F');
  doc.setTextColor(...primaryColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const s = evalData.stats;
  doc.text(`Strong Fit: ${s?.strongFit || 0}    Moderate Fit: ${s?.moderateFit || 0}    Weak Fit: ${s?.weakFit || 0}`, 25, y + 12);
  y += 28;

  // Shortlisted Candidates Table
  doc.setTextColor(...textColor);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Ranked Candidates', 15, y);
  y += 8;

  // Table headers
  const headers = [['#', 'Candidate', 'Score', 'Classification', 'Confidence', 'Decision']];
  const rows = evalData.ranked.map(r => [
    `#${r.rank}`,
    r.name,
    `${r.score}/100`,
    r.classification,
    `${Math.round(r.confidence * 100)}%`,
    r.decision || 'Pending'
  ]);

  doc.autoTable({
    head: headers,
    body: rows,
    startY: y,
    theme: 'striped',
    headStyles: { fillColor: primaryColor, textColor: [255,255,255], fontStyle: 'bold' },
    bodyStyles: { textColor: textColor },
    alternateRowStyles: { fillColor: [248, 249, 255] },
    margin: { left: 15, right: 15 }
  });

  y = doc.lastAutoTable.finalY + 16;

  // Individual candidate details
  for (const r of evalData.ranked.slice(0, 8)) {
    if (r.candidate?.isInvalid) continue;

    if (y > 240) { doc.addPage(); y = 20; }

    // Candidate header
    doc.setFillColor(248, 249, 255);
    doc.roundedRect(15, y, 180, 10, 2, 2, 'F');
    doc.setTextColor(...primaryColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${r.rank}. ${r.name} — ${r.score}/100 (${r.classification})`, 18, y + 7);
    y += 14;

    doc.setTextColor(...textColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    // Strengths
    if (r.explanation?.strengths?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 197, 94);
      doc.text('Strengths:', 18, y); y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      for (const s of r.explanation.strengths.slice(0, 2)) {
        const lines = doc.splitTextToSize(`• ${s}`, 170);
        doc.text(lines, 22, y); y += lines.length * 5;
      }
    }

    // Weaknesses
    if (r.explanation?.weaknesses?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(239, 68, 68);
      doc.text('Areas for Improvement:', 18, y); y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      for (const w of r.explanation.weaknesses.slice(0, 2)) {
        const lines = doc.splitTextToSize(`• ${w}`, 170);
        doc.text(lines, 22, y); y += lines.length * 5;
      }
    }

    // Reason
    if (r.explanation?.reason) {
      doc.setTextColor(...mutedColor);
      const lines = doc.splitTextToSize(`AI Analysis: ${r.explanation.reason}`, 172);
      doc.text(lines, 18, y); y += lines.length * 5 + 6;
    }

    y += 4;
    doc.setDrawColor(230, 230, 250);
    doc.line(15, y, 195, y);
    y += 8;
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...mutedColor);
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`HireIQ AI Evaluation Report — Page ${i} of ${pageCount}`, 15, 290);
    doc.text('Generated with HireIQ AI Hiring Intelligence System', 130, 290);
  }

  doc.save(`HireIQ_${(evalData.title || 'Evaluation').replace(/\s+/g, '_')}_Report.pdf`);
  showToast('PDF report exported successfully!', 'success');
}

// ---- Init ----
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  initTheme();

  // Seed demo evaluation if first time
  if (getEvaluations().length === 0) {
    try {
      const demo = Engine.runAnalysis(
        SAMPLE_JD,
        SAMPLE_CANDIDATES.map(c => c.rawText)
      );
      demo.id = 'demo_eval_001';
      demo.title = 'Senior Frontend Developer (Demo)';
      saveEvaluation(demo);
    } catch(e) { console.warn('Demo seeding failed', e); }
  }

  router();
});
