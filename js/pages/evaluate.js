// ===================================================
// HireIQ — Evaluate Page (3-Step Wizard)
// ===================================================

Pages.Evaluate = {
  render() {
    return `
      ${renderAppNavbar()}
      <div class="app-layout">
        ${renderSidebar('/evaluate')}
        <div class="main-content">
          <div class="page-header">
            <div>
              <div class="page-title">New Evaluation</div>
              <div class="page-subtitle">Analyze and rank candidates for your job opening</div>
            </div>
          </div>

          <!-- Wizard Steps -->
          <div class="wizard-steps" id="wizard-steps">
            <div class="wizard-step active" id="step-indicator-1">
              <div class="wizard-step-num">1</div>
              <div class="wizard-step-info">
                <div class="wizard-step-label">Step 1</div>
                <div class="wizard-step-title">Job Description</div>
              </div>
            </div>
            <div class="wizard-sep"></div>
            <div class="wizard-step" id="step-indicator-2">
              <div class="wizard-step-num">2</div>
              <div class="wizard-step-info">
                <div class="wizard-step-label">Step 2</div>
                <div class="wizard-step-title">Upload Resumes</div>
              </div>
            </div>
            <div class="wizard-sep"></div>
            <div class="wizard-step" id="step-indicator-3">
              <div class="wizard-step-num">3</div>
              <div class="wizard-step-info">
                <div class="wizard-step-label">Step 3</div>
                <div class="wizard-step-title">Run Analysis</div>
              </div>
            </div>
          </div>

          <!-- Step 1: JD Input -->
          <div class="wizard-panel active" id="panel-1">
            <div class="jd-card">
              <h3><i class="fas fa-file-alt" style="color:var(--primary-light);margin-right:8px"></i> Job Description</h3>
              <p>Paste the job description below. The AI will extract required skills, experience level, and role keywords.</p>

              <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
                <button class="btn btn-secondary btn-sm" onclick="loadSampleJD()">
                  <i class="fas fa-flask"></i> Load Sample JD
                </button>
                <label class="btn btn-secondary btn-sm" style="cursor:pointer">
                  <i class="fas fa-upload"></i> Upload .txt File
                  <input type="file" accept=".txt,.md" style="display:none" onchange="handleJDFileUpload(event)" />
                </label>
                <button class="btn btn-secondary btn-sm" onclick="clearJD()">
                  <i class="fas fa-times"></i> Clear
                </button>
              </div>

              <textarea
                id="jd-textarea"
                class="form-textarea"
                placeholder="Paste your job description here...

Example:
Senior Frontend Developer

Required Skills:
- React.js (must have)
- TypeScript
- REST API integration

Nice to have:
- GraphQL
- Docker

Experience: 3+ years..."
                rows="14"
                oninput="onJDInput()"
              ></textarea>

              <div id="jd-char-count" style="font-size:0.75rem;color:var(--text-muted);text-align:right;margin-top:6px">0 characters</div>
            </div>

            <div id="jd-extracted-section"></div>

            <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px">
              <button class="btn btn-secondary" onclick="navigate('/dashboard')">Cancel</button>
              <button class="btn btn-primary btn-lg" id="analyze-jd-btn" onclick="analyzeJDStep()" disabled>
                <i class="fas fa-magic"></i>
                Analyze Job Description
              </button>
            </div>
          </div>

          <!-- Step 2: Resume Upload -->
          <div class="wizard-panel" id="panel-2">
            <div class="jd-card">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:10px">
                <div>
                  <h3><i class="fas fa-users" style="color:var(--primary-light);margin-right:8px"></i> Candidate Resumes</h3>
                  <p style="margin-bottom:0">Add candidate resumes by uploading text files or pasting directly. Add up to 15 candidates.</p>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                  <button class="btn btn-secondary btn-sm" onclick="loadSampleResumes()">
                    <i class="fas fa-flask"></i> Load 8 Sample Candidates
                  </button>
                  <button class="btn btn-secondary btn-sm" onclick="openAddCandidateModal()">
                    <i class="fas fa-plus"></i> Add Candidate
                  </button>
                  <label class="btn btn-secondary btn-sm" style="cursor:pointer">
                    <i class="fas fa-upload"></i> Upload Files
                    <input type="file" accept=".txt,.md" multiple style="display:none" onchange="handleResumeFilesUpload(event)" />
                  </label>
                </div>
              </div>

              <!-- Drop Zone -->
              <div class="upload-area" id="drop-zone"
                ondragover="handleDragOver(event)"
                ondragleave="handleDragLeave(event)"
                ondrop="handleDrop(event)"
                onclick="document.getElementById('file-upload-input').click()">
                <div class="upload-icon"><i class="fas fa-cloud-arrow-up"></i></div>
                <div class="upload-title">Drop resume files here</div>
                <div class="upload-subtitle">Supports .txt and .md files · Up to 15 candidates</div>
                <button class="btn btn-primary btn-sm" type="button" onclick="event.stopPropagation()">
                  <i class="fas fa-folder-open"></i> Browse Files
                </button>
                <input type="file" id="file-upload-input" accept=".txt,.md" multiple style="display:none" onchange="handleResumeFilesUpload(event)" />
              </div>
            </div>

            <!-- Candidates List -->
            <div id="candidates-list-section">
              <div class="section-header" style="margin-top:24px">
                <div class="section-header-left">
                  <h3>Added Candidates <span class="num-badge" id="candidate-count-badge">0</span></h3>
                  <p>Each candidate will be scored and ranked against the job description</p>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="clearAllCandidates()" id="clear-all-btn" style="display:none">
                  <i class="fas fa-trash"></i> Clear All
                </button>
              </div>
              <div class="candidates-list" id="candidates-list"></div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:24px;flex-wrap:wrap;gap:12px">
              <button class="btn btn-secondary" onclick="goToStep(1)">
                <i class="fas fa-arrow-left"></i> Back
              </button>
              <div style="display:flex;gap:12px">
                <button class="btn btn-secondary btn-lg" onclick="openAddCandidateModal()">
                  <i class="fas fa-plus"></i> Add Another
                </button>
                <button class="btn btn-primary btn-lg" id="run-analysis-btn" onclick="goToStep(3)" disabled>
                  <i class="fas fa-brain"></i>
                  Run AI Analysis
                </button>
              </div>
            </div>
          </div>

          <!-- Step 3: Processing -->
          <div class="wizard-panel" id="panel-3">
            <div class="processing-overlay" id="processing-overlay">
              <div class="processing-spinner"></div>
              <h3 style="font-size:1.4rem;font-weight:800;margin-bottom:8px">Analyzing Candidates</h3>
              <p style="color:var(--text-secondary);margin-bottom:4px" id="processing-subtitle">Please wait while the AI processes all resumes...</p>
              <div class="processing-steps" id="processing-steps">
                <div class="processing-step" id="proc-1">
                  <i class="fas fa-circle-notch fa-spin"></i>
                  <span>Parsing resumes and extracting data...</span>
                </div>
                <div class="processing-step" id="proc-2">
                  <i class="fas fa-clock"></i>
                  <span>Running semantic skill matching...</span>
                </div>
                <div class="processing-step" id="proc-3">
                  <i class="fas fa-clock"></i>
                  <span>Computing AI scores and rankings...</span>
                </div>
                <div class="processing-step" id="proc-4">
                  <i class="fas fa-clock"></i>
                  <span>Generating explanations and insights...</span>
                </div>
                <div class="processing-step" id="proc-5">
                  <i class="fas fa-clock"></i>
                  <span>Building comparative analysis...</span>
                </div>
              </div>
            </div>

            <div style="display:flex;justify-content:flex-start;margin-top:20px">
              <button class="btn btn-secondary" onclick="goToStep(2)" id="back-from-step3">
                <i class="fas fa-arrow-left"></i> Back
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  init() {
    updateThemeIcon(document.documentElement.getAttribute('data-theme'));

    // Restore state
    if (AppState.pendingJD) {
      setTimeout(() => {
        const ta = document.getElementById('jd-textarea');
        if (ta) {
          ta.value = AppState.pendingJD;
          onJDInput();
          if (AppState.pendingJDData) {
            renderExtractedJD(AppState.pendingJDData);
            goToStep(AppState.pendingResumes.length > 0 ? 2 : 1);
          }
        }
      }, 100);
    }

    if (AppState.pendingResumes.length > 0) {
      setTimeout(() => refreshCandidatesList(), 150);
    }
  }
};

// ---- Wizard State ----
let currentWizardStep = 1;

function goToStep(n) {
  // Validate step 1 → 2
  if (n === 2 && !AppState.pendingJDData) {
    showToast('Please analyze the job description first', 'warning');
    return;
  }
  // Validate step 2 → 3
  if (n === 3 && AppState.pendingResumes.length < 1) {
    showToast('Please add at least 1 candidate resume', 'warning');
    return;
  }
  if (n === 3) {
    runFullAnalysis();
  }

  currentWizardStep = n;

  // Update panels
  document.querySelectorAll('.wizard-panel').forEach((p, i) => {
    p.classList.toggle('active', i + 1 === n);
  });

  // Update step indicators
  for (let i = 1; i <= 3; i++) {
    const step = document.getElementById(`step-indicator-${i}`);
    if (!step) continue;
    step.classList.remove('active', 'completed');
    if (i < n) step.classList.add('completed');
    else if (i === n) step.classList.add('active');
  }
}

// ---- JD Functions ----
function onJDInput() {
  const val = document.getElementById('jd-textarea')?.value || '';
  const countEl = document.getElementById('jd-char-count');
  if (countEl) countEl.textContent = `${val.length} characters`;

  const btn = document.getElementById('analyze-jd-btn');
  if (btn) btn.disabled = val.trim().length < 30;
}

function clearJD() {
  const ta = document.getElementById('jd-textarea');
  if (ta) ta.value = '';
  document.getElementById('jd-extracted-section').innerHTML = '';
  AppState.pendingJD = null;
  AppState.pendingJDData = null;
  onJDInput();
  // Reset to step 1 if in step 2+
  if (currentWizardStep > 1) goToStep(1);
}

function loadSampleJD() {
  const ta = document.getElementById('jd-textarea');
  if (ta) {
    ta.value = SAMPLE_JD;
    onJDInput();
    showToast('Sample JD loaded!', 'success');
  }
}

function handleJDFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const ta = document.getElementById('jd-textarea');
    if (ta) {
      ta.value = e.target.result;
      onJDInput();
      showToast(`Loaded: ${file.name}`, 'success');
    }
  };
  reader.readAsText(file);
}

function analyzeJDStep() {
  const jdText = document.getElementById('jd-textarea')?.value.trim();
  if (!jdText || jdText.length < 30) {
    showToast('Please enter a job description (minimum 30 characters)', 'warning');
    return;
  }

  const btn = document.getElementById('analyze-jd-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';

  setTimeout(() => {
    try {
      const jdData = Engine.analyzeJD(jdText);
      if (!jdData) throw new Error('Could not parse job description');

      AppState.pendingJD = jdText;
      AppState.pendingJDData = jdData;

      renderExtractedJD(jdData);

      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check"></i> JD Analyzed — Continue';
      btn.onclick = () => goToStep(2);
      btn.className = 'btn btn-success btn-lg';

      showToast('Job description analyzed successfully!', 'success');
    } catch(e) {
      showToast('Failed to analyze JD: ' + e.message, 'error');
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-magic"></i> Analyze Job Description';
    }
  }, 800);
}

function renderExtractedJD(jdData) {
  const section = document.getElementById('jd-extracted-section');
  if (!section) return;

  section.innerHTML = `
    <div class="jd-extracted">
      <div class="jd-extracted-header">
        <div class="jd-extracted-title">
          <i class="fas fa-check-circle"></i>
          Extracted Job Requirements
        </div>
        <div class="bias-badge"><i class="fas fa-shield-halved"></i> Bias-Free Mode Active</div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:16px">
        <div class="jd-section">
          <div class="jd-section-label">Required Skills (${jdData.requiredSkills.length})</div>
          <div class="tags-row">
            ${jdData.requiredSkills.map(s => `<span class="tag tag-required"><i class="fas fa-circle-check" style="font-size:0.65rem"></i>${s}</span>`).join('') || '<span class="text-muted text-sm">None detected</span>'}
          </div>
        </div>
        <div class="jd-section">
          <div class="jd-section-label">Optional Skills (${jdData.optionalSkills.length})</div>
          <div class="tags-row">
            ${jdData.optionalSkills.map(s => `<span class="tag tag-optional">${s}</span>`).join('') || '<span class="text-muted text-sm">None detected</span>'}
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
        <div class="jd-section" style="margin-bottom:0">
          <div class="jd-section-label">Experience Required</div>
          <div style="font-size:1.1rem;font-weight:800;color:var(--primary-light)">${jdData.experienceYears > 0 ? `${jdData.experienceYears}+ years` : 'Not specified'}</div>
        </div>
        <div class="jd-section" style="margin-bottom:0">
          <div class="jd-section-label">Role Keywords</div>
          <div class="tags-row">
            ${jdData.roleKeywords.map(k => `<span class="tag tag-keyword">${k}</span>`).join('') || '<span class="text-muted text-sm">None</span>'}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---- Resume Functions ----
function loadSampleResumes() {
  AppState.pendingResumes = SAMPLE_CANDIDATES.map((c, i) => ({
    id: c.id || `sample_${i}`,
    name: c.rawText.trim().split('\n')[0] || `Candidate ${i+1}`,
    text: c.rawText,
    source: 'sample'
  }));
  refreshCandidatesList();
  showToast('8 sample candidates loaded!', 'success');
}

function openAddCandidateModal() {
  if (AppState.pendingResumes.length >= 15) {
    showToast('Maximum 15 candidates per evaluation', 'warning');
    return;
  }

  const idx = AppState.pendingResumes.length + 1;
  openModal(`
    <div class="modal-header">
      <div>
        <div style="font-size:1.1rem;font-weight:800">Add Candidate Resume</div>
        <div style="font-size:0.85rem;color:var(--text-secondary)">Paste the candidate's resume text below</div>
      </div>
      <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Candidate Name (optional)</label>
        <input type="text" id="modal-candidate-name" class="form-input" placeholder="Will be auto-extracted from resume" />
      </div>
      <div class="form-group">
        <label class="form-label">Resume Text *</label>
        <textarea id="modal-resume-text" class="form-textarea" rows="12"
          placeholder="Paste the full resume text here...

John Doe
Frontend Developer | john@email.com

SKILLS
React, TypeScript, CSS...

EXPERIENCE
Senior Dev — Company (2020-2024)
..."></textarea>
        <div id="modal-resume-error" class="form-error hidden"></div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:16px">
        <button class="btn btn-secondary btn-sm" onclick="loadSampleIntoModal(${idx})">
          <i class="fas fa-flask"></i> Load Sample Resume
        </button>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="addCandidateFromModal()">
          <i class="fas fa-plus"></i> Add Candidate
        </button>
      </div>
    </div>
  `, 'modal-container paste-modal');
}

function loadSampleIntoModal(idx) {
  const sampleIdx = (idx - 1) % SAMPLE_CANDIDATES.length;
  const sample = SAMPLE_CANDIDATES[sampleIdx];
  const ta = document.getElementById('modal-resume-text');
  if (ta) {
    ta.value = sample.rawText;
    const firstLine = sample.rawText.trim().split('\n')[0];
    const nameInput = document.getElementById('modal-candidate-name');
    if (nameInput && !nameInput.value) nameInput.value = firstLine;
  }
}

function addCandidateFromModal() {
  const text = document.getElementById('modal-resume-text')?.value?.trim();
  const nameOverride = document.getElementById('modal-candidate-name')?.value?.trim();

  if (!text || text.length < 10) {
    const err = document.getElementById('modal-resume-error');
    if (err) { err.textContent = 'Please enter resume text (minimum 10 characters)'; err.classList.remove('hidden'); }
    return;
  }

  const autoName = text.split('\n').find(l => l.trim())?.trim() || `Candidate ${AppState.pendingResumes.length + 1}`;
  const name = nameOverride || autoName.substring(0, 60);

  AppState.pendingResumes.push({
    id: `cand_${Date.now()}`,
    name,
    text,
    source: 'manual'
  });

  closeModal();
  refreshCandidatesList();
  showToast(`Added: ${name}`, 'success');
}

function handleResumeFilesUpload(event) {
  const files = Array.from(event.target.files || []);
  if (files.length === 0) return;

  let loaded = 0;
  for (const file of files) {
    if (AppState.pendingResumes.length >= 15) break;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const name = text.trim().split('\n')[0]?.substring(0, 60) || file.name.replace('.txt', '');
      AppState.pendingResumes.push({ id: `file_${Date.now()}_${Math.random()}`, name, text, source: 'file' });
      loaded++;
      if (loaded === Math.min(files.length, 15 - AppState.pendingResumes.length + loaded)) {
        refreshCandidatesList();
        showToast(`Loaded ${loaded} resume(s)`, 'success');
      }
    };
    reader.readAsText(file);
  }
}

function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('drop-zone')?.classList.add('drag-over');
}
function handleDragLeave() {
  document.getElementById('drop-zone')?.classList.remove('drag-over');
}
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('drop-zone')?.classList.remove('drag-over');
  const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.txt') || f.name.endsWith('.md'));
  if (files.length > 0) {
    const fakeEvent = { target: { files } };
    handleResumeFilesUpload(fakeEvent);
  }
}

function removeCandidate(id) {
  AppState.pendingResumes = AppState.pendingResumes.filter(r => r.id !== id);
  refreshCandidatesList();
}

function clearAllCandidates() {
  AppState.pendingResumes = [];
  refreshCandidatesList();
}

function refreshCandidatesList() {
  const listEl = document.getElementById('candidates-list');
  const badgeEl = document.getElementById('candidate-count-badge');
  const runBtn = document.getElementById('run-analysis-btn');
  const clearBtn = document.getElementById('clear-all-btn');

  if (!listEl) return;

  const count = AppState.pendingResumes.length;
  if (badgeEl) badgeEl.textContent = count;
  if (runBtn) runBtn.disabled = count === 0;
  if (clearBtn) clearBtn.style.display = count > 0 ? 'flex' : 'none';

  if (count === 0) {
    listEl.innerHTML = '';
    return;
  }

  listEl.innerHTML = AppState.pendingResumes.map((c, i) => {
    const initials = c.name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');
    const isShort = c.text.trim().length < 30;
    return `
      <div class="candidate-card">
        <div class="candidate-avatar">${initials || (i+1)}</div>
        <div class="candidate-info">
          <div class="candidate-name">${c.name}</div>
          <div class="candidate-meta">
            ${c.text.trim().length} chars · Source: ${c.source}
            ${isShort ? ' · <span style="color:var(--warning)">⚠ Very short — may be marked invalid</span>' : ''}
          </div>
        </div>
        <div class="status-dot ${isShort ? 'processing' : 'ready'}" title="${isShort ? 'Short resume' : 'Ready'}"></div>
        <button class="btn-icon" onclick="removeCandidate('${c.id}')" title="Remove">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  }).join('');
}

// ---- Run Analysis ----
function runFullAnalysis() {
  const backBtn = document.getElementById('back-from-step3');
  if (backBtn) backBtn.disabled = true;

  const steps = [
    { id: 'proc-1', label: 'Parsing resumes and extracting data...' },
    { id: 'proc-2', label: 'Running semantic skill matching...' },
    { id: 'proc-3', label: 'Computing AI scores and rankings...' },
    { id: 'proc-4', label: 'Generating explanations and insights...' },
    { id: 'proc-5', label: 'Building comparative analysis...' }
  ];

  let stepIndex = 0;

  function advanceStep() {
    if (stepIndex > 0) {
      const prevEl = document.getElementById(steps[stepIndex - 1].id);
      if (prevEl) { prevEl.classList.remove('active'); prevEl.classList.add('done'); prevEl.querySelector('i').className = 'fas fa-check-circle'; }
    }

    if (stepIndex < steps.length) {
      const currEl = document.getElementById(steps[stepIndex].id);
      if (currEl) { currEl.classList.add('active'); currEl.querySelector('i').className = 'fas fa-circle-notch fa-spin'; }
      stepIndex++;
      setTimeout(advanceStep, 400 + Math.random() * 300);
    } else {
      // All steps done - run actual analysis
      try {
        const jdText = AppState.pendingJD;
        const resumeTexts = AppState.pendingResumes.map(r => r.text);
        const result = Engine.runAnalysis(jdText, resumeTexts);

        // Preserve custom names if provided
        result.ranked.forEach((r, i) => {
          const pending = AppState.pendingResumes[i];
          if (pending && pending.source === 'manual' && pending.name && !r.candidate?.isInvalid) {
            // Keep extracted name unless overridden
          }
        });

        AppState.currentEval = result;
        saveEvaluation(result);

        showToast(`Analysis complete! ${result.ranked.length} candidates ranked.`, 'success', 4000);
        navigate('/results');
      } catch(e) {
        showToast('Analysis failed: ' + e.message, 'error');
        if (backBtn) backBtn.disabled = false;
        goToStep(2);
      }
    }
  }

  // Start step animation
  setTimeout(advanceStep, 200);
}
