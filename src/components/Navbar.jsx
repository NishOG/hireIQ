import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Auth } from '../auth';
import { toggleTheme } from '../utils';

export function PublicNavbar() {
  const navigate = useNavigate();
  const user = Auth.getCurrentUser();
  const [theme, setTheme] = React.useState(localStorage.getItem('hireiq_theme') || 'dark');

  React.useEffect(() => {
    const onThemeChange = () => setTheme(document.documentElement.getAttribute('data-theme'));
    window.addEventListener('themechange', onThemeChange);
    return () => window.removeEventListener('themechange', onThemeChange);
  }, []);

  return (
    <nav className="navbar">
      <Link className="nav-logo" to="/">
        <i className="fas fa-brain"></i>
        HireIQ
      </Link>
      <div className="nav-links">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
        </button>
        {user ? (
          <button className="nav-btn-ghost" onClick={() => navigate('/dashboard')}>
            <i className="fas fa-th-large"></i> Dashboard
          </button>
        ) : (
          <>
            <button className="nav-link" onClick={() => navigate('/login')}>Login</button>
            <button className="nav-btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
          </>
        )}
      </div>
    </nav>
  );
}

export function AppNavbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const user = Auth.getCurrentUser();
  const [theme, setTheme] = React.useState(localStorage.getItem('hireiq_theme') || 'dark');

  React.useEffect(() => {
    const onThemeChange = () => setTheme(document.documentElement.getAttribute('data-theme'));
    window.addEventListener('themechange', onThemeChange);
    return () => window.removeEventListener('themechange', onThemeChange);
  }, []);

  const handleLogout = () => {
    Auth.logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
        <button className="mobile-menu-btn" onClick={onToggleSidebar}><i className="fas fa-bars"></i></button>
        <Link className="nav-logo" to="/dashboard">
          <i className="fas fa-brain"></i>
          HireIQ
        </Link>
      </div>
      <div className="nav-links">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
        </button>
        <div style={{display:'flex', alignItems:'center', gap:'10px', padding:'6px 14px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)'}}>
          <div style={{width:'30px', height:'30px', borderRadius:'50%', background:'linear-gradient(135deg,var(--primary),var(--accent))', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.8rem', color:'#fff'}}>
            {user?.avatar || user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span style={{fontSize:'0.875rem', fontWeight:600}}>{user?.name || 'User'}</span>
        </div>
        <button className="nav-btn-ghost" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</button>
      </div>
    </nav>
  );
}
