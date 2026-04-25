import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Auth } from '../auth';
import { getEvaluations, AppState } from '../state';
import { formatDate } from '../utils';
import Chart from 'chart.js/auto';

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const user = Auth.getCurrentUser();
  const evals = getEvaluations();

  const totalEvals = evals.length;
  const totalCandidates = evals.reduce((sum, e) => sum + (e.ranked?.length || 0), 0);
  const avgScore = totalEvals > 0
    ? Math.round(evals.reduce((sum, e) => sum + (e.stats?.avgScore || 0), 0) / totalEvals)
    : 0;
  const hired = evals.reduce((sum, e) => sum + (e.ranked?.filter(r => r.decision === 'Hire').length || 0), 0);

  useEffect(() => {
    const allCandidates = evals.flatMap(e => e.ranked || []);
    let scoreChart, classChart;

    const scoreCtx = document.getElementById('dash-score-chart');
    if (scoreCtx) {
      const buckets = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 };
      allCandidates.forEach(c => {
        const s = c.score;
        if (s <= 20) buckets['0-20']++;
        else if (s <= 40) buckets['21-40']++;
        else if (s <= 60) buckets['41-60']++;
        else if (s <= 80) buckets['61-80']++;
        else buckets['81-100']++;
      });

      scoreChart = new Chart(scoreCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(buckets),
          datasets: [{
            label: 'Candidates',
            data: Object.values(buckets),
            backgroundColor: [
              'rgba(239,68,68,0.7)', 'rgba(245,158,11,0.7)',
              'rgba(59,130,246,0.7)', 'rgba(34,197,94,0.7)',
              'rgba(99,102,241,0.8)'
            ],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    const classCtx = document.getElementById('dash-class-chart');
    if (classCtx) {
      const strong = allCandidates.filter(c => c.classification === 'Strong Fit').length;
      const moderate = allCandidates.filter(c => c.classification === 'Moderate Fit').length;
      const weak = allCandidates.filter(c => c.classification === 'Weak Fit' || !c.classification).length;

      classChart = new Chart(classCtx, {
        type: 'doughnut',
        data: {
          labels: ['Strong Fit', 'Moderate Fit', 'Weak Fit'],
          datasets: [{
            data: [strong, moderate, weak],
            backgroundColor: ['rgba(34,197,94,0.8)', 'rgba(245,158,11,0.8)', 'rgba(239,68,68,0.8)'],
            borderColor: ['#22c55e', '#f59e0b', '#ef4444'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { color: '#94a3b8', padding: 16, usePointStyle: true } }
          }
        }
      });
    }

    return () => {
      scoreChart?.destroy();
      classChart?.destroy();
    };
  }, [evals]);

  const getClassBadge = (score) => {
    if (score >= 70) return 'badge-strong';
    if (score >= 45) return 'badge-moderate';
    return 'badge-weak';
  };
  const getClassLabel = (score) => {
    if (score >= 70) return 'Strong';
    if (score >= 45) return 'Moderate';
    return 'Weak';
  };

  const loadHistoryEval = (id) => {
    const ev = evals.find(e => e.id === id);
    if (ev) {
      AppState.currentEval = ev;
      navigate('/results');
    }
  };

  const loadDemoResults = () => {
    const demo = evals.find(e => e.id === 'demo_eval_001') || evals[0];
    if (demo) {
      AppState.currentEval = demo;
      navigate('/results');
    }
  };

  return (
    <>
      <AppNavbar onToggleSidebar={() => setSidebarOpen(true)} />
      <div className="app-layout">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-content">
          <div className="page-header">
            <div>
              <div className="page-title">Dashboard</div>
              <div className="page-subtitle">Welcome back, {user?.name || 'Recruiter'} 👋</div>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/evaluate')}>
              <i className="fas fa-plus"></i> New Evaluation
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{background:'rgba(99,102,241,0.12)', color:'var(--primary-light)'}}><i className="fas fa-file-lines"></i></div>
                <div className="stat-card-badge" style={{background:'rgba(99,102,241,0.1)', color:'var(--primary-light)'}}>Total</div>
              </div>
              <div className="stat-value">{totalEvals}</div>
              <div className="stat-label">Evaluations Run</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{background:'rgba(168,85,247,0.12)', color:'var(--accent)'}}><i className="fas fa-users"></i></div>
                <div className="stat-card-badge" style={{background:'rgba(168,85,247,0.1)', color:'var(--accent)'}}>All Time</div>
              </div>
              <div className="stat-value">{totalCandidates}</div>
              <div className="stat-label">Candidates Processed</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{background:'rgba(34,197,94,0.12)', color:'var(--success)'}}><i className="fas fa-chart-line"></i></div>
                <div className="stat-card-badge" style={{background:'rgba(34,197,94,0.1)', color:'var(--success)'}}>Avg</div>
              </div>
              <div className="stat-value">{avgScore}<span style={{fontSize:'1rem', color:'var(--text-muted)'}}>/100</span></div>
              <div className="stat-label">Average Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{background:'rgba(245,158,11,0.12)', color:'var(--warning)'}}><i className="fas fa-user-check"></i></div>
                <div className="stat-card-badge" style={{background:'rgba(245,158,11,0.1)', color:'var(--warning)'}}>Hired</div>
              </div>
              <div className="stat-value">{hired}</div>
              <div className="stat-label">Candidates Hired</div>
            </div>
          </div>

          <div className="dash-charts-grid">
            <div className="chart-card">
              <div className="chart-card-header">
                <div>
                  <div className="chart-card-title">Score Distribution</div>
                  <div className="chart-card-sub">Across all evaluations</div>
                </div>
              </div>
              <div style={{height:'260px', position:'relative'}}>
                <canvas id="dash-score-chart"></canvas>
              </div>
            </div>
            <div className="chart-card">
              <div className="chart-card-header">
                <div>
                  <div className="chart-card-title">Candidate Classifications</div>
                  <div className="chart-card-sub">Strong / Moderate / Weak Fit</div>
                </div>
              </div>
              <div style={{height:'260px', position:'relative'}}>
                <canvas id="dash-class-chart"></canvas>
              </div>
            </div>
          </div>

          <div className="grid-2" style={{alignItems:'start'}}>
            <div>
              <div className="section-header">
                <div className="section-header-left">
                  <h3>Recent Evaluations</h3>
                  <p>Your latest hiring analyses</p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/history')}>View All</button>
              </div>
              <div className="activity-list">
                {evals.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-file-circle-plus"></i>
                    <h3>No evaluations yet</h3>
                    <p>Start your first evaluation to see results here</p>
                    <button className="btn btn-primary" style={{marginTop:'16px'}} onClick={() => navigate('/evaluate')}>
                      <i className="fas fa-plus"></i> Start Evaluation
                    </button>
                  </div>
                ) : evals.slice(0, 5).map(e => (
                  <div key={e.id} className="activity-item" style={{cursor:'pointer'}} onClick={() => loadHistoryEval(e.id)}>
                    <div className="activity-icon"><i className="fas fa-file-lines"></i></div>
                    <div className="activity-info">
                      <div className="activity-title">{e.title || 'Job Evaluation'}</div>
                      <div className="activity-meta">{e.ranked?.length || 0} candidates · Top Score: {e.stats?.topScore || 0}/100</div>
                    </div>
                    <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'4px'}}>
                      <div className="activity-time">{formatDate(e.date)}</div>
                      <div className={`classification-badge ${getClassBadge(e.stats?.topScore || 0)}`}>{getClassLabel(e.stats?.topScore || 0)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="section-header">
                <div className="section-header-left">
                  <h3>Quick Actions</h3>
                  <p>Jump right in</p>
                </div>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                <div className="card" style={{cursor:'pointer', transition:'var(--transition)'}} 
                     onMouseEnter={e => e.currentTarget.style.borderColor='var(--primary)'} 
                     onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'} 
                     onClick={() => navigate('/evaluate')}>
                  <div style={{display:'flex', gap:'14px', alignItems:'center'}}>
                    <div style={{width:'48px', height:'48px', borderRadius:'var(--radius-sm)', background:'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(168,85,247,0.2))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', color:'var(--primary-light)', flexShrink:0}}><i className="fas fa-plus-circle"></i></div>
                    <div>
                      <div className="card-title">New Evaluation</div>
                      <div className="card-subtitle">Start analyzing candidates for a new role</div>
                    </div>
                    <i className="fas fa-chevron-right" style={{marginLeft:'auto', color:'var(--text-muted)'}}></i>
                  </div>
                </div>
                <div className="card" style={{cursor:'pointer', transition:'var(--transition)'}} 
                     onMouseEnter={e => e.currentTarget.style.borderColor='var(--primary)'} 
                     onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'} 
                     onClick={loadDemoResults}>
                  <div style={{display:'flex', gap:'14px', alignItems:'center'}}>
                    <div style={{width:'48px', height:'48px', borderRadius:'var(--radius-sm)', background:'linear-gradient(135deg,rgba(34,197,94,0.15),rgba(16,185,129,0.15))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', color:'var(--success)', flexShrink:0}}><i className="fas fa-eye"></i></div>
                    <div>
                      <div className="card-title">View Demo Results</div>
                      <div className="card-subtitle">See 8 pre-analyzed candidates with full AI insights</div>
                    </div>
                    <i className="fas fa-chevron-right" style={{marginLeft:'auto', color:'var(--text-muted)'}}></i>
                  </div>
                </div>
                <div className="card" style={{cursor:'pointer', transition:'var(--transition)'}} 
                     onMouseEnter={e => e.currentTarget.style.borderColor='var(--primary)'} 
                     onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'} 
                     onClick={() => navigate('/history')}>
                  <div style={{display:'flex', gap:'14px', alignItems:'center'}}>
                    <div style={{width:'48px', height:'48px', borderRadius:'var(--radius-sm)', background:'linear-gradient(135deg,rgba(245,158,11,0.15),rgba(234,179,8,0.15))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', color:'var(--warning)', flexShrink:0}}><i className="fas fa-history"></i></div>
                    <div>
                      <div className="card-title">Past Evaluations</div>
                      <div className="card-subtitle">Browse and revisit all previous analyses</div>
                    </div>
                    <i className="fas fa-chevron-right" style={{marginLeft:'auto', color:'var(--text-muted)'}}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
