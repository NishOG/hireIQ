// ===================================================
// HireIQ — Sign Up Page
// ===================================================

Pages.Signup = {
  render() {
    return `
      ${renderPublicNavbar()}
      <div class="auth-page">
        <div class="auth-card">
          <div class="auth-logo"><i class="fas fa-brain"></i> HireIQ</div>
          <h1 class="auth-title">Create your account</h1>
          <p class="auth-subtitle">Start evaluating candidates with AI in minutes</p>

          <form id="signup-form" onsubmit="handleSignup(event)">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <div class="input-wrapper">
                <i class="fas fa-user input-icon"></i>
                <input type="text" id="signup-name" class="form-input" placeholder="Jane Smith" autocomplete="name" />
              </div>
              <div class="form-error hidden" id="name-error"></div>
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-wrapper">
                <i class="fas fa-envelope input-icon"></i>
                <input type="email" id="signup-email" class="form-input" placeholder="you@company.com" autocomplete="email" />
              </div>
              <div class="form-error hidden" id="signup-email-error"></div>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-wrapper">
                <i class="fas fa-lock input-icon"></i>
                <input type="password" id="signup-password" class="form-input" placeholder="Min 6 characters" autocomplete="new-password" oninput="checkPasswordStrength(this.value)" />
                <span class="input-eye" onclick="togglePasswordVisibility('signup-password', this)"><i class="fas fa-eye"></i></span>
              </div>
              <div id="password-strength" style="margin-top:8px;display:none">
                <div style="height:4px;border-radius:99px;background:var(--border);overflow:hidden">
                  <div id="strength-bar" style="height:100%;border-radius:99px;transition:width 0.3s,background 0.3s"></div>
                </div>
                <div id="strength-label" style="font-size:0.75rem;margin-top:4px;font-weight:600"></div>
              </div>
              <div class="form-error hidden" id="signup-password-error"></div>
            </div>

            <div class="form-group">
              <label class="form-label">Confirm Password</label>
              <div class="input-wrapper">
                <i class="fas fa-lock-open input-icon"></i>
                <input type="password" id="signup-confirm" class="form-input" placeholder="Re-enter your password" autocomplete="new-password" />
                <span class="input-eye" onclick="togglePasswordVisibility('signup-confirm', this)"><i class="fas fa-eye"></i></span>
              </div>
              <div class="form-error hidden" id="confirm-error"></div>
            </div>

            <div class="form-error hidden" id="signup-error" style="margin-bottom:16px;padding:10px 14px;background:var(--danger-bg);border:1px solid rgba(239,68,68,0.25);border-radius:var(--radius-xs);"></div>

            <button type="submit" class="btn-full" id="signup-btn">
              <i class="fas fa-user-plus"></i> Create Account
            </button>
          </form>

          <p style="text-align:center;margin-top:24px;font-size:0.875rem;color:var(--text-secondary)">
            Already have an account?
            <a class="auth-link" href="#/login">Sign in</a>
          </p>

          <p style="text-align:center;margin-top:12px;font-size:0.75rem;color:var(--text-muted)">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
            All data is stored locally in your browser.
          </p>
        </div>
      </div>
    `;
  },

  init() {
    updateThemeIcon(document.documentElement.getAttribute('data-theme'));
    setTimeout(() => document.getElementById('signup-name')?.focus(), 100);
  }
};

function handleSignup(e) {
  e.preventDefault();
  clearSignupErrors();

  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  const btn = document.getElementById('signup-btn');

  let hasError = false;

  if (!name || name.length < 2) { showSignupFieldError('name-error', 'Name must be at least 2 characters'); hasError = true; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showSignupFieldError('signup-email-error', 'Please enter a valid email address'); hasError = true; }
  if (!password || password.length < 6) { showSignupFieldError('signup-password-error', 'Password must be at least 6 characters'); hasError = true; }
  if (password !== confirm) { showSignupFieldError('confirm-error', 'Passwords do not match'); hasError = true; }
  if (hasError) return;

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

  setTimeout(() => {
    const result = Auth.signup(name, email, password);
    if (result.ok) {
      showToast(`Account created! Welcome to HireIQ, ${name}! 🎉`, 'success', 4000);
      navigate('/dashboard');
    } else {
      const errEl = document.getElementById('signup-error');
      errEl.textContent = result.error;
      errEl.classList.remove('hidden');
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
    }
  }, 700);
}

function showSignupFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}

function clearSignupErrors() {
  document.querySelectorAll('.form-error').forEach(el => { el.textContent = ''; el.classList.add('hidden'); });
  document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error', 'success'));
}

function checkPasswordStrength(password) {
  const strengthEl = document.getElementById('password-strength');
  const bar = document.getElementById('strength-bar');
  const label = document.getElementById('strength-label');

  if (!strengthEl) return;
  if (!password) { strengthEl.style.display = 'none'; return; }

  strengthEl.style.display = 'block';

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

  const level = levels[Math.min(score, 4)];
  bar.style.width = level.width;
  bar.style.background = level.color;
  label.textContent = level.label;
  label.style.color = level.color;
}
