// ===================================================
// HireIQ — Dashboard Page
// ===================================================

Pages.Dashboard = {
  render() {
    const user = Auth.getCurrentUser();
    const evals = getEvaluations();
    const path = '/dashboard';

    // Compute stats
    const totalEvals = evals.length;
    const totalCandidates = evals.reduce((sum, e) => sum + (e.ranked?.length || 0), 0);
    const avgScore = totalEvals > 0
      ? Math.round(evals.reduce((sum, e) => sum + (e.stats?.avgScore || 0), 0) / totalEvals)
      : 0;
    const hired = evals.reduce((sum, e) => sum + (e.ranked?.filter(r => r.decision === 'Hire').length || 0), 0);

    return `
      ${renderAppNavbar()}
      <div class="app-layout">
        ${renderSidebar(path)}
        <div class="main-content">
          <!-- Page Header -->
          <div class="page-header">
            <div>
              <div class="page-title">Dashboard</div>
              <div class="page-subtitle">Welcome back, ${user?.name || 'Recruiter'} 👋</div>
            </div>
            <button class="btn btn-primary btn-lg" onclick="navigate('/evaluate')">
              <i class="fas fa-plus"></i>
              New Evaluation
            </button>
          </div>

          <!-- Stats Cards -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-card-top">
                <div class="stat-card-icon" style="background:rgba(99,102,241,0.12);color:var(--primary-light)"><i class="fas fa-file-lines"></i></div>
                <div class="stat-card-badge" style="background:rgba(99,102,241,0.1);color:var(--primary-light)">Total</div>
              </div>
              <div class="stat-value">${totalEvals}</div>
              <div class="stat-label">Evaluations Run</div>
            </div>
            <div class="stat-card">
              <div class="stat-card-top">
                <div class="stat-card-icon" style="background:rgba(168,85,247,0.12);color:var(--accent)"><i class="fas fa-users"></i></div>
                <div class="stat-card-badge" style="background:rgba(168,85,247,0.1);color:var(--accent)">All Time</div>
              </div>
              <div class="stat-value">${totalCandidates}</div>
              <div class="stat-label">Candidates Processed</div>
            </div>
            <div class="stat-card">
              <div class="stat-card-top">
                <div class="stat-card-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-chart-line"></i></div>
                <div class="stat-card-badge" style="background:rgba(34,197,94,0.1);color:var(--success)">Avg</div>
              </div>
              <div class="stat-value">${avgScore}<span style="font-size:1rem;color:var(--text-muted)">/100</span></div>
              <div class="stat-label">Average Score</div>
            </div>
            <div class="stat-card">
              <div class="stat-card-top">
                <div class="stat-card-icon" style="background:rgba(245,158,11,0.12);color:var(--warning)"><i class="fas fa-user-check"></i></div>
                <div class="stat-card-badge" style="background:rgba(245,158,11,0.1);color:var(--warning)">Hired</div>
              </div>
              <div class="stat-value">${hired}</div>
              <div class="stat-label">Candidates Hired</div>
            </div>
          </div>

          <!-- Charts + Recent -->
          <div class="dash-charts-grid">
            <div class="chart-card">
              <div class="chart-card-header">
                <div>
                  <div class="chart-card-title">Score Distribution</div>
                  <div class="chart-card-sub">Across all evaluations</div>
                </div>
              </div>
              <div style="height:260px;position:relative">
                <canvas id="dash-score-chart"></canvas>
              </div>
            </div>
            <div class="chart-card">
              <div class="chart-card-header">
                <div>
                  <div class="chart-card-title">Candidate Classifications</div>
                  <div class="chart-card-sub">Strong / Moderate / Weak Fit</div>
                </div>
              </div>
              <div style="height:260px;position:relative">
                <canvas id="dash-class-chart"></canvas>
              </div>
            </div>
          </div>

          <!-- Recent Evaluations + Quick Actions -->
          <div class="grid-2" style="align-items:start">
            <div>
              <div class="section-header">
                <div class="section-header-left">
                  <h3>Recent Evaluations</h3>
                  <p>Your latest hiring analyses</p>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="navigate('/history')">View All</button>
              </div>
              <div class="activity-list">
                ${evals.length === 0 ? `
                  <div class="empty-state">
                    <i class="fas fa-file-circle-plus"></i>
                    <h3>No evaluations yet</h3>
                    <p>Start your first evaluation to see results here</p>
                    <button class="btn btn-primary" style="margin-top:16px" onclick="navigate('/evaluate')"><i class="fas fa-plus"></i> Start Evaluation</button>
                  </div>
                ` : evals.slice(0, 5).map(e => `
                  <div class="activity-item" style="cursor:pointer" onclick="loadHistoryEval('${e.id}')">
                    <div class="activity-icon"><i class="fas fa-file-lines"></i></div>
                    <div class="activity-info">
                      <div class="activity-title">${e.title || 'Job Evaluation'}</div>
                      <div class="activity-meta">${e.ranked?.length || 0} candidates · Top Score: ${e.stats?.topScore || 0}/100</div>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
                      <div class="activity-time">${formatDate(e.date)}</div>
                      <div class="classification-badge ${getClassBadge(e.stats?.topScore || 0)}">${getClassLabel(e.stats?.topScore || 0)}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div>
              <div class="section-header">
                <div class="section-header-left">
                  <h3>Quick Actions</h3>
                  <p>Jump right in</p>
                </div>
              </div>
              <div style="display:flex;flex-direction:column;gap:12px">
                <div class="card" style="cursor:pointer;transition:var(--transition)" onmouseenter="this.style.borderColor='var(--primary)'" onmouseleave="this.style.borderColor='var(--border)'" onclick="navigate('/evaluate')">
                  <div style="display:flex;gap:14px;align-items:center">
                    <div style="width:48px;height:48px;border-radius:var(--radius-sm);background:linear-gradient(135deg,rgba(99,102,241,0.2),rgba(168,85,247,0.2));display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:var(--primary-light);flex-shrink:0"><i class="fas fa-plus-circle"></i></div>
                    <div>
                      <div class="card-title">New Evaluation</div>
                      <div class="card-subtitle">Start analyzing candidates for a new role</div>
                    </div>
                    <i class="fas fa-chevron-right" style="margin-left:auto;color:var(--text-muted)"></i>
                  </div>
                </div>
                <div class="card" style="cursor:pointer;transition:var(--transition)" onmouseenter="this.style.borderColor='var(--primary)'" onmouseleave="this.style.borderColor='var(--border)'" onclick="loadDemoResults()">
                  <div style="display:flex;gap:14px;align-items:center">
                    <div style="width:48px;height:48px;border-radius:var(--radius-sm);background:linear-gradient(135deg,rgba(34,197,94,0.15),rgba(16,185,129,0.15));display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:var(--success);flex-shrink:0"><i class="fas fa-eye"></i></div>
                    <div>
                      <div class="card-title">View Demo Results</div>
                      <div class="card-subtitle">See 8 pre-analyzed candidates with full AI insights</div>
                    </div>
                    <i class="fas fa-chevron-right" style="margin-left:auto;color:var(--text-muted)"></i>
                  </div>
                </div>
                <div class="card" style="cursor:pointer;transition:var(--transition)" onmouseenter="this.style.borderColor='var(--primary)'" onmouseleave="this.style.borderColor='var(--border)'" onclick="navigate('/history')">
                  <div style="display:flex;gap:14px;align-items:center">
                    <div style="width:48px;height:48px;border-radius:var(--radius-sm);background:linear-gradient(135deg,rgba(245,158,11,0.15),rgba(234,179,8,0.15));display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:var(--warning);flex-shrink:0"><i class="fas fa-history"></i></div>
                    <div>
                      <div class="card-title">Past Evaluations</div>
                      <div class="card-subtitle">Browse and revisit all previous analyses</div>
                    </div>
                    <i class="fas fa-chevron-right" style="margin-left:auto;color:var(--text-muted)"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  init() {
    updateThemeIcon(document.documentElement.getAttribute('data-theme'));
    setTimeout(() => initDashboardCharts(), 200);
  }
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff/86400000)}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch { return ''; }
}

function getClassBadge(score) {
  if (score >= 70) return 'badge-strong';
  if (score >= 45) return 'badge-moderate';
  return 'badge-weak';
}

function getClassLabel(score) {
  if (score >= 70) return 'Strong';
  if (score >= 45) return 'Moderate';
  return 'Weak';
}

function loadDemoResults() {
  const evals = getEvaluations();
  const demo = evals.find(e => e.id === 'demo_eval_001') || evals[0];
  if (demo) {
    AppState.currentEval = demo;
    navigate('/results');
  } else {
    showToast('No demo data found', 'warning');
  }
}

function initDashboardCharts() {
  const evals = getEvaluations();
  const allCandidates = evals.flatMap(e => e.ranked || []);

  // Score distribution chart
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

    new Chart(scoreCtx, {
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

  // Classification pie chart
  const classCtx = document.getElementById('dash-class-chart');
  if (classCtx) {
    const strong = allCandidates.filter(c => c.classification === 'Strong Fit').length;
    const moderate = allCandidates.filter(c => c.classification === 'Moderate Fit').length;
    const weak = allCandidates.filter(c => c.classification === 'Weak Fit' || !c.classification).length;

    new Chart(classCtx, {
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
}
