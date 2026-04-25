import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { getEvaluations, AppState } from '../state';
import { formatDate } from '../utils';

export default function History() {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [evals, setEvals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    setEvals(getEvaluations());
  }, []);

  const openHistoryEval = (id) => {
    const evalData = getEvaluations().find(e => e.id === id);
    if (evalData) {
      AppState.currentEval = evalData;
      navigate('/results');
    }
  };

  const deleteEvaluation = (id) => {
    if (!window.confirm('Delete this evaluation? This cannot be undone.')) return;
    try {
      const all = getEvaluations();
      const updated = all.filter(e => e.id !== id);
      localStorage.setItem('hireiq_evaluations', JSON.stringify(updated));
      if (AppState.currentEval?.id === id) AppState.currentEval = null;
      setEvals(updated);
    } catch(e) {
      console.error(e);
    }
  };

  const getClassBadge = (score) => {
    if (score >= 70) return 'badge-strong';
    if (score >= 45) return 'badge-moderate';
    return 'badge-weak';
  };

  let filtered = [...evals];
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(e => 
      (e.title || '').toLowerCase().includes(q) ||
      (e.jdData?.requiredSkills || []).some(s => s.toLowerCase().includes(q))
    );
  }

  if (sortOrder === 'oldest') filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  else if (sortOrder === 'score') filtered.sort((a, b) => (b.stats?.topScore || 0) - (a.stats?.topScore || 0));
  else if (sortOrder === 'candidates') filtered.sort((a, b) => (b.ranked?.length || 0) - (a.ranked?.length || 0));
  else filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <AppNavbar onToggleSidebar={() => setSidebarOpen(true)} />
      <div className="app-layout">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-content">
          <div className="page-header">
            <div>
              <div className="page-title">Past Evaluations</div>
              <div className="page-subtitle">{evals.length} evaluation{evals.length !== 1 ? 's' : ''} saved to your account</div>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/evaluate')}>
              <i className="fas fa-plus"></i> New Evaluation
            </button>
          </div>

          {evals.length === 0 ? (
            <div className="empty-state" style={{marginTop:'60px'}}>
              <i className="fas fa-folder-open"></i>
              <h3>No Evaluations Yet</h3>
              <p>Run your first candidate evaluation to see it here</p>
              <button className="btn btn-primary" style={{marginTop:'20px'}} onClick={() => navigate('/evaluate')}>
                <i className="fas fa-plus"></i> Start Evaluation
              </button>
            </div>
          ) : (
            <>
              <div style={{display:'flex', gap:'12px', marginBottom:'24px', flexWrap:'wrap'}}>
                <div className="input-wrapper" style={{flex:1, minWidth:'200px'}}>
                  <i className="fas fa-search input-icon"></i>
                  <input type="text" className="form-input" 
                    placeholder="Search evaluations..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{paddingLeft:'40px'}} />
                </div>
                <select className="filter-select" value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{width:'180px'}}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="score">Highest Score</option>
                  <option value="candidates">Most Candidates</option>
                </select>
              </div>

              {filtered.length === 0 ? (
                <div className="empty-state" style={{padding:'40px'}}>
                  <i className="fas fa-search"></i>
                  <h3>No matches found</h3>
                  <p>Try a different search term</p>
                </div>
              ) : (
                <div className="history-grid">
                  {filtered.map(e => {
                    const topCandidate = e.ranked?.[0];
                    const hired = (e.ranked || []).filter(r => r.decision === 'Hire').length;
                    const rejected = (e.ranked || []).filter(r => r.decision === 'Reject').length;
                    
                    return (
                      <div key={e.id} className="history-card" onClick={() => openHistoryEval(e.id)}>
                        <div className="history-card-top">
                          <div className="history-card-icon"><i className="fas fa-file-lines"></i></div>
                          <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'4px'}}>
                            <div className="history-card-date">{formatDate(e.date)}</div>
                            {topCandidate && <span className={`classification-badge ${getClassBadge(topCandidate.score)}`}>Top: {topCandidate.score}/100</span>}
                          </div>
                        </div>
                        <div className="history-card-title">{e.title || 'Job Evaluation'}</div>
                        <div className="history-card-meta">
                          {(e.jdData?.requiredSkills || []).slice(0, 3).join(', ') || 'No skills extracted'}
                        </div>
                        <div className="history-card-stats">
                          <div className="history-stat">
                            <div className="history-stat-value">{e.ranked?.length || 0}</div>
                            <div className="history-stat-label">Candidates</div>
                          </div>
                          <div className="history-stat">
                            <div className="history-stat-value">{e.stats?.avgScore || 0}</div>
                            <div className="history-stat-label">Avg Score</div>
                          </div>
                          <div className="history-stat">
                            <div className="history-stat-value" style={{color:'var(--success)'}}>{hired}</div>
                            <div className="history-stat-label">Hired</div>
                          </div>
                          <div className="history-stat">
                            <div className="history-stat-value" style={{color:'var(--danger)'}}>{rejected}</div>
                            <div className="history-stat-label">Rejected</div>
                          </div>
                        </div>
                        <div style={{display:'flex', gap:'8px', marginTop:'14px', flexWrap:'wrap'}}>
                          {(e.jdData?.requiredSkills || []).slice(0, 4).map(s => <span key={s} className="tag tag-keyword" style={{fontSize:'0.72rem'}}>{s}</span>)}
                        </div>
                        <div style={{display:'flex', gap:'8px', marginTop:'12px'}}>
                          <button className="btn btn-primary btn-sm" style={{flex:1}} onClick={(ev) => { ev.stopPropagation(); openHistoryEval(e.id); }}>
                            <i className="fas fa-eye"></i> View Results
                          </button>
                          <button className="btn btn-secondary btn-sm" style={{color:'var(--danger)'}} onClick={(ev) => { ev.stopPropagation(); deleteEvaluation(e.id); }}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
