import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PublicNavbar } from '../components/Navbar';
import { Auth } from '../auth';
import { showToast } from '../utils';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.getElementById('login-email')?.focus();
  }, []);

  const handleLogin = (e) => {
    e?.preventDefault();
    setErrors({});
    let hasError = false;
    const newErrors = {};

    if (!email) { newErrors.email = 'Email is required'; hasError = true; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { newErrors.email = 'Please enter a valid email'; hasError = true; }
    if (!password) { newErrors.password = 'Password is required'; hasError = true; }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = Auth.login(email, password);
      if (result.ok) {
        showToast(`Welcome back, ${result.user.name}! 👋`, 'success');
        navigate('/dashboard');
      } else {
        setErrors({ login: result.error });
        setLoading(false);
      }
    }, 600);
  };

  const quickDemoLogin = () => {
    setEmail('demo@hireiq.ai');
    setPassword('demo1234');
    setTimeout(() => {
      document.getElementById('login-btn')?.click();
    }, 50);
  };

  return (
    <>
      <PublicNavbar />
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo"><i className="fas fa-brain"></i> HireIQ</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>

          <form id="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <input 
                  type="email" 
                  id="login-email" 
                  className={`form-input ${errors.email ? 'error' : ''}`} 
                  placeholder="you@company.com" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  id="login-password" 
                  className={`form-input ${errors.password ? 'error' : ''}`} 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <span className="input-eye" onClick={() => setShowPassword(!showPassword)}>
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            {errors.login && (
              <div className="form-error" style={{marginBottom:'16px', padding:'10px 14px', background:'var(--danger-bg)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:'var(--radius-xs)'}}>
                {errors.login}
              </div>
            )}

            <button type="submit" className="btn-full" id="login-btn" disabled={loading}>
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Signing in...</> : <span>Sign In</span>}
            </button>
          </form>

          <div className="auth-divider" style={{marginTop:'24px'}}>or</div>

          <div style={{marginTop:'16px'}}>
            <button className="btn-full" style={{background:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text)', boxShadow:'none'}} onClick={quickDemoLogin}>
              <i className="fas fa-play-circle" style={{color:'var(--primary-light)'}}></i>
              Continue with Demo Account
            </button>
          </div>

          <p style={{textAlign:'center', marginTop:'24px', fontSize:'0.875rem', color:'var(--text-secondary)'}}>
            Don't have an account? <Link className="auth-link" to="/signup">Sign up for free</Link>
          </p>

          <div className="info-box" style={{marginTop:'20px'}}>
            <i className="fas fa-info-circle"></i>
            <div>
              <strong>Demo credentials:</strong><br/>
              Email: <code>demo@hireiq.ai</code> &nbsp;|&nbsp; Password: <code>demo1234</code>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
