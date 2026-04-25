import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PublicNavbar } from '../components/Navbar';
import { Auth } from '../auth';
import { showToast } from '../utils';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.getElementById('signup-name')?.focus();
  }, []);

  const handleSignup = (e) => {
    e.preventDefault();
    setErrors({});
    let hasError = false;
    const newErrors = {};

    if (!name || name.length < 2) { newErrors.name = 'Name must be at least 2 characters'; hasError = true; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { newErrors.email = 'Please enter a valid email address'; hasError = true; }
    if (!password || password.length < 6) { newErrors.password = 'Password must be at least 6 characters'; hasError = true; }
    if (password !== confirm) { newErrors.confirm = 'Passwords do not match'; hasError = true; }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = Auth.signup(name, email, password);
      if (result.ok) {
        showToast(`Account created! Welcome to HireIQ, ${name}! 🎉`, 'success', 4000);
        navigate('/dashboard');
      } else {
        setErrors({ signup: result.error });
        setLoading(false);
      }
    }, 700);
  };

  const getPasswordStrength = () => {
    if (!password) return null;
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { label: 'Very Weak', color: '#ef4444', width: '20%' },
      { label: 'Weak', color: '#f97316', width: '40%' },
      { label: 'Fair', color: '#f59e0b', width: '60%' },
      { label: 'Strong', color: '#22c55e', width: '80%' },
      { label: 'Very Strong', color: '#10b981', width: '100%' }
    ];
    return levels[Math.min(score, 4)];
  };

  const strength = getPasswordStrength();

  return (
    <>
      <PublicNavbar />
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo"><i className="fas fa-brain"></i> HireIQ</div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Start evaluating candidates with AI in minutes</p>

          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <i className="fas fa-user input-icon"></i>
                <input type="text" id="signup-name" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Jane Smith" value={name} onChange={e=>setName(e.target.value)} />
              </div>
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} />
              </div>
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input type={showPassword ? 'text' : 'password'} className={`form-input ${errors.password ? 'error' : ''}`} placeholder="Min 6 characters" value={password} onChange={e=>setPassword(e.target.value)} />
                <span className="input-eye" onClick={() => setShowPassword(!showPassword)}>
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
              {strength && (
                <div style={{marginTop:'8px'}}>
                  <div style={{height:'4px', borderRadius:'99px', background:'var(--border)', overflow:'hidden'}}>
                    <div style={{height:'100%', borderRadius:'99px', transition:'width 0.3s, background 0.3s', width: strength.width, background: strength.color}}></div>
                  </div>
                  <div style={{fontSize:'0.75rem', marginTop:'4px', fontWeight:600, color: strength.color}}>{strength.label}</div>
                </div>
              )}
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock-open input-icon"></i>
                <input type={showConfirm ? 'text' : 'password'} className={`form-input ${errors.confirm ? 'error' : ''}`} placeholder="Re-enter your password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
                <span className="input-eye" onClick={() => setShowConfirm(!showConfirm)}>
                  <i className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
              {errors.confirm && <div className="form-error">{errors.confirm}</div>}
            </div>

            {errors.signup && (
              <div className="form-error" style={{marginBottom:'16px', padding:'10px 14px', background:'var(--danger-bg)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:'var(--radius-xs)'}}>
                {errors.signup}
              </div>
            )}

            <button type="submit" className="btn-full" disabled={loading}>
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Creating account...</> : <><i className="fas fa-user-plus"></i> Create Account</>}
            </button>
          </form>

          <p style={{textAlign:'center', marginTop:'24px', fontSize:'0.875rem', color:'var(--text-secondary)'}}>
            Already have an account? <Link className="auth-link" to="/login">Sign in</Link>
          </p>

          <p style={{textAlign:'center', marginTop:'12px', fontSize:'0.75rem', color:'var(--text-muted)'}}>
            By creating an account, you agree to our Terms of Service and Privacy Policy. All data is stored locally in your browser.
          </p>
        </div>
      </div>
    </>
  );
}
