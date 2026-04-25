// ===================================================
// HireIQ — Login Page
// ===================================================

Pages.Login = {
  render() {
    return `
      ${renderPublicNavbar()}
      <div class="auth-page">
        <div class="auth-card">
          <div class="auth-logo"><i class="fas fa-brain"></i> HireIQ</div>
          <h1 class="auth-title">Welcome back</h1>
          <p class="auth-subtitle">Sign in to your account to continue</p>

          <form id="login-form" onsubmit="handleLogin(event)">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-wrapper">
                <i class="fas fa-envelope input-icon"></i>
                <input type="email" id="login-email" class="form-input" placeholder="you@company.com" autocomplete="email" />
              </div>
              <div class="form-error hidden" id="email-error"></div>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-wrapper">
                <i class="fas fa-lock input-icon"></i>
                <input type="password" id="login-password" class="form-input" placeholder="Enter your password" autocomplete="current-password" />
                <span class="input-eye" onclick="togglePasswordVisibility('login-password', this)"><i class="fas fa-eye"></i></span>
              </div>
              <div class="form-error hidden" id="password-error"></div>
            </div>

            <div class="form-error hidden" id="login-error" style="margin-bottom:16px;padding:10px 14px;background:var(--danger-bg);border:1px solid rgba(239,68,68,0.25);border-radius:var(--radius-xs);"></div>

            <button type="submit" class="btn-full" id="login-btn">
              <span>Sign In</span>
            </button>
          </form>

          <div class="auth-divider" style="margin-top:24px">or</div>

          <div style="margin-top:16px">
            <button class="btn-full" style="background:var(--bg-card);border:1px solid var(--border);color:var(--text);box-shadow:none;" onclick="quickDemoLogin()">
              <i class="fas fa-play-circle" style="color:var(--primary-light)"></i>
              Continue with Demo Account
            </button>
          </div>

          <p style="text-align:center;margin-top:24px;font-size:0.875rem;color:var(--text-secondary)">
            Don't have an account?
            <a class="auth-link" href="#/signup">Sign up for free</a>
          </p>

          <div class="info-box" style="margin-top:20px">
            <i class="fas fa-info-circle"></i>
            <div>
              <strong>Demo credentials:</strong><br/>
              Email: <code>demo@hireiq.ai</code> &nbsp;|&nbsp; Password: <code>demo1234</code>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    updateThemeIcon(document.documentElement.getAttribute('data-theme'));
    // Focus email input
    setTimeout(() => document.getElementById('login-email')?.focus(), 100);
  }
};

function handleLogin(e) {
  e.preventDefault();
  clearLoginErrors();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');

  // Validate
  let hasError = false;
  if (!email) { showFieldError('email-error', 'Email is required'); hasError = true; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFieldError('email-error', 'Please enter a valid email'); hasError = true; }
  if (!password) { showFieldError('password-error', 'Password is required'); hasError = true; }
  if (hasError) return;

  // Submit
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';

  setTimeout(() => {
    const result = Auth.login(email, password);
    if (result.ok) {
      showToast(`Welcome back, ${result.user.name}! 👋`, 'success');
      navigate('/dashboard');
    } else {
      const errEl = document.getElementById('login-error');
      errEl.textContent = result.error;
      errEl.classList.remove('hidden');
      btn.disabled = false;
      btn.innerHTML = '<span>Sign In</span>';
    }
  }, 600);
}

function quickDemoLogin() {
  document.getElementById('login-email').value = 'demo@hireiq.ai';
  document.getElementById('login-password').value = 'demo1234';
  handleLogin(new Event('submit'));
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
  const input = el?.previousElementSibling?.querySelector('input') || el?.parentElement?.querySelector('input');
  if (input) input.classList.add('error');
}

function clearLoginErrors() {
  document.querySelectorAll('.form-error').forEach(el => { el.textContent = ''; el.classList.add('hidden'); });
  document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error', 'success'));
}

function togglePasswordVisibility(inputId, eyeEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  eyeEl.innerHTML = isPass ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
}
