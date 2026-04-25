// ===================================================
// HireIQ — Results Page
// Full featured results with all 8 sub-sections
// ===================================================

Pages.Results = {
  render() {
    const evalData = AppState.currentEval;

    if (!evalData) {
      return `
        ${renderAppNavbar()}
        <div class="app-layout">
          ${renderSidebar('/results')}
          <div class="main-content">
            <div class="empty-state" style="margin-top:60px">
              <i class="fas fa-chart-bar"></i>
              <h3>No Evaluation Results</h3>
              <p>Run an evaluation to see candidate rankings and insights here</p>
              <button class="btn btn-primary" style="margin-top:20px" onclick="navigate('/evaluate')">
                <i class="fas fa-plus"></i> Start New Evaluation
              </button>
            </div>
          </div>
        </div>
      `;
    }

    const s = evalData.stats || {};
    const ranked = evalData.ranked || [];

    return `
      ${renderAppNavbar()}
      <div class="app-layout">
        ${renderSidebar('/results')}
        <div class="main-content">

          <!-- Page Header -->
          <div class="page-header">
            <div>
              <div class="page-title">${evalData.title || 'Evaluation Results'}</div>
              <div class="page-subtitle">
                ${ranked.length} candidates · ${formatDate(evalData.date)} ·
                Avg Score: <strong>${s.avgScore || 0}/100</strong>
              </div>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn btn-secondary" onclick="navigate('/evaluate')">
                <i class="fas fa-plus"></i> New Evaluation
              </button>
              <button class="btn btn-primary" onclick="exportPDF(AppState.currentEval)">
                <i class="fas fa-file-pdf"></i> Export PDF
              </button>
            </div>
          </div>

          <!-- Results Tabs -->
          <div class="results-tabs">
            <button class="results-tab active" id="tab-overview" onclick="switchTab('overview')">
              <i class="fas fa-chart-pie"></i> Overview
            </button>
            <button class="results-tab" id="tab-rankings" onclick="switchTab('rankings')">
              <i class="fas fa-ranking-star"></i> Rankings
            </button>
            <button class="results-tab" id="tab-compare" onclick="switchTab('compare')">
              <i class="fas fa-code-compare"></i> Compare
            </button>
            <button class="results-tab" id="tab-clusters" onclick="switchTab('clusters')">
              <i class="fas fa-object-group"></i> Clusters
            </button>
          </div>

          <!-- TAB: Overview -->
          <div id="tab-overview-panel" class="animate-fadeIn">

            <!-- Summary Metric Cards -->
            <div class="summary-metric-cards">
              <div class="stat-card">
                <div class="stat-card-top">
                  <div class="stat-card-icon" style="background:rgba(99,102,241,0.12);color:var(--primary-light)"><i class="fas fa-users"></i></div>
                </div>
                <div class="stat-value">${s.total || ranked.length}</div>
                <div class="stat-label">Total Candidates</div>
              </div>
              <div class="stat-card">
                <div class="stat-card-top">
                  <div class="stat-card-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-trophy"></i></div>
                </div>
                <div class="stat-value">${s.topScore || 0}<span style="font-size:1rem;color:var(--text-muted)">/100</span></div>
                <div class="stat-label">Top Score</div>
              </div>
              <div class="stat-card">
                <div class="stat-card-top">
                  <div class="stat-card-icon" style="background:rgba(59,130,246,0.12);color:var(--info)"><i class="fas fa-chart-line"></i></div>
                </div>
                <div class="stat-value">${s.avgScore || 0}<span style="font-size:1rem;color:var(--text-muted)">/100</span></div>
                <div class="stat-label">Average Score</div>
              </div>
              <div class="stat-card">
                <div class="stat-card-top">
                  <div class="stat-card-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-star"></i></div>
                </div>
                <div class="stat-value">${s.strongFit || 0}</div>
                <div class="stat-label">Strong Fit Candidates</div>
              </div>
            </div>

            <!-- Charts -->
            <div class="dash-charts-grid">
              <div class="chart-card">
                <div class="chart-card-header">
                  <div>
                    <div class="chart-card-title">Score Distribution</div>
                    <div class="chart-card-sub">All ${ranked.length} candidates</div>
                  </div>
                </div>
                <div style="height:280px;position:relative">
                  <canvas id="results-score-chart"></canvas>
                </div>
              </div>
              <div class="chart-card">
                <div class="chart-card-header">
                  <div>
                    <div class="chart-card-title">Candidate Classifications</div>
                    <div class="chart-card-sub">By fit level</div>
                  </div>
                </div>
                <div style="height:280px;position:relative">
                  <canvas id="results-class-chart"></canvas>
                </div>
              </div>
            </div>

            <!-- Top Candidates Highlight -->
            <div class="section-header">
              <div class="section-header-left">
                <h3>🏆 Top Candidates Spotlight</h3>
                <p>Highest scoring candidates from this evaluation</p>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="switchTab('rankings')">View All Rankings</button>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
              ${ranked.slice(0, 4).filter(r => r.score > 0).map((r, i) => renderTopCandidateCard(r, i)).join('')}
            </div>

            <!-- JD Summary -->
            <div class="spacer"></div>
            <div class="card">
              <div class="section-header-left" style="margin-bottom:16px">
                <h3>Job Description Summary</h3>
                <p>Extracted requirements used for this evaluation</p>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
                <div>
                  <div class="jd-section-label" style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);margin-bottom:8px">Required Skills</div>
                  <div class="tags-row">${(evalData.jdData?.requiredSkills || []).map(s => `<span class="tag tag-required">${s}</span>`).join('')}</div>
                </div>
                <div>
                  <div class="jd-section-label" style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);margin-bottom:8px">Optional Skills</div>
                  <div class="tags-row">${(evalData.jdData?.optionalSkills || []).map(s => `<span class="tag tag-optional">${s}</span>`).join('')}</div>
                </div>
              </div>
            </div>

            <!-- Comparative Insights -->
            ${evalData.comparisons?.length > 0 ? `
              <div class="spacer"></div>
              <div class="card">
                <div class="section-header-left" style="margin-bottom:16px">
                  <h3>🔍 Comparative Insights</h3>
                  <p>Why top candidates are ranked the way they are</p>
                </div>
                ${evalData.comparisons.map(c => `
                  <div class="ai-reason-box" style="margin-bottom:10px">
                    <strong>${c.candidateA} vs ${c.candidateB}:</strong> ${c.explanation}
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- TAB: Rankings -->
          <div id="tab-rankings-panel" class="hidden animate-fadeIn">

            <!-- Hire/Reject Summary Bar -->
            <div class="hire-reject-summary" id="hr-summary">
              ${renderHireRejectSummary(ranked)}
            </div>

            <!-- Filter Bar -->
            <div class="filter-bar">
              <div class="filter-group">
                <div class="filter-label">Score Range</div>
                <div class="filter-range">
                  <span id="score-min-label">0</span>
                  <input type="range" id="score-min" min="0" max="100" value="0" oninput="onFilterChange()">
                  —
                  <input type="range" id="score-max" min="0" max="100" value="100" oninput="onFilterChange()">
                  <span id="score-max-label">100</span>
                </div>
              </div>
              <div class="filter-group">
                <div class="filter-label">Classification</div>
                <div class="filter-checks">
                  <label class="filter-check" id="check-strong" onclick="toggleFilterCheck(this, 'strong')">
                    <input type="checkbox" checked /> Strong Fit
                  </label>
                  <label class="filter-check" id="check-moderate" onclick="toggleFilterCheck(this, 'moderate')">
                    <input type="checkbox" checked /> Moderate Fit
                  </label>
                  <label class="filter-check" id="check-weak" onclick="toggleFilterCheck(this, 'weak')">
                    <input type="checkbox" checked /> Weak Fit
                  </label>
                </div>
              </div>
              <div class="filter-group">
                <div class="filter-label">Decision</div>
                <select class="filter-select" id="decision-filter" onchange="onFilterChange()">
                  <option value="all">All</option>
                  <option value="Hire">Hired</option>
                  <option value="Reject">Rejected</option>
                  <option value="None">Pending</option>
                </select>
              </div>
              <div style="margin-left:auto">
                <button class="btn btn-secondary btn-sm" onclick="resetFilters()"><i class="fas fa-rotate"></i> Reset</button>
              </div>
            </div>

            <!-- Rankings Table -->
            <div class="rank-table" id="rank-table">
              <div class="rank-table-header">
                <div>Rank</div>
                <div>Candidate</div>
                <div>Score</div>
                <div>Classification</div>
                <div>Confidence</div>
                <div>Cluster</div>
                <div>Actions</div>
              </div>
              <div id="ranked-rows">
                ${ranked.map(r => renderRankRow(r)).join('')}
              </div>
            </div>
            <div id="no-results" class="hidden empty-state" style="padding:40px">
              <i class="fas fa-filter"></i>
              <h3>No candidates match these filters</h3>
              <p>Try adjusting the score range or classification filters</p>
            </div>
          </div>

          <!-- TAB: Compare -->
          <div id="tab-compare-panel" class="hidden animate-fadeIn">
            <div class="card" style="margin-bottom:20px">
              <h3 style="margin-bottom:6px">Select Candidates to Compare</h3>
              <p class="text-secondary text-sm" style="margin-bottom:20px">Select 2-3 candidates for a detailed side-by-side comparison</p>
              <div class="compare-select" id="compare-select">
                ${ranked.filter(r => !r.candidate?.isInvalid).slice(0, 8).map(r => `
                  <div class="compare-select-item" id="cmp-${r.rank}" onclick="toggleCompareSelect(this, '${r.name}')">
                    #${r.rank} ${r.name}
                  </div>
                `).join('')}
              </div>
              <button class="btn btn-primary" style="margin-top:16px" onclick="renderComparison()">
                <i class="fas fa-code-compare"></i> Compare Selected
              </button>
            </div>
            <div id="comparison-result"></div>
          </div>

          <!-- TAB: Clusters -->
          <div id="tab-clusters-panel" class="hidden animate-fadeIn">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
              <div>
                <h3 style="font-size:1rem;font-weight:700">Candidate Clusters</h3>
                <p class="text-secondary text-sm">Candidates grouped by fit level and specialty</p>
              </div>
              <div class="view-toggle">
                <button class="view-toggle-btn active" id="vt-cluster" onclick="setClusterView('cluster')"><i class="fas fa-object-group"></i> By Fit</button>
                <button class="view-toggle-btn" id="vt-specialty" onclick="setClusterView('specialty')"><i class="fas fa-layer-group"></i> By Specialty</button>
              </div>
            </div>
            <div id="cluster-content">
              ${renderClusterView(ranked)}
            </div>
          </div>

        </div>
      </div>
    `;
  },

  init() {
    updateThemeIcon(document.documentElement.getAttribute('data-theme'));
    // Init filter state
    window._filterState = { strong: true, moderate: true, weak: true };
    setTimeout(() => initResultCharts(), 200);
  }
};

// ---- Tab Switching ----
function switchTab(tab) {
  const tabs = ['overview', 'rankings', 'compare', 'clusters'];
  tabs.forEach(t => {
    document.getElementById(`tab-${t}`)?.classList.toggle('active', t === tab);
    const panel = document.getElementById(`tab-${t}-panel`);
    if (panel) {
      panel.classList.toggle('hidden', t !== tab);
      if (t === tab) panel.classList.add('animate-fadeIn');
    }
  });
}

// ---- Top Candidate Card ----
function renderTopCandidateCard(r, idx) {
  const medals = ['🥇', '🥈', '🥉', ''];
  const colors = ['var(--gold)', 'var(--silver)', 'var(--bronze)', 'var(--primary-light)'];
  const bgColors = ['rgba(245,158,11,0.1)', 'rgba(148,163,184,0.1)', 'rgba(180,83,9,0.1)', 'rgba(99,102,241,0.1)'];

  return `
    <div class="card" style="cursor:pointer;border-left:3px solid ${colors[idx]};background:${bgColors[idx]};transition:var(--transition)"
      onmouseenter="this.style.transform='translateY(-2px)'" onmouseleave="this.style.transform='translateY(0)'"
      onclick="openCandidateModal('${r.name}')">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <div style="font-size:1.5rem">${medals[idx] || `#${r.rank}`}</div>
        <div>
          <div style="font-weight:800;font-size:0.95rem">${r.name}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">${r.cluster || r.classification}</div>
        </div>
        <div style="margin-left:auto;font-size:1.4rem;font-weight:900;color:${colors[idx]}">${r.score}</div>
      </div>
      <div class="score-bar">
        <div class="score-bar-fill" style="width:${r.score}%;background:${colors[idx]}"></div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
        ${(r.skillMatch?.exactMatches || []).slice(0, 3).map(s => `<span class="tag tag-match" style="font-size:0.7rem">${s}</span>`).join('')}
      </div>
    </div>
  `;
}

// ---- Rank Row Rendering ----
function renderRankRow(r) {
  const medalColors = { 1: 'gold', 2: 'silver', 3: 'bronze' };
  const scoreColor = r.score >= 70 ? 'var(--success)' : r.score >= 45 ? 'var(--warning)' : 'var(--danger)';
  const rowClass = r.decision === 'Hire' ? 'hired' : r.decision === 'Reject' ? 'rejected' : '';

  return `
    <div class="rank-row ${rowClass}" id="row-${r.rank}" data-score="${r.score}" data-class="${r.classification}" data-decision="${r.decision || 'None'}">
      <div class="rank-num ${medalColors[r.rank] || ''}">${r.rank <= 3 ? ['🥇','🥈','🥉'][r.rank-1] : `#${r.rank}`}</div>
      <div class="rank-candidate" onclick="openCandidateModal('${r.name}')" style="cursor:pointer">
        <div class="rank-candidate-avatar">${r.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}</div>
        <div>
          <div class="rank-candidate-name">${r.name} ${r.candidate?.isInvalid ? '<span class="classification-badge badge-weak">Invalid</span>' : ''}</div>
          <div class="rank-candidate-cluster">${r.cluster || r.classification}</div>
        </div>
      </div>
      <div class="score-bar-cell">
        <div class="score-bar-wrap">
          <span class="score-bar-num" style="color:${scoreColor}">${r.score}</span>
          <div class="score-bar">
            <div class="score-bar-fill" style="width:${r.score}%;background:${scoreColor}"></div>
          </div>
        </div>
      </div>
      <div>
        <span class="classification-badge ${r.classification === 'Strong Fit' ? 'badge-strong' : r.classification === 'Moderate Fit' ? 'badge-moderate' : 'badge-weak'}">
          ${r.classification === 'Strong Fit' ? '●' : r.classification === 'Moderate Fit' ? '◐' : '○'}
          ${r.classification}
        </span>
      </div>
      <div class="confidence-cell">${Math.round(r.confidence * 100)}%</div>
      <div><span class="tag tag-keyword" style="font-size:0.75rem">${r.cluster || '—'}</span></div>
      <div class="hire-reject-btns">
        <button class="btn-hire ${r.decision === 'Hire' ? 'active' : ''}" onclick="setDecision('${r.name}', 'Hire', event)">
          ${r.decision === 'Hire' ? '✓ Hired' : 'Hire'}
        </button>
        <button class="btn-reject ${r.decision === 'Reject' ? 'active' : ''}" onclick="setDecision('${r.name}', 'Reject', event)">
          ${r.decision === 'Reject' ? '✗ Rejected' : 'Reject'}
        </button>
      </div>
    </div>
  `;
}

// ---- Hire/Reject Actions ----
function setDecision(candidateName, decision, event) {
  event.stopPropagation();
  const evalData = AppState.currentEval;
  if (!evalData) return;

  const candidate = evalData.ranked.find(r => r.name === candidateName);
  if (!candidate) return;

  // Toggle
  candidate.decision = candidate.decision === decision ? 'None' : decision;
  updateDecision(evalData.id, candidateName, candidate.decision);

  // Re-render row
  const row = document.getElementById(`row-${candidate.rank}`);
  if (row) {
    row.outerHTML = renderRankRow(candidate);
    // Reattach since DOM changed
  }

  // Update summary
  const summaryEl = document.getElementById('hr-summary');
  if (summaryEl) summaryEl.innerHTML = renderHireRejectSummary(evalData.ranked);

  const decision_label = candidate.decision === 'None' ? 'cleared' : candidate.decision === 'Hire' ? 'marked as Hired' : 'marked as Rejected';
  showToast(`${candidateName} ${decision_label}`, 'success', 2000);
}

function renderHireRejectSummary(ranked) {
  const hired = ranked.filter(r => r.decision === 'Hire').length;
  const rejected = ranked.filter(r => r.decision === 'Reject').length;
  const pending = ranked.filter(r => !r.decision || r.decision === 'None').length;
  return `
    <div class="hrs-item"><span style="color:var(--success)"><i class="fas fa-check-circle"></i></span> <span class="hrs-count" style="color:var(--success)">${hired}</span> Hired</div>
    <div class="hrs-item"><span style="color:var(--danger)"><i class="fas fa-times-circle"></i></span> <span class="hrs-count" style="color:var(--danger)">${rejected}</span> Rejected</div>
    <div class="hrs-item"><span style="color:var(--text-muted)"><i class="fas fa-clock"></i></span> <span class="hrs-count" style="color:var(--text-muted)">${pending}</span> Pending</div>
    <div class="hrs-item" style="margin-left:auto;font-size:0.8rem;color:var(--text-muted)">
      <i class="fas fa-shield-halved" style="color:var(--success)"></i> Bias-Free Evaluation
    </div>
  `;
}

// ---- Filters ----
function toggleFilterCheck(el, type) {
  if (!window._filterState) window._filterState = { strong: true, moderate: true, weak: true };
  window._filterState[type] = !window._filterState[type];
  el.classList.toggle(`selected-${type}`, window._filterState[type]);
  onFilterChange();
}

function onFilterChange() {
  const minEl = document.getElementById('score-min');
  const maxEl = document.getElementById('score-max');
  const decisionFilter = document.getElementById('decision-filter')?.value || 'all';

  if (!minEl || !maxEl) return;

  const min = parseInt(minEl.value);
  const max = parseInt(maxEl.value);
  document.getElementById('score-min-label').textContent = min;
  document.getElementById('score-max-label').textContent = max;

  const fs = window._filterState || { strong: true, moderate: true, weak: true };

  const rows = document.querySelectorAll('.rank-row');
  let visible = 0;

  rows.forEach(row => {
    const score = parseInt(row.dataset.score || 0);
    const cls = row.dataset.class || '';
    const decision = row.dataset.decision || 'None';

    const passScore = score >= min && score <= max;
    const passClass = (cls === 'Strong Fit' && fs.strong) ||
                      (cls === 'Moderate Fit' && fs.moderate) ||
                      (cls !== 'Strong Fit' && cls !== 'Moderate Fit' && fs.weak);
    const passDecision = decisionFilter === 'all' || decision === decisionFilter;

    const show = passScore && passClass && passDecision;
    row.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  const noResults = document.getElementById('no-results');
  const rankTable = document.getElementById('rank-table');
  if (noResults && rankTable) {
    noResults.classList.toggle('hidden', visible > 0);
    rankTable.style.display = visible === 0 ? 'none' : '';
  }
}

function resetFilters() {
  const minEl = document.getElementById('score-min');
  const maxEl = document.getElementById('score-max');
  if (minEl) minEl.value = 0;
  if (maxEl) maxEl.value = 100;
  document.getElementById('score-min-label').textContent = '0';
  document.getElementById('score-max-label').textContent = '100';

  window._filterState = { strong: true, moderate: true, weak: true };
  ['strong', 'moderate', 'weak'].forEach(t => {
    const el = document.getElementById(`check-${t}`);
    if (el) el.className = `filter-check`;
  });

  const decFilter = document.getElementById('decision-filter');
  if (decFilter) decFilter.value = 'all';

  onFilterChange();
  showToast('Filters reset', 'info', 1500);
}

// ---- Candidate Detail Modal ----
function openCandidateModal(candidateName) {
  const evalData = AppState.currentEval;
  if (!evalData) return;

  const r = evalData.ranked.find(c => c.name === candidateName);
  if (!r) return;

  const breakdown = r.breakdown || {};
  const skillMatch = r.skillMatch || { exactMatches: [], partialMatches: [], missingSkills: [], optionalMatches: [] };
  const explanation = r.explanation || { strengths: [], weaknesses: [], reason: '' };
  const skillGaps = r.skillGaps || [];

  const confidencePct = Math.round((r.confidence || 0) * 100);
  const scoreColor = r.score >= 70 ? '#22c55e' : r.score >= 45 ? '#f59e0b' : '#ef4444';

  openModal(`
    <div class="candidate-detail-modal">
      <!-- Header -->
      <div class="modal-header">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1rem;color:#fff;flex-shrink:0">
            ${r.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
          </div>
          <div>
            <div style="font-size:1.1rem;font-weight:800">${r.name}</div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:4px">
              <span class="classification-badge ${r.classification === 'Strong Fit' ? 'badge-strong' : r.classification === 'Moderate Fit' ? 'badge-moderate' : 'badge-weak'}">${r.classification}</span>
              <span class="tag tag-keyword" style="font-size:0.7rem">${r.cluster || 'General'}</span>
              <div class="bias-badge"><i class="fas fa-shield-halved"></i> Bias-Free</div>
            </div>
          </div>
          <div style="margin-left:auto;text-align:center">
            <div style="font-size:2.5rem;font-weight:900;color:${scoreColor};line-height:1">${r.score}</div>
            <div style="font-size:0.7rem;color:var(--text-muted);font-weight:600">/ 100</div>
          </div>
        </div>
        <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
      </div>

      <div class="modal-body">
        <!-- Invalid Resume -->
        ${r.candidate?.isInvalid ? `
          <div style="padding:24px;background:var(--danger-bg);border:1px solid rgba(239,68,68,0.25);border-radius:var(--radius);text-align:center">
            <i class="fas fa-exclamation-triangle" style="font-size:2rem;color:var(--danger);margin-bottom:12px"></i>
            <h3 style="color:var(--danger)">Invalid Resume</h3>
            <p style="color:var(--text-secondary)">${r.candidate?.invalidReason || 'Resume could not be processed'}</p>
          </div>
        ` : `

          <!-- Score Breakdown -->
          <div class="modal-section">
            <div class="modal-section-title"><i class="fas fa-calculator" style="color:var(--primary-light)"></i> Score Breakdown</div>
            <div class="score-breakdown">
              ${[
                { label: 'Skill Match', weight: '40%', value: breakdown.skill || 0, cls: 'fill-primary' },
                { label: 'Experience Relevance', weight: '25%', value: breakdown.experience || 0, cls: 'fill-success' },
                { label: 'Project Relevance', weight: '20%', value: breakdown.project || 0, cls: 'fill-warning' },
                { label: 'Semantic Similarity', weight: '15%', value: breakdown.semantic || 0, cls: 'fill-info' }
              ].map(item => `
                <div class="score-breakdown-item">
                  <div class="score-breakdown-top">
                    <span class="score-breakdown-label">${item.label} <span style="font-size:0.75rem;color:var(--text-muted)">(${item.weight})</span></span>
                    <span class="score-breakdown-value" style="color:${item.value >= 70 ? 'var(--success)' : item.value >= 45 ? 'var(--warning)' : 'var(--danger)'}">${item.value}%</span>
                  </div>
                  <div class="score-breakdown-bar">
                    <div class="score-breakdown-fill ${item.cls}" style="width:${item.value}%"></div>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="total-score-card">
              <div>
                <div class="total-score-label">Total Weighted Score</div>
                <div style="font-size:0.8rem;color:var(--text-secondary)">0.40×Skill + 0.25×Exp + 0.20×Project + 0.15×Semantic</div>
              </div>
              <div class="total-score-value">${r.score}/100</div>
            </div>
          </div>

          <!-- Confidence Score -->
          <div class="modal-section">
            <div class="modal-section-title"><i class="fas fa-gauge-high" style="color:var(--accent)"></i> Confidence Score</div>
            <div style="display:flex;align-items:center;gap:20px">
              <div style="position:relative;width:80px;height:80px">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" stroke-width="7"/>
                  <circle cx="40" cy="40" r="32" fill="none"
                    stroke="${confidencePct >= 70 ? '#22c55e' : confidencePct >= 40 ? '#f59e0b' : '#ef4444'}"
                    stroke-width="7"
                    stroke-linecap="round"
                    stroke-dasharray="${2 * Math.PI * 32}"
                    stroke-dashoffset="${2 * Math.PI * 32 * (1 - (r.confidence || 0))}"
                    transform="rotate(-90 40 40)"/>
                </svg>
                <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem;color:${confidencePct >= 70 ? 'var(--success)' : confidencePct >= 40 ? 'var(--warning)' : 'var(--danger)'}">
                  ${confidencePct}%
                </div>
              </div>
              <div>
                <div style="font-weight:700;margin-bottom:4px">${confidencePct >= 70 ? 'High Confidence' : confidencePct >= 40 ? 'Moderate Confidence' : 'Low Confidence'}</div>
                <div style="font-size:0.85rem;color:var(--text-secondary)">
                  ${confidencePct >= 70 ? 'Resume is complete and well-structured with clear skill evidence.' :
                    confidencePct >= 40 ? 'Resume has some gaps in detail. Some areas may be under-represented.' :
                    'Resume is incomplete or vague. Evaluation reliability is limited.'}
                </div>
              </div>
            </div>
          </div>

          <!-- Skill Analysis -->
          <div class="modal-section">
            <div class="modal-section-title"><i class="fas fa-code-merge" style="color:var(--success)"></i> Skill Analysis</div>
            ${skillMatch.exactMatches.length > 0 ? `
              <div style="margin-bottom:12px">
                <div style="font-size:0.78rem;font-weight:700;color:var(--success);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">✓ Exact Matches (${skillMatch.exactMatches.length})</div>
                <div class="tags-row">${skillMatch.exactMatches.map(s => `<span class="tag tag-match">${s}</span>`).join('')}</div>
              </div>
            ` : ''}
            ${skillMatch.partialMatches.length > 0 ? `
              <div style="margin-bottom:12px">
                <div style="font-size:0.78rem;font-weight:700;color:var(--warning);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">≈ Partial Matches (${skillMatch.partialMatches.length})</div>
                <div class="tags-row">${skillMatch.partialMatches.map(s => `<span class="tag tag-partial">${s}</span>`).join('')}</div>
              </div>
            ` : ''}
            ${skillMatch.missingSkills.length > 0 ? `
              <div>
                <div style="font-size:0.78rem;font-weight:700;color:var(--danger);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">✗ Missing Required (${skillMatch.missingSkills.length})</div>
                <div class="tags-row">${skillMatch.missingSkills.map(s => `<span class="tag tag-missing">${s}</span>`).join('')}</div>
              </div>
            ` : ''}
            ${skillMatch.optionalMatches.length > 0 ? `
              <div style="margin-top:12px">
                <div style="font-size:0.78rem;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">+ Bonus Skills</div>
                <div class="tags-row">${skillMatch.optionalMatches.map(s => `<span class="tag tag-optional">${s}</span>`).join('')}</div>
              </div>
            ` : ''}
          </div>

          <!-- Skill Gaps -->
          ${skillGaps.length > 0 ? `
            <div class="modal-section">
              <div class="modal-section-title"><i class="fas fa-magnifying-glass-minus" style="color:var(--warning)"></i> Skill Gap Analysis</div>
              <div style="display:flex;flex-direction:column;gap:10px">
                ${skillGaps.map(g => `
                  <div style="padding:12px 14px;background:var(--warning-bg);border:1px solid rgba(245,158,11,0.2);border-radius:var(--radius-sm)">
                    <div style="font-weight:700;color:var(--warning);margin-bottom:4px;font-size:0.875rem"><i class="fas fa-exclamation-triangle"></i> ${g.skill}</div>
                    <div style="font-size:0.82rem;color:var(--text-secondary)"><strong>Suggestion:</strong> ${g.suggestion}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Strengths & Weaknesses -->
          <div class="modal-section">
            <div class="modal-section-title"><i class="fas fa-lightbulb" style="color:var(--gold)"></i> Strengths & Weaknesses</div>
            <div class="grid-2" style="gap:16px">
              <div>
                <div style="font-size:0.8rem;font-weight:700;color:var(--success);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px">Strengths</div>
                <div class="sw-list">
                  ${explanation.strengths.length > 0 ? explanation.strengths.map(s => `
                    <div class="sw-item strength"><i class="fas fa-check-circle"></i> <span>${s}</span></div>
                  `).join('') : '<div class="text-muted text-sm">No significant strengths identified</div>'}
                </div>
              </div>
              <div>
                <div style="font-size:0.8rem;font-weight:700;color:var(--danger);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px">Weaknesses</div>
                <div class="sw-list">
                  ${explanation.weaknesses.length > 0 ? explanation.weaknesses.map(w => `
                    <div class="sw-item weakness"><i class="fas fa-times-circle"></i> <span>${w}</span></div>
                  `).join('') : '<div class="text-muted text-sm">No major weaknesses identified</div>'}
                </div>
              </div>
            </div>
          </div>

          <!-- AI Reasoning -->
          <div class="modal-section">
            <div class="modal-section-title"><i class="fas fa-brain" style="color:var(--primary-light)"></i> AI Reasoning</div>
            <div class="ai-reason-box">${explanation.reason || 'No reasoning generated.'}</div>
          </div>

          <!-- Actions -->
          <div style="display:flex;gap:10px;padding-top:8px">
            <button class="btn btn-success btn-sm ${r.decision === 'Hire' ? '' : ''}" onclick="setDecisionFromModal('${r.name}', 'Hire')">
              <i class="fas fa-check"></i> ${r.decision === 'Hire' ? '✓ Hired' : 'Mark as Hire'}
            </button>
            <button class="btn btn-danger btn-sm" onclick="setDecisionFromModal('${r.name}', 'Reject')">
              <i class="fas fa-times"></i> ${r.decision === 'Reject' ? '✗ Rejected' : 'Mark as Reject'}
            </button>
            <button class="btn btn-secondary btn-sm" onclick="closeModal()">Close</button>
          </div>
        `}
      </div>
    </div>
  `, 'modal-container');
}

function setDecisionFromModal(candidateName, decision) {
  const evalData = AppState.currentEval;
  if (!evalData) return;
  const candidate = evalData.ranked.find(r => r.name === candidateName);
  if (!candidate) return;
  candidate.decision = candidate.decision === decision ? 'None' : decision;
  updateDecision(evalData.id, candidateName, candidate.decision);
  closeModal();
  // Re-render the row in the table
  const row = document.getElementById(`row-${candidate.rank}`);
  if (row) row.outerHTML = renderRankRow(candidate);
  const summaryEl = document.getElementById('hr-summary');
  if (summaryEl) summaryEl.innerHTML = renderHireRejectSummary(evalData.ranked);
  const label = candidate.decision === 'None' ? 'cleared' : candidate.decision === 'Hire' ? 'marked as Hired' : 'marked as Rejected';
  showToast(`${candidateName} ${label}`, 'success', 2000);
}

// ---- Compare Tab ----
let _compareSelected = [];

function toggleCompareSelect(el, name) {
  const idx = _compareSelected.indexOf(name);
  if (idx > -1) {
    _compareSelected.splice(idx, 1);
    el.classList.remove('selected');
  } else if (_compareSelected.length < 3) {
    _compareSelected.push(name);
    el.classList.add('selected');
  } else {
    showToast('Max 3 candidates can be compared at once', 'warning', 2000);
  }
}

function renderComparison() {
  const evalData = AppState.currentEval;
  if (!evalData) return;

  if (_compareSelected.length < 2) {
    showToast('Select at least 2 candidates to compare', 'warning');
    return;
  }

  const candidates = _compareSelected.map(name => evalData.ranked.find(r => r.name === name)).filter(Boolean);
  const resultEl = document.getElementById('comparison-result');

  resultEl.innerHTML = `
    <div class="compare-table card">
      <div class="section-header-left" style="margin-bottom:20px">
        <h3>Side-by-Side Comparison</h3>
        <p class="text-secondary text-sm">Detailed comparison of selected candidates</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Attribute</th>
            ${candidates.map(c => `<th style="color:var(--primary-light)">${c.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rank</td>
            ${candidates.map(c => `<td><strong>#${c.rank}</strong></td>`).join('')}
          </tr>
          <tr>
            <td>Score</td>
            ${candidates.map(c => `<td><strong style="color:${c.score>=70?'var(--success)':c.score>=45?'var(--warning)':'var(--danger)'}">${c.score}/100</strong></td>`).join('')}
          </tr>
          <tr>
            <td>Classification</td>
            ${candidates.map(c => `<td><span class="classification-badge ${c.classification==='Strong Fit'?'badge-strong':c.classification==='Moderate Fit'?'badge-moderate':'badge-weak'}">${c.classification}</span></td>`).join('')}
          </tr>
          <tr>
            <td>Confidence</td>
            ${candidates.map(c => `<td>${Math.round(c.confidence*100)}%</td>`).join('')}
          </tr>
          <tr>
            <td>Skill Match</td>
            ${candidates.map(c => `<td>${c.breakdown?.skill || 0}%</td>`).join('')}
          </tr>
          <tr>
            <td>Experience</td>
            ${candidates.map(c => `<td>${c.breakdown?.experience || 0}%</td>`).join('')}
          </tr>
          <tr>
            <td>Project Fit</td>
            ${candidates.map(c => `<td>${c.breakdown?.project || 0}%</td>`).join('')}
          </tr>
          <tr>
            <td>Years Exp.</td>
            ${candidates.map(c => `<td>${c.yearsExperience || 0}y</td>`).join('')}
          </tr>
          <tr>
            <td>Cluster</td>
            ${candidates.map(c => `<td>${c.cluster || '—'}</td>`).join('')}
          </tr>
          <tr>
            <td>Exact Skill Matches</td>
            ${candidates.map(c => `<td>${(c.skillMatch?.exactMatches||[]).join(', ') || 'None'}</td>`).join('')}
          </tr>
          <tr>
            <td>Missing Skills</td>
            ${candidates.map(c => `<td style="color:var(--danger)">${(c.skillMatch?.missingSkills||[]).join(', ') || 'None'}</td>`).join('')}
          </tr>
          <tr>
            <td>Decision</td>
            ${candidates.map(c => `<td><strong style="color:${c.decision==='Hire'?'var(--success)':c.decision==='Reject'?'var(--danger)':'var(--text-muted)'}">${c.decision || 'Pending'}</strong></td>`).join('')}
          </tr>
        </tbody>
      </table>

      <!-- Comparative Explanation -->
      ${candidates.length >= 2 ? `
        <div class="spacer-sm"></div>
        <div class="modal-section-title" style="margin-top:16px"><i class="fas fa-brain" style="color:var(--primary-light)"></i> AI Comparative Analysis</div>
        <div class="ai-reason-box">
          <strong>${candidates[0].name} vs ${candidates[1].name}:</strong>
          ${candidates[0].score > candidates[1].score
            ? `${candidates[0].name} ranks higher with a ${candidates[0].score - candidates[1].score}-point lead.`
            : candidates[0].score < candidates[1].score
            ? `${candidates[1].name} ranks higher with a ${candidates[1].score - candidates[0].score}-point lead.`
            : 'These candidates are tied on overall score.'}
          ${candidates[0].breakdown?.skill !== candidates[1].breakdown?.skill
            ? ` Skill match: ${candidates[0].name} (${candidates[0].breakdown?.skill}%) vs ${candidates[1].name} (${candidates[1].breakdown?.skill}%).`
            : ''}
          ${candidates[0].yearsExperience !== candidates[1].yearsExperience
            ? ` Experience: ${candidates[0].name} (${candidates[0].yearsExperience}y) vs ${candidates[1].name} (${candidates[1].yearsExperience}y).`
            : ''}
        </div>
      ` : ''}
    </div>
  `;
}

// ---- Cluster View ----
function renderClusterView(ranked) {
  const strong = ranked.filter(r => r.classification === 'Strong Fit');
  const moderate = ranked.filter(r => r.classification === 'Moderate Fit');
  const weak = ranked.filter(r => r.classification !== 'Strong Fit' && r.classification !== 'Moderate Fit');

  return `
    <div class="cluster-zones">
      ${renderClusterZone('Strong Fit', strong, 'strong')}
      ${renderClusterZone('Moderate Fit', moderate, 'moderate')}
      ${renderClusterZone('Weak Fit', weak, 'weak')}
    </div>
  `;
}

function renderClusterZone(title, candidates, type) {
  return `
    <div class="cluster-zone cluster-zone-${type}">
      <div class="cluster-zone-header">
        <div>
          <div class="cluster-zone-title">${title}</div>
          <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:2px">
            ${type === 'strong' ? 'Score ≥ 70 · Recommended for interview' :
              type === 'moderate' ? 'Score 45-69 · Consider with reservations' :
              'Score < 45 · Not recommended for this role'}
          </div>
        </div>
        <span class="cluster-zone-count">${candidates.length} candidate${candidates.length !== 1 ? 's' : ''}</span>
      </div>
      ${candidates.length > 0 ? `
        <div class="cluster-candidates">
          ${candidates.map(r => `
            <div class="cluster-chip" onclick="openCandidateModal('${r.name}')">
              <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.7rem;color:#fff">
                ${r.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
              </div>
              <div>
                <div style="font-size:0.82rem;font-weight:700">${r.name}</div>
                <div style="font-size:0.72rem;color:var(--text-muted)">${r.cluster || 'General'}</div>
              </div>
              <div class="cluster-chip-score">${r.score}</div>
            </div>
          `).join('')}
        </div>
      ` : `<div class="text-muted text-sm">No candidates in this cluster</div>`}
    </div>
  `;
}

function setClusterView(view) {
  document.getElementById('vt-cluster')?.classList.toggle('active', view === 'cluster');
  document.getElementById('vt-specialty')?.classList.toggle('active', view === 'specialty');

  const content = document.getElementById('cluster-content');
  if (!content) return;

  const evalData = AppState.currentEval;
  if (!evalData) return;

  if (view === 'cluster') {
    content.innerHTML = renderClusterView(evalData.ranked);
  } else {
    // Specialty view
    const clusters = {};
    evalData.ranked.forEach(r => {
      const cluster = r.cluster || 'General';
      if (!clusters[cluster]) clusters[cluster] = [];
      clusters[cluster].push(r);
    });

    const clusterColors = {
      'Frontend-Heavy': 'var(--primary-light)',
      'Backend-Leaning': 'var(--accent)',
      'Full Stack': 'var(--info)',
      'Fresher': 'var(--warning)',
      'General': 'var(--text-muted)'
    };

    content.innerHTML = `
      <div class="cluster-zones">
        ${Object.entries(clusters).map(([name, members]) => `
          <div class="cluster-zone" style="border-color:rgba(99,102,241,0.2);background:rgba(99,102,241,0.05)">
            <div class="cluster-zone-header">
              <div class="cluster-zone-title" style="color:${clusterColors[name] || 'var(--primary-light)'}">${name}</div>
              <span class="cluster-zone-count" style="background:rgba(99,102,241,0.15);color:var(--primary-light)">${members.length} candidate${members.length !== 1 ? 's' : ''}</span>
            </div>
            <div class="cluster-candidates">
              ${members.map(r => `
                <div class="cluster-chip" onclick="openCandidateModal('${r.name}')">
                  <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.7rem;color:#fff">
                    ${r.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
                  </div>
                  <div>
                    <div style="font-size:0.82rem;font-weight:700">${r.name}</div>
                    <div style="font-size:0.72rem;color:var(--text-muted)">${r.classification}</div>
                  </div>
                  <div class="cluster-chip-score">${r.score}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// ---- Charts ----
function initResultCharts() {
  const evalData = AppState.currentEval;
  if (!evalData) return;

  const ranked = evalData.ranked || [];

  // Score distribution - all candidates
  const scoreCtx = document.getElementById('results-score-chart');
  if (scoreCtx) {
    new Chart(scoreCtx, {
      type: 'bar',
      data: {
        labels: ranked.map(r => r.name.split(' ')[0]),
        datasets: [{
          label: 'Score',
          data: ranked.map(r => r.score),
          backgroundColor: ranked.map(r =>
            r.score >= 70 ? 'rgba(34,197,94,0.7)' :
            r.score >= 45 ? 'rgba(245,158,11,0.7)' :
            'rgba(239,68,68,0.7)'
          ),
          borderRadius: 5
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const r = ranked[ctx.dataIndex];
                return [`Score: ${ctx.raw}/100`, `${r.classification}`, `Confidence: ${Math.round(r.confidence*100)}%`];
              }
            }
          }
        },
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } }
        }
      }
    });
  }

  // Classification donut
  const classCtx = document.getElementById('results-class-chart');
  if (classCtx) {
    const s = evalData.stats || {};
    new Chart(classCtx, {
      type: 'doughnut',
      data: {
        labels: ['Strong Fit', 'Moderate Fit', 'Weak Fit'],
        datasets: [{
          data: [s.strongFit || 0, s.moderateFit || 0, s.weakFit || 0],
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
