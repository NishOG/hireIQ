import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../components/Navbar';
import { getEvaluations, AppState } from '../state';
import { Auth } from '../auth';
import { showToast } from '../utils';

export default function Landing() {
  const navigate = useNavigate();

  const loadDemoAndGoToResults = () => {
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
    } else {
      showToast('Demo data not found', 'warning');
    }
  };

  const features = [
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
  ];

  const testimonials = [
    { text: "HireIQ cut our screening time from 3 days to 30 minutes. The AI scoring is surprisingly accurate and the bias-free mode gives us confidence in our process.", name: 'Sarah Chen', role: 'Head of Talent, FinTech Corp', init: 'SC' },
    { text: "The skill gap analysis is a game changer. We now know exactly what each candidate needs to succeed, which helps us make better hiring decisions and plan onboarding.", name: 'Marcus Rivera', role: 'Engineering Manager, CloudStartup', init: 'MR' },
    { text: "The comparative analysis feature saved us from a tough decision between two great candidates. The AI explained exactly why one was a better fit for our specific stack.", name: 'Priya Patel', role: 'Technical Recruiter, ProductCo', init: 'PP' },
  ];

  return (
    <>
      <PublicNavbar />
      <div className="landing-page">
        <section className="hero">
          <div style={{maxWidth:'800px', margin:'0 auto', position:'relative', zIndex:1}}>
            <div className="hero-badge">
              <i className="fas fa-bolt"></i>
              AI-Powered Candidate Intelligence
            </div>
            <h1 className="hero-title">
              The Smarter Way to<br/>
              <span className="gradient-text">Hire Top Talent</span>
            </h1>
            <p className="hero-subtitle">
              Evaluate, rank, and compare candidates with AI precision. Get structured scoring, explainable insights, and bias-free analysis in seconds.
            </p>
            <div className="hero-actions">
              <button className="btn-hero-primary" onClick={() => navigate('/signup')}>
                <i className="fas fa-rocket"></i>
                Get Started Free
              </button>
              <button className="btn-hero-ghost" onClick={loadDemoAndGoToResults}>
                <i className="fas fa-play"></i>
                View Live Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">14</div>
                <div className="hero-stat-label">AI Features</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">10x</div>
                <div className="hero-stat-label">Faster Screening</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">100%</div>
                <div className="hero-stat-label">Bias-Free</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">∞</div>
                <div className="hero-stat-label">Candidates</div>
              </div>
            </div>
          </div>
        </section>

        <div style={{background:'var(--bg)'}}>
          <div className="section">
            <div style={{textAlign:'center', marginBottom:'60px'}}>
              <div className="section-badge"><i className="fas fa-star"></i> Features</div>
              <h2 className="section-title">Everything You Need to Hire Better</h2>
              <p className="section-subtitle" style={{margin:'0 auto'}}>14 AI-powered features designed to streamline your entire hiring pipeline</p>
            </div>
            <div className="features-grid">
              {features.map((f, i) => (
                <div key={i} className="feature-card">
                  <div className="feature-icon"><i className={`fas ${f.icon}`}></i></div>
                  <div style={{fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--text-muted)', marginBottom:'6px'}}>Feature {f.num}</div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="how-section">
          <div className="section">
            <div style={{textAlign:'center', marginBottom:0}}>
              <div className="section-badge"><i className="fas fa-list-check"></i> Process</div>
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle" style={{margin:'0 auto'}}>Get from job description to ranked shortlist in three simple steps</p>
            </div>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-num">1</div>
                <h3 className="step-title">Paste Job Description</h3>
                <p className="step-desc">Enter or upload your JD. Our AI extracts required skills, experience level, and role keywords automatically.</p>
              </div>
              <div className="step-card">
                <div className="step-num">2</div>
                <h3 className="step-title">Upload Candidate Resumes</h3>
                <p className="step-desc">Add multiple candidate resumes by pasting text or uploading files. Add up to 20 candidates per evaluation.</p>
              </div>
              <div className="step-card">
                <div className="step-num">3</div>
                <h3 className="step-title">Get AI Rankings</h3>
                <p className="step-desc">Instantly receive ranked candidates with scores, skill gaps, clusters, and actionable insights ready to act on.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{background:'var(--bg)'}}>
          <div className="section">
            <div style={{textAlign:'center', marginBottom:'60px'}}>
              <div className="section-badge"><i className="fas fa-quote-left"></i> Testimonials</div>
              <h2 className="section-title">Trusted by Hiring Teams</h2>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="testimonial-card">
                  <div className="testimonial-stars">
                    <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                  </div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.init}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{maxWidth:'1200px', margin:'0 auto'}}>
          <div className="cta-section">
            <div className="section-badge" style={{marginBottom:'20px'}}><i className="fas fa-rocket"></i> Ready to Start</div>
            <h2 className="section-title">Start Hiring Smarter Today</h2>
            <p style={{color:'var(--text-secondary)', margin:'16px 0 32px', fontSize:'1.05rem'}}>
              Free to use. No credit card required. Get your first evaluation in under 5 minutes.
            </p>
            <div style={{display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap'}}>
              <button className="btn-hero-primary" onClick={() => navigate('/signup')}>
                <i className="fas fa-user-plus"></i> Create Free Account
              </button>
              <button className="btn-hero-ghost" onClick={loadDemoAndGoToResults}>
                <i className="fas fa-eye"></i> See Demo Results
              </button>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="nav-logo"><i className="fas fa-brain"></i> HireIQ</div>
                <p>AI-powered hiring intelligence for modern recruitment teams. Faster, fairer, and smarter candidate evaluation.</p>
              </div>
              <div className="footer-col">
                <h4>Product</h4>
                <ul>
                  <li><a href="#/">Features</a></li>
                  <li><a href="#/evaluate">New Evaluation</a></li>
                  <li><a href="#/history">History</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Account</h4>
                <ul>
                  <li><a href="#/login">Login</a></li>
                  <li><a href="#/signup">Sign Up</a></li>
                  <li><a href="#/dashboard">Dashboard</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Info</h4>
                <ul>
                  <li><a href="#">About</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© 2024 HireIQ. All rights reserved.</span>
              <span>Built with React · Pure Frontend · localStorage powered</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
