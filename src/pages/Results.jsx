import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppNavbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { AppState, updateDecision, getEvaluations } from '../state';
import { exportReportPdf } from '../pdfExport';
import { showToast } from '../utils';
import Chart from 'chart.js/auto';

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [evalData, setEvalData] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('All');
  const [clusterFilter, setClusterFilter] = useState('All');
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const [showCompared, setShowCompared] = useState(false);
  
  const scoreChartRef = useRef(null);
  const skillsChartRef = useRef(null);

  useEffect(() => {
    const evalId = location.state?.evalId;
    let data = AppState.currentEval;
    
    if (!data && evalId) {
      data = getEvaluations().find(e => e.id === evalId);
    }
    
    if (!data) {
      navigate('/dashboard');
      return;
    }
    
    setEvalData({...data});
  }, [location, navigate]);

  useEffect(() => {
    if (!evalData) return;
    
    if (scoreChartRef.current) scoreChartRef.current.destroy();
    if (skillsChartRef.current) skillsChartRef.current.destroy();

    const candidates = evalData.ranked || [];
    
    const scoreCtx = document.getElementById('results-score-chart');
    if (scoreCtx) {
      const labels = candidates.slice(0, 10).map(c => c.name.split(' ')[0]);
      const scores = candidates.slice(0, 10).map(c => c.score);
      
      scoreChartRef.current = new Chart(scoreCtx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Overall Score',
            data: scores,
            backgroundColor: 'rgba(99, 102, 241, 0.7)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, max: 100 } }
        }
      });
    }

    const skillsCtx = document.getElementById('results-skills-chart');
    if (skillsCtx) {
      const topSkills = (evalData.jdData?.requiredSkills || []).slice(0, 5);
      const skillCounts = topSkills.map(skill => {
        return candidates.filter(c => 
          (c.skills?.found?.required || []).some(s => s.toLowerCase() === skill.toLowerCase())
        ).length;
      });

      skillsChartRef.current = new Chart(skillsCtx, {
        type: 'radar',
        data: {
          labels: topSkills.length > 0 ? topSkills : ['No Skills'],
          datasets: [{
            label: 'Candidates with Skill',
            data: topSkills.length > 0 ? skillCounts : [0],
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            borderColor: 'rgba(34, 197, 94, 1)',
            pointBackgroundColor: 'rgba(34, 197, 94, 1)',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: { beginAtZero: true, suggestedMax: Math.max(...skillCounts, 1), ticks: { precision: 0 } }
          }
        }
      });
    }
    
    return () => {
      if (scoreChartRef.current) scoreChartRef.current.destroy();
      if (skillsChartRef.current) skillsChartRef.current.destroy();
    };
  }, [evalData]);

  const handleDecision = (candidateName, decision) => {
    updateDecision(evalData.id, candidateName, decision);
    
    setEvalData(prev => {
      const updated = {...prev};
      const cand = updated.ranked.find(c => c.name === candidateName);
      if (cand) cand.decision = decision;
      return updated;
    });
    
    showToast(`Marked ${candidateName} as ${decision}`, decision === 'Hire' ? 'success' : 'info');
  };

  const handleExportPDF = () => {
    if (!evalData) return;
    const success = exportReportPdf(evalData);
    if (success) showToast('Report exported successfully', 'success');
  };

  if (!evalData) return null;

  const filteredCandidates = (evalData.ranked || []).filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classificationFilter === 'All' || c.classification === classificationFilter;
    const matchesCluster = clusterFilter === 'All' || c.cluster?.name === clusterFilter;
    return matchesSearch && matchesClass && matchesCluster;
  });

  const clusters = [...new Set((evalData.ranked || []).map(c => c.cluster?.name).filter(Boolean))];

  return (
    <>
      <AppNavbar onToggleSidebar={() => setSidebarOpen(true)} />
      <div className="app-layout">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-content">
          <div className="page-header" style={{marginBottom:'24px', flexWrap:'wrap', gap:'16px'}}>
            <div>
              <div className="page-title">{evalData.title || 'Evaluation Results'}</div>
              <div className="page-subtitle">Analysis completed on {new Date(evalData.date).toLocaleDateString()} • {evalData.ranked?.length || 0} Candidates</div>
            </div>
            <div style={{display:'flex', gap:'10px'}}>
              <button className="btn btn-secondary" onClick={() => setShowCompared(!showCompared)}>
                <i className="fas fa-code-compare"></i> {showCompared ? 'Hide Comparison' : 'Compare Top 2'}
              </button>
              <button className="btn btn-primary" onClick={handleExportPDF}>
                <i className="fas fa-file-pdf"></i> Export PDF
              </button>
            </div>
          </div>

          <div className="stats-grid" style={{marginBottom:'24px'}}>
            <div className="stat-card">
              <div className="stat-label">Top Score</div>
              <div className="stat-value" style={{color:'var(--primary)'}}>{evalData.stats?.topScore || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Average Score</div>
              <div className="stat-value">{evalData.stats?.avgScore || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Required Skills</div>
              <div className="stat-value">{evalData.jdData?.requiredSkills?.length || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Exp. Required</div>
              <div className="stat-value">{evalData.jdData?.experienceRequired || 0} yrs</div>
            </div>
          </div>

          <div className="grid-2" style={{marginBottom:'32px'}}>
            <div className="card">
              <h3>Score Distribution</h3>
              <div style={{height:'240px'}}><canvas id="results-score-chart"></canvas></div>
            </div>
            <div className="card">
              <h3>Required Skills Coverage</h3>
              <div style={{height:'240px'}}><canvas id="results-skills-chart"></canvas></div>
            </div>
          </div>

          {showCompared && filteredCandidates.length >= 2 && (
            <div className="card" style={{marginBottom:'32px', background:'var(--bg-card)', borderColor:'var(--primary)'}}>
              <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px'}}>
                <i className="fas fa-code-compare text-primary" style={{fontSize:'1.5rem'}}></i>
                <h3 style={{margin:0}}>AI Comparative Analysis</h3>
              </div>
              <div className="grid-2">
                <div style={{padding:'20px', background:'var(--bg)', borderRadius:'var(--radius-md)', border:'1px solid var(--border)'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                    <h4 style={{margin:0, fontSize:'1.1rem'}}>{filteredCandidates[0].name}</h4>
                    <span className="badge-strong" style={{padding:'2px 8px', borderRadius:'10px', fontSize:'0.8rem'}}>#{1}</span>
                  </div>
                  <div style={{fontSize:'2rem', fontWeight:800, color:'var(--primary)', marginBottom:'16px'}}>{filteredCandidates[0].score}/100</div>
                  <div style={{fontSize:'0.9rem'}}>
                    <strong>Why rank 1?</strong><br/>
                    Higher skill match ({filteredCandidates[0].metrics?.skillMatch}%) and stronger alignment with core required skills. 
                    {filteredCandidates[0].experience > evalData.jdData?.experienceRequired ? ' Meets/Exceeds experience requirement.' : ''}
                  </div>
                </div>
                <div style={{padding:'20px', background:'var(--bg)', borderRadius:'var(--radius-md)', border:'1px solid var(--border)'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                    <h4 style={{margin:0, fontSize:'1.1rem'}}>{filteredCandidates[1].name}</h4>
                    <span className="badge-moderate" style={{padding:'2px 8px', borderRadius:'10px', fontSize:'0.8rem'}}>#{2}</span>
                  </div>
                  <div style={{fontSize:'2rem', fontWeight:800, color:'var(--text)', marginBottom:'16px'}}>{filteredCandidates[1].score}/100</div>
                  <div style={{fontSize:'0.9rem'}}>
                    <strong>Where they fell short:</strong><br/>
                    Missing some key required skills ({(filteredCandidates[1].skills?.missing?.required || []).slice(0,2).join(', ')}).
                    Lower semantic match score.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{display:'flex', gap:'12px', marginBottom:'20px', flexWrap:'wrap'}}>
            <div className="input-wrapper" style={{flex:1, minWidth:'200px'}}>
              <i className="fas fa-search input-icon"></i>
              <input type="text" className="form-input" placeholder="Search candidates..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{paddingLeft:'40px'}} />
            </div>
            <select className="filter-select" value={classificationFilter} onChange={e => setClassificationFilter(e.target.value)} style={{width:'150px'}}>
              <option value="All">All Fits</option>
              <option value="Strong Fit">Strong Fit</option>
              <option value="Moderate Fit">Moderate Fit</option>
              <option value="Weak Fit">Weak Fit</option>
            </select>
            {clusters.length > 0 && (
              <select className="filter-select" value={clusterFilter} onChange={e => setClusterFilter(e.target.value)} style={{width:'160px'}}>
                <option value="All">All Clusters</option>
                {clusters.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>

          <div className="candidates-list">
            {filteredCandidates.length === 0 ? (
              <div className="empty-state">No candidates match your filters.</div>
            ) : filteredCandidates.map((c, index) => {
              const isExpanded = expandedCandidate === c.name;
              
              const getBadgeClass = (score) => {
                if (score >= 70) return 'badge-strong';
                if (score >= 45) return 'badge-moderate';
                return 'badge-weak';
              };
              
              return (
                <div key={c.name} className="candidate-card" style={{borderLeft: c.decision === 'Hire' ? '4px solid var(--success)' : c.decision === 'Reject' ? '4px solid var(--danger)' : ''}}>
                  <div className="candidate-header" onClick={() => setExpandedCandidate(isExpanded ? null : c.name)} style={{cursor:'pointer'}}>
                    <div className="candidate-rank">#{index + 1}</div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                        <h3 className="candidate-name" style={{margin:0}}>{c.name}</h3>
                        <span className={`classification-badge ${getBadgeClass(c.score)}`}>{c.classification}</span>
                        {c.cluster?.name && <span className="tag tag-keyword" style={{fontSize:'0.7rem'}}><i className="fas fa-object-group"></i> {c.cluster.name}</span>}
                      </div>
                      <div className="candidate-meta" style={{marginTop:'6px', color:'var(--text-muted)', fontSize:'0.875rem'}}>
                        <span style={{marginRight:'16px'}}><i className="fas fa-briefcase"></i> {c.experience} years exp</span>
                        <span><i className="fas fa-check-double"></i> {c.skills?.found?.required?.length || 0} req. skills</span>
                      </div>
                    </div>
                    <div style={{textAlign:'right', paddingRight:'16px'}}>
                      <div className="candidate-score">{c.score}</div>
                      <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>Overall Score</div>
                    </div>
                    <div style={{display:'flex', gap:'8px'}} onClick={e => e.stopPropagation()}>
                      <button className={`btn ${c.decision === 'Hire' ? 'btn-primary' : 'btn-secondary'} btn-sm`} style={{background: c.decision === 'Hire' ? 'var(--success)' : '', borderColor: c.decision === 'Hire' ? 'var(--success)' : ''}} onClick={() => handleDecision(c.name, 'Hire')}>
                        <i className="fas fa-check"></i>
                      </button>
                      <button className={`btn ${c.decision === 'Reject' ? 'btn-primary' : 'btn-secondary'} btn-sm`} style={{background: c.decision === 'Reject' ? 'var(--danger)' : '', borderColor: c.decision === 'Reject' ? 'var(--danger)' : ''}} onClick={() => handleDecision(c.name, 'Reject')}>
                        <i className="fas fa-times"></i>
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setExpandedCandidate(isExpanded ? null : c.name)}>
                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="candidate-details">
                      <div className="grid-2">
                        <div>
                          <div className="section-label">Matched Skills</div>
                          <div style={{display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'16px'}}>
                            {(c.skills?.found?.required || []).map(s => <span key={s} className="tag tag-keyword">{s}</span>)}
                            {(c.skills?.found?.optional || []).map(s => <span key={s} className="tag">{s}</span>)}
                          </div>
                          
                          {(c.skills?.missing?.required?.length > 0) && (
                            <>
                              <div className="section-label" style={{color:'var(--danger)'}}>Skill Gaps (Required)</div>
                              <div style={{display:'flex', gap:'6px', flexWrap:'wrap'}}>
                                {c.skills.missing.required.map(s => <span key={s} className="tag" style={{background:'rgba(239,68,68,0.1)', color:'var(--danger)', border:'1px solid rgba(239,68,68,0.2)'}}>{s}</span>)}
                              </div>
                            </>
                          )}
                        </div>
                        <div>
                          <div className="section-label">AI Reasoning</div>
                          <div className="reasoning-box">
                            <div style={{marginBottom:'10px'}}><strong>Strengths:</strong> {c.reasoning?.strengths || 'Strong general fit.'}</div>
                            <div><strong>Weaknesses:</strong> {c.reasoning?.weaknesses || 'No major weaknesses detected.'}</div>
                          </div>
                          
                          <div className="metrics-grid" style={{marginTop:'16px'}}>
                            <div className="metric-box">
                              <div className="metric-label">Skill Match</div>
                              <div className="metric-value">{c.metrics?.skillMatch || 0}%</div>
                            </div>
                            <div className="metric-box">
                              <div className="metric-label">Experience</div>
                              <div className="metric-value">{c.metrics?.experience || 0}/25</div>
                            </div>
                            <div className="metric-box">
                              <div className="metric-label">Semantic</div>
                              <div className="metric-value">{c.metrics?.semantic || 0}/15</div>
                            </div>
                            <div className="metric-box">
                              <div className="metric-label">Projects</div>
                              <div className="metric-value">{c.metrics?.projects || 0}/20</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
