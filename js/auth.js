// ===================================================
// HireIQ — Authentication System
// localStorage-based user management
// ===================================================

export const Auth = (() => {
  const USERS_KEY = 'hireiq_users';
  const SESSION_KEY = 'hireiq_session';

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
  }

  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function isLoggedIn() {
    return !!getSession();
  }

  function getCurrentUser() {
    return getSession();
  }

  function signup(name, email, password) {
    if (!name || name.trim().length < 2) return { ok: false, error: 'Name must be at least 2 characters' };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Please enter a valid email address' };
    if (!password || password.length < 6) return { ok: false, error: 'Password must be at least 6 characters' };

    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists' };
    }

    const user = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: btoa(password), // simple encoding (not production-grade)
      createdAt: new Date().toISOString(),
      avatar: name.trim()[0].toUpperCase()
    };

    users.push(user);
    saveUsers(users);
    setSession({ id: user.id, name: user.name, email: user.email, avatar: user.avatar });
    return { ok: true, user };
  }

  function login(email, password) {
    if (!email) return { ok: false, error: 'Please enter your email' };
    if (!password) return { ok: false, error: 'Please enter your password' };

    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user) return { ok: false, error: 'No account found with this email' };
    if (user.password !== btoa(password)) return { ok: false, error: 'Incorrect password' };

    setSession({ id: user.id, name: user.name, email: user.email, avatar: user.avatar });
    return { ok: true, user };
  }

  function logout() {
    clearSession();
  }

  // Ensure demo account exists
  function initDemoAccount() {
    const users = getUsers();
    if (!users.find(u => u.email === 'demo@hireiq.ai')) {
      users.push({
        id: 'user_demo',
        name: 'Demo Recruiter',
        email: 'demo@hireiq.ai',
        password: btoa('demo1234'),
        createdAt: new Date().toISOString(),
        avatar: 'D'
      });
      saveUsers(users);
    }
  }

  initDemoAccount();

  return { signup, login, logout, isLoggedIn, getCurrentUser, getSession };
})();
