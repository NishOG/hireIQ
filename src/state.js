export const AppState = {
  currentEval: null,
  pendingResumes: [],
  pendingJD: null,
  pendingJDData: null
};

export function getEvaluations() {
  try { return JSON.parse(localStorage.getItem('hireiq_evaluations') || '[]'); } catch { return []; }
}

export function saveEvaluation(evalData) {
  const key = 'hireiq_evaluations';
  try {
    const all = JSON.parse(localStorage.getItem(key) || '[]');
    all.unshift(evalData);
    localStorage.setItem(key, JSON.stringify(all.slice(0, 20)));
  } catch(e) { console.error('Failed to save evaluation', e); }
}

export function getEvaluation(id) {
  return getEvaluations().find(e => e.id === id);
}

export function updateDecision(evalId, candidateName, decision) {
  try {
    const all = JSON.parse(localStorage.getItem('hireiq_evaluations') || '[]');
    const eval_ = all.find(e => e.id === evalId);
    if (eval_) {
      const candidate = eval_.ranked.find(r => r.name === candidateName);
      if (candidate) candidate.decision = decision;
      localStorage.setItem('hireiq_evaluations', JSON.stringify(all));
    }
  } catch(e) { console.error('Failed to update decision', e); }
}
