// ===================================================
// HireIQ — Landing Page
// ===================================================

const Pages = {};

Pages.Landing = {
  render() {
    return `
      ${renderPublicNavbar()}
      <div class="landing-page">

        <!-- Hero Section -->
        <section class="hero">
          <div style="max-width:800px;margin:0 auto;position:relative;z-index:1">
            <div class="hero-badge">
              <i class="fas fa-bolt"></i>
              AI-Powered Candidate Intelligence
            </div>
            <h1 class="hero-title">
              The Smarter Way to<br/>
              <span class="gradient-text">Hire Top Talent</span>
            </h1>
            <p class="hero-subtitle">
              Evaluate, rank, and compare candidates with AI precision. Get structured scoring, explainable insights, and bias-free analysis in seconds.
            </p>
            <div class="hero-actions">
              <button class="btn-hero-primary" onclick="navigate('/signup')">
                <i class="fas fa-rocket"></i>
                Get Started Free
              </button>
              <button class="btn-hero-ghost" onclick="loadDemoAndGoToResults()">
                <i class="fas fa-play"></i>
                View Live Demo
              </button>
            </div>
            <div class="hero-stats">
              <div class="hero-stat">
                <div class="hero-stat-value">14</div>
                <div class="hero-stat-label">AI Features</div>
              </div>
              <div class="hero-stat">
                <div class="hero-stat-value">10x</div>
                <div class="hero-stat-label">Faster Screening</div>
              </div>
              <div class="hero-stat">
                <div class="hero-stat-value">100%</div>
                <div class="hero-stat-label">Bias-Free</div>
              </div>
              <div class="hero-stat">
                <div class="hero-stat-value">∞</div>
                <div class="hero-stat-label">Candidates</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <div style="background:var(--bg);">
          <div class="section">
            <div style="text-align:center;margin-bottom:60px">
              <div class="section-badge"><i class="fas fa-star"></i> Features</div>
              <h2 class="section-title">Everything You Need to Hire Better</h2>
              <p class="section-subtitle" style="margin:0 auto">14 AI-powered features designed to streamline your entire hiring pipeline</p>
            </div>
            <div class="features-grid">
              ${[
                { icon: 'fa-file-lines', num: '01', title: 'Resume Parsing Engine', desc: 'Automatically extracts and normalizes skills, experience, and projects from any resume format.' },
                { icon: 'fa-magnifying-glass-chart', num: '02', title: 'JD Analyzer', desc: 'Parses job descriptions to extract required skills, optional skills, experience level, and role keywords.' },
                { icon: 'fa-code-merge', num: '03', title: 'Semantic Skill Matching', desc: 'Goes beyond keywords — maps React ≈ Frontend Framework, Node.js ≈ Backend JS for intelligent matching.' },
                { icon: 'fa-calculator', num: '04', title: 'AI Scoring System', desc: 'Score = 40% Skill Match + 25% Experience + 20% Project Relevance + 15% Semantic Similarity.' },
                { icon: 'fa-ranking-star', num: '05', title: 'Candidate Ranking', desc: 'Ranks all candidates by score with intelligent tie-breaking using experience and project quality.' },
                { icon: 'fa-lightbulb', num: '06', title: 'Explainable AI', desc: 'Get structured strengths, weaknesses, and 2-3 line reasoning for every candidate evaluation.' },
                { icon: 'fa-shield-halved', num: '07', title: 'Bias Reduction Layer', desc: 'Evaluates on skills and experience only — names, gender, and college indicators are excluded.' },
                { icon: 'fa-magnifying-glass-minus', num: '08', title: 'Skill Gap Detection', desc: 'Identifies exactly which required skills are missing and provides actionable improvement suggestions.' },
                { icon: 'fa-code-compare', num: '09', title: 'Comparative Analysis', desc: 'Side-by-side comparison of top candidates with AI explanations of why one ranks higher.' },
                { icon: 'fa-gauge-high', num: '10', title: 'Confidence Score', desc: 'Rates the reliability of each evaluation based on resume completeness and skill density.' },
                { icon: 'fa-object-group', num: '11', title: 'Resume Clustering', desc: 'Groups candidates into Strong/Moderate/Weak Fit clusters with specialty sub-groups.' },
                { icon: 'fa-filter', num: '12', title: 'Dashboard Filters', desc: 'Filter by score range, skills, classification, and cluster. Updates candidate list in real-time.' },
                { icon: 'fa-user-check', num: '13', title: 'Hire/Reject Simulation', desc: 'Mark candidates as Hire or Reject. Visual state changes persist throughout your session.' },
                { icon: 'fa-file-pdf', num: '14', title: 'Export PDF Report', desc: 'Generate a professional shortlist PDF with scores, classifications, and AI reasoning.' }
              ].map(f => `
                <div class="feature-card">
                  <div class="feature-icon"><i class="fas ${f.icon}"></i></div>
                  <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);margin-bottom:6px">Feature ${f.num}</div>
                  <div class="feature-title">${f.title}</div>
                  <div class="feature-desc">${f.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- How It Works -->
        <div class="how-section">
          <div class="section">
            <div style="text-align:center;margin-bottom:0">
              <div class="section-badge"><i class="fas fa-list-check"></i> Process</div>
              <h2 class="section-title">How It Works</h2>
              <p class="section-subtitle" style="margin:0 auto">Get from job description to ranked shortlist in three simple steps</p>
            </div>
            <div class="steps-grid">
              <div class="step-card">
                <div class="step-num">1</div>
                <h3 class="step-title">Paste Job Description</h3>
                <p class="step-desc">Enter or upload your JD. Our AI extracts required skills, experience level, and role keywords automatically.</p>
              </div>
              <div class="step-card">
                <div class="step-num">2</div>
                <h3 class="step-title">Upload Candidate Resumes</h3>
                <p class="step-desc">Add multiple candidate resumes by pasting text or uploading files. Add up to 20 candidates per evaluation.</p>
              </div>
              <div class="step-card">
                <div class="step-num">3</div>
                <h3 class="step-title">Get AI Rankings</h3>
                <p class="step-desc">Instantly receive ranked candidates with scores, skill gaps, clusters, and actionable insights ready to act on.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Testimonials -->
        <div style="background:var(--bg);">
          <div class="section">
            <div style="text-align:center;margin-bottom:60px">
              <div class="section-badge"><i class="fas fa-quote-left"></i> Testimonials</div>
              <h2 class="section-title">Trusted by Hiring Teams</h2>
            </div>
            <div class="testimonials-grid">
              ${[
                { text: "HireIQ cut our screening time from 3 days to 30 minutes. The AI scoring is surprisingly accurate and the bias-free mode gives us confidence in our process.", name: 'Sarah Chen', role: 'Head of Talent, FinTech Corp', init: 'SC' },
                { text: "The skill gap analysis is a game changer. We now know exactly what each candidate needs to succeed, which helps us make better hiring decisions and plan onboarding.", name: 'Marcus Rivera', role: 'Engineering Manager, CloudStartup', init: 'MR' },
                { text: "The comparative analysis feature saved us from a tough decision between two great candidates. The AI explained exactly why one was a better fit for our specific stack.", name: 'Priya Patel', role: 'Technical Recruiter, ProductCo', init: 'PP' },
              ].map(t => `
                <div class="testimonial-card">
                  <div class="testimonial-stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                  <p class="testimonial-text">"${t.text}"</p>
                  <div class="testimonial-author">
                    <div class="testimonial-avatar">${t.init}</div>
                    <div>
                      <div class="testimonial-name">${t.name}</div>
                      <div class="testimonial-role">${t.role}</div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div style="max-width:1200px;margin:0 auto;">
          <div class="cta-section">
            <div class="section-badge" style="margin-bottom:20px"><i class="fas fa-rocket"></i> Ready to Start</div>
            <h2 class="section-title">Start Hiring Smarter Today</h2>
            <p style="color:var(--text-secondary);margin:16px 0 32px;font-size:1.05rem">
              Free to use. No credit card required. Get your first evaluation in under 5 minutes.
            </p>
            <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
              <button class="btn-hero-primary" onclick="navigate('/signup')">
                <i class="fas fa-user-plus"></i> Create Free Account
              </button>
              <button class="btn-hero-ghost" onclick="loadDemoAndGoToResults()">
                <i class="fas fa-eye"></i> See Demo Results
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="footer">
          <div class="footer-inner">
            <div class="footer-grid">
              <div class="footer-brand">
                <div class="nav-logo"><i class="fas fa-brain"></i> HireIQ</div>
                <p>AI-powered hiring intelligence for modern recruitment teams. Faster, fairer, and smarter candidate evaluation.</p>
              </div>
              <div class="footer-col">
                <h4>Product</h4>
                <ul>
                  <li><a href="#/">Features</a></li>
                  <li><a href="#/evaluate">New Evaluation</a></li>
                  <li><a href="#/history">History</a></li>
                </ul>
              </div>
              <div class="footer-col">
                <h4>Account</h4>
                <ul>
                  <li><a href="#/login">Login</a></li>
                  <li><a href="#/signup">Sign Up</a></li>
                  <li><a href="#/dashboard">Dashboard</a></li>
                </ul>
              </div>
              <div class="footer-col">
                <h4>Info</h4>
                <ul>
                  <li><a href="#">About</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div class="footer-bottom">
              <span>© 2024 HireIQ. All rights reserved.</span>
              <span>Built with AI · Pure Frontend · localStorage powered</span>
            </div>
          </div>
        </footer>
      </div>
    `;
  },

  init() {
    updateThemeIcon(document.documentElement.getAttribute('data-theme'));
  }
};

function loadDemoAndGoToResults() {
  const evals = getEvaluations();
  const demo = evals.find(e => e.id === 'demo_eval_001') || evals[0];
  if (demo) {
    AppState.currentEval = demo;
    if (Auth.isLoggedIn()) {
      navigate('/results');
    } else {
      navigate('/signup');
      showToast('Sign up to view the full demo results!', 'info', 4000);
    }
  }
}
