import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getEvaluations, AppState } from '../state';
import { Auth } from '../auth';

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const evals = getEvaluations().slice(0, 3);
  const activePath = location.pathname;

  const items = [
    { path: '/dashboard', icon: 'fa-home', label: 'Dashboard' },
    { path: '/evaluate', icon: 'fa-play-circle', label: 'New Evaluation' },
    { path: '/history', icon: 'fa-history', label: 'Past Evaluations' },
  ];

  const handleLogout = () => {
    Auth.logout();
    navigate('/');
  };

  const loadHistoryEval = (e) => {
    AppState.currentEval = e;
    navigate('/results');
    onClose?.();
  };

  return (
    <>
      <div id="sidebar" className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-section">
          <div className="sidebar-label">Main</div>
          {items.map(item => (
            <button key={item.path} className={`sidebar-item ${activePath === item.path ? 'active' : ''}`}
              onClick={() => { navigate(item.path); onClose?.(); }}>
              <i className={`fas ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </div>
        <div className="sidebar-section">
          <div className="sidebar-label">Recent</div>
          {evals.length > 0 ? evals.map(e => (
            <button key={e.id} className="sidebar-item" onClick={() => loadHistoryEval(e)}>
              <i className="fas fa-file-lines"></i>
              <span className="truncate" style={{maxWidth:'140px'}}>{e.title || 'Evaluation'}</span>
            </button>
          )) : <div className="text-muted text-sm" style={{padding:'0 12px'}}>No recent evaluations</div>}
        </div>
        <div className="sidebar-section" style={{marginTop:'auto', paddingTop:'20px', borderTop:'1px solid var(--border)'}}>
          <button className="sidebar-item" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>
      <div className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose}></div>
    </>
  );
}
