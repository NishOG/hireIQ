// ===================================================
// HireIQ — History Page
// ===================================================

Pages.History = {
  render() {
    const evals = getEvaluations();

    return `
      ${renderAppNavbar()}
      <div class="app-layout">
        ${renderSidebar('/history')}
        <div class="main-content">

          <div class="page-header">
            <div>
              <div class="page-title">Past Evaluations</div>
              <div class="page-subtitle">${evals.length} evaluation${evals.length !== 1 ? 's' : ''} saved to your account</div>
            </div>
            <button class="btn btn-primary btn-lg" onclick="navigate('/evaluate')">
              <i class="fas fa-plus"></i> New Evaluation
            </button>
          </div>

          ${evals.length === 0 ? `
            <div class="empty-state" style="margin-top:60px">
              <i class="fas fa-folder-open"></i>
              <h3>No Evaluations Yet</h3>
              <p>Run your first candidate evaluation to see it here</p>
              <button class="btn btn-primary" style="margin-top:20px" onclick="navigate('/evaluate')">
                <i class="fas fa-plus"></i> Start Evaluation
              </button>
            </div>
          ` : `
            <!-- Search + Sort Bar -->
            <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap">
              <div class="input-wrapper" style="flex:1;min-width:200px">
                <i class="fas fa-search input-icon"></i>
                <input type="text" class="form-input" id="history-search"
                  placeholder="Search evaluations..."
                  oninput="filterHistory()"
                  style="padding-left:40px" />
              </div>
              <select class="filter-select" id="history-sort" onchange="filterHistory()" style="width:180px">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="score">Highest Score</option>
                <option value="candidates">Most Candidates</option>
              </select>
            </div>

            <div class="history-grid" id="history-grid">
              ${evals.map(e => renderHistoryCard(e)).join('')}
            </div>
            <div id="history-empty-search" class="hidden empty-state" style="padding:40px">
              <i class="fas fa-search"></i>
              <h3>No matches found</h3>
              <p>Try a different search term</p>
            </div>
          `}
        </div>
      </div>
    `;
  },

  init() {
    updateThemeIcon(document.documentElement.getAttribute('data-theme'));
    window._historyData = getEvaluations();
  }
};

function renderHistoryCard(e) {
  const topCandidate = e.ranked?.[0];
  const hired = (e.ranked || []).filter(r => r.decision === 'Hire').length;
  const rejected = (e.ranked || []).filter(r => r.decision === 'Reject').length;

  return `
    <div class="history-card" onclick="openHistoryEval('${e.id}')">
      <div class="history-card-top">
        <div class="history-card-icon"><i class="fas fa-file-lines"></i></div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          <div class="history-card-date">${formatDate(e.date)}</div>
          ${topCandidate ? `<span class="classification-badge ${getClassBadge(topCandidate.score)}">Top: ${topCandidate.score}/100</span>` : ''}
        </div>
      </div>
      <div class="history-card-title">${e.title || 'Job Evaluation'}</div>
      <div class="history-card-meta">
        ${(e.jdData?.requiredSkills || []).slice(0, 3).join(', ') || 'No skills extracted'}
      </div>
      <div class="history-card-stats">
        <div class="history-stat">
          <div class="history-stat-value">${e.ranked?.length || 0}</div>
          <div class="history-stat-label">Candidates</div>
        </div>
        <div class="history-stat">
          <div class="history-stat-value">${e.stats?.avgScore || 0}</div>
          <div class="history-stat-label">Avg Score</div>
        </div>
        <div class="history-stat">
          <div class="history-stat-value" style="color:var(--success)">${hired}</div>
          <div class="history-stat-label">Hired</div>
        </div>
        <div class="history-stat">
          <div class="history-stat-value" style="color:var(--danger)">${rejected}</div>
          <div class="history-stat-label">Rejected</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
        ${(e.jdData?.requiredSkills || []).slice(0, 4).map(s => `<span class="tag tag-keyword" style="font-size:0.72rem">${s}</span>`).join('')}
      </div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-primary btn-sm" style="flex:1" onclick="event.stopPropagation();openHistoryEval('${e.id}')">
          <i class="fas fa-eye"></i> View Results
        </button>
        <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();exportPDF(getEvaluation('${e.id}'))">
          <i class="fas fa-file-pdf"></i>
        </button>
        <button class="btn btn-secondary btn-sm" style="color:var(--danger)" onclick="event.stopPropagation();deleteEvaluation('${e.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `;
}

function openHistoryEval(id) {
  const evalData = getEvaluation(id);
  if (evalData) {
    AppState.currentEval = evalData;
    navigate('/results');
  } else {
    showToast('Evaluation not found', 'error');
  }
}

function deleteEvaluation(id) {
  if (!confirm('Delete this evaluation? This cannot be undone.')) return;
  try {
    const all = JSON.parse(localStorage.getItem('hireiq_evaluations') || '[]');
    const updated = all.filter(e => e.id !== id);
    localStorage.setItem('hireiq_evaluations', JSON.stringify(updated));
    if (AppState.currentEval?.id === id) AppState.currentEval = null;
    showToast('Evaluation deleted', 'info');
    navigate('/history');
  } catch(e) {
    showToast('Failed to delete evaluation', 'error');
  }
}

function filterHistory() {
  const query = document.getElementById('history-search')?.value?.toLowerCase() || '';
  const sort = document.getElementById('history-sort')?.value || 'newest';

  let data = [...(window._historyData || getEvaluations())];

  // Filter
  if (query) {
    data = data.filter(e =>
      (e.title || '').toLowerCase().includes(query) ||
      (e.jdData?.requiredSkills || []).some(s => s.toLowerCase().includes(query))
    );
  }

  // Sort
  if (sort === 'oldest') data.sort((a, b) => new Date(a.date) - new Date(b.date));
  else if (sort === 'score') data.sort((a, b) => (b.stats?.topScore || 0) - (a.stats?.topScore || 0));
  else if (sort === 'candidates') data.sort((a, b) => (b.ranked?.length || 0) - (a.ranked?.length || 0));
  else data.sort((a, b) => new Date(b.date) - new Date(a.date));

  const grid = document.getElementById('history-grid');
  const emptyEl = document.getElementById('history-empty-search');

  if (!grid) return;

  if (data.length === 0) {
    grid.style.display = 'none';
    emptyEl?.classList.remove('hidden');
  } else {
    grid.style.display = '';
    emptyEl?.classList.add('hidden');
    grid.innerHTML = data.map(e => renderHistoryCard(e)).join('');
  }
}
