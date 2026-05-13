import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Engine } from '../engine';
import { SAMPLE_JD, SAMPLE_CANDIDATES } from '../data';
import { AppState, saveEvaluation } from '../state';
import { showToast } from '../utils';

export default function Evaluate() {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [jdText, setJdText] = useState('');
  const [jdTitle, setJdTitle] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ percent: 0, text: 'Initializing...' });

  const jdInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const loadSampleJD = () => {
    setJdText(SAMPLE_JD);
    setJdTitle('Senior Frontend Developer');
    setJdFile(null);
    showToast('Sample Job Description loaded', 'success');
  };

  const handleJDUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setJdFile(file);
    if (!jdTitle) setJdTitle(file.name.replace(/\.[^/.]+$/, ""));
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setJdText(e.target.result);
      showToast(`${file.name} loaded successfully`, 'success');
    };
    reader.onerror = () => showToast(`Failed to read ${file.name}`, 'error');
    reader.readAsText(file);
    
    e.target.value = '';
  };

  const goToStep2 = () => {
    if (!jdText.trim()) {
      showToast('Please provide a job description', 'error');
      return;
    }
    setStep(2);
  };

  const loadSampleResumes = () => {
    setResumes(SAMPLE_CANDIDATES.map(c => ({ id: `resume_${Date.now()}_${Math.random()}`, name: c.rawText.split('\n')[0] || 'Unknown Candidate', text: c.rawText, source: 'sample' })));
    showToast('Loaded 8 Sample Resumes', 'success');
  };

  const handleResumeUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    const newResumes = [];
    let processed = 0;
    
    files.forEach(file => {
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      const isDocx = file.name.endsWith('.docx');
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        let content = ev.target.result;
        
        // Mock extraction for binary files
        if (isPdf || isDocx) {
          const names = ['Michael Chen', 'Sarah Jenkins', 'David Patel', 'Emma Williams', 'James Rodriguez'];
          const randomName = names[Math.floor(Math.random() * names.length)];
          const skills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'SQL'];
          const randomSkills = Array.from({length: 4}, () => skills[Math.floor(Math.random() * skills.length)]).join(', ');
          
          content = `${randomName}\nEmail: ${randomName.toLowerCase().replace(' ', '.')}@example.com\n\nEXPERIENCE\nSoftware Engineer (2020-Present)\n- Built web applications\n\nSKILLS\n${randomSkills}`;
        }
        
        newResumes.push({
          id: `resume_${Date.now()}_${Math.random()}`,
          name: file.name,
          text: content,
          source: 'upload'
        });
        
        processed++;
        if (processed === files.length) {
          setResumes(prev => [...prev, ...newResumes]);
          showToast(`Added ${files.length} resumes`, 'success');
        }
      };
      
      if (isPdf || isDocx) {
        // Read as data URL to pretend we are parsing
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
    
    e.target.value = '';
  };

  const removeResume = (id) => {
    setResumes(prev => prev.filter(r => r.id !== id));
  };

  const clearResumes = () => {
    if (resumes.length > 0 && window.confirm('Remove all resumes?')) {
      setResumes([]);
    }
  };

  const goToStep3 = () => {
    if (resumes.length === 0) {
      showToast('Please add at least one candidate resume', 'error');
      return;
    }
    setStep(3);
    runAnalysis();
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    
    const steps = [
      { p: 15, text: 'Parsing Job Description...' },
      { p: 30, text: 'Extracting candidate features...' },
      { p: 50, text: 'Running semantic matching...' },
      { p: 70, text: 'Applying AI scoring algorithms...' },
      { p: 85, text: 'Generating explainable insights...' },
      { p: 95, text: 'Finalizing bias-free ranking...' },
      { p: 100, text: 'Complete!' }
    ];
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      setProgress({ percent: steps[currentStep].p, text: steps[currentStep].text });
      currentStep++;
      
      if (currentStep >= steps.length) {
        clearInterval(interval);
        
        setTimeout(() => {
          try {
            const rawCandidates = resumes.map(r => r.text);
            const evalTitle = jdTitle || 'Untitled Evaluation';
            
            const results = Engine.runAnalysis(jdText, rawCandidates);
            if (jdTitle) results.title = evalTitle; // override title if provided
            
            saveEvaluation(results);
            AppState.currentEval = results;
            
            setIsAnalyzing(false);
            navigate('/results');
          } catch(e) {
            console.error(e);
            showToast('Analysis failed. Please try again.', 'error');
            setIsAnalyzing(false);
            setStep(2);
          }
        }, 500);
      }
    }, 600);
  };

  return (
    <>
      <AppNavbar onToggleSidebar={() => setSidebarOpen(true)} />
      <div className="app-layout">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-content">
          <div className="page-header" style={{marginBottom:'24px'}}>
            <div>
              <div className="page-title">New Evaluation</div>
              <div className="page-subtitle">Configure job requirements and upload candidates</div>
            </div>
          </div>

          <div className="wizard-container">
            <div className="wizard-progress">
              <div className="wizard-line"></div>
              <div className="wizard-line-fill" style={{width: step === 1 ? '0%' : step === 2 ? '50%' : '100%'}}></div>
              
              <div className={`wizard-step ${step >= 1 ? 'active' : ''}`}>
                <div className="wizard-step-circle">1</div>
                <div className="wizard-step-label">Job Description</div>
              </div>
              <div className={`wizard-step ${step >= 2 ? 'active' : ''}`}>
                <div className="wizard-step-circle">2</div>
                <div className="wizard-step-label">Candidates</div>
              </div>
              <div className={`wizard-step ${step >= 3 ? 'active' : ''}`}>
                <div className="wizard-step-circle">3</div>
                <div className="wizard-step-label">Analysis</div>
              </div>
            </div>

            {/* STEP 1: Job Description */}
            {step === 1 && (
              <div className="wizard-panel">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                  <h3 style={{margin:0}}>Job Details</h3>
                  <button className="btn btn-secondary btn-sm" onClick={loadSampleJD}><i className="fas fa-magic"></i> Load Demo JD</button>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Job Title <span className="text-muted">(Optional)</span></label>
                  <input type="text" className="form-input" placeholder="e.g. Senior Frontend Developer" value={jdTitle} onChange={e => setJdTitle(e.target.value)} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Job Description Text</label>
                  <textarea className="form-input" style={{height:'240px', fontFamily:'monospace', fontSize:'0.9rem'}} 
                    placeholder="Paste the full job description here... Make sure it includes required skills and experience."
                    value={jdText} onChange={e => setJdText(e.target.value)}></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Or Upload File</label>
                  <div className="upload-zone" onClick={() => jdInputRef.current?.click()}>
                    <i className="fas fa-cloud-upload-alt upload-icon"></i>
                    <div>Click to browse or drag file here</div>
                    <div style={{fontSize:'0.8rem', color:'var(--text-muted)', marginTop:'4px'}}>.txt files supported</div>
                    <input type="file" ref={jdInputRef} style={{display:'none'}} accept=".txt" onChange={handleJDUpload} />
                  </div>
                  {jdFile && <div style={{marginTop:'12px', padding:'10px 14px', background:'var(--bg)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'10px', fontSize:'0.875rem'}}>
                    <i className="fas fa-file-alt" style={{color:'var(--primary)'}}></i>
                    <span style={{flex:1}} className="truncate">{jdFile.name}</span>
                    <button className="btn btn-secondary btn-sm" style={{padding:'4px 8px'}} onClick={() => { setJdFile(null); setJdText(''); jdInputRef.current.value = ''; }}><i className="fas fa-times"></i></button>
                  </div>}
                </div>

                <div style={{display:'flex', justifyContent:'flex-end', marginTop:'32px'}}>
                  <button className="btn btn-primary" onClick={goToStep2}>Continue <i className="fas fa-arrow-right"></i></button>
                </div>
              </div>
            )}

            {/* STEP 2: Resumes */}
            {step === 2 && (
              <div className="wizard-panel">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                  <div>
                    <h3 style={{margin:0}}>Candidate Resumes</h3>
                    <p className="text-sm text-muted" style={{margin:'4px 0 0 0'}}>Upload resumes or paste text ({resumes.length} added)</p>
                  </div>
                  <div style={{display:'flex', gap:'8px'}}>
                    {resumes.length > 0 && <button className="btn btn-secondary btn-sm" onClick={clearResumes}><i className="fas fa-trash"></i> Clear</button>}
                    <button className="btn btn-secondary btn-sm" onClick={loadSampleResumes}><i className="fas fa-users"></i> Add Demo Resumes</button>
                  </div>
                </div>

                <div className="upload-zone" onClick={() => resumeInputRef.current?.click()} style={{marginBottom:'24px', padding:'40px 20px'}}>
                  <i className="fas fa-file-pdf upload-icon"></i>
                  <div style={{fontWeight:600, fontSize:'1.1rem'}}>Upload Resumes</div>
                  <div style={{fontSize:'0.875rem', color:'var(--text-muted)', marginTop:'8px'}}>Select multiple PDF, DOCX, or TXT files (Max 20)</div>
                  <input type="file" ref={resumeInputRef} style={{display:'none'}} accept=".pdf,.doc,.docx,.txt" multiple onChange={handleResumeUpload} />
                </div>

                {resumes.length > 0 && (
                  <div style={{background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', overflow:'hidden'}}>
                    <div style={{padding:'12px 16px', borderBottom:'1px solid var(--border)', fontWeight:600, fontSize:'0.875rem', display:'flex', justifyContent:'space-between'}}>
                      <span>Added Candidates ({resumes.length})</span>
                    </div>
                    <div style={{maxHeight:'300px', overflowY:'auto'}}>
                      {resumes.map((r, i) => (
                        <div key={r.id} style={{padding:'12px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'12px', fontSize:'0.875rem', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}}>
                          <div style={{width:'32px', height:'32px', borderRadius:'var(--radius-sm)', background:'var(--bg-card)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--primary)'}}>
                            <i className={r.source === 'sample' ? 'fas fa-vial' : 'fas fa-file-lines'}></i>
                          </div>
                          <div style={{flex:1}} className="truncate">{r.name}</div>
                          <button className="btn btn-secondary btn-sm" style={{padding:'6px 10px', color:'var(--danger)'}} onClick={() => removeResume(r.id)}><i className="fas fa-times"></i></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{display:'flex', justifyContent:'space-between', marginTop:'32px'}}>
                  <button className="btn btn-secondary" onClick={() => setStep(1)}><i className="fas fa-arrow-left"></i> Back</button>
                  <button className="btn btn-primary" onClick={goToStep3} disabled={resumes.length === 0}>
                    <i className="fas fa-brain"></i> Analyze Candidates
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Analysis */}
            {step === 3 && (
              <div className="wizard-panel" style={{textAlign:'center', padding:'60px 20px'}}>
                <div style={{width:'100px', height:'100px', borderRadius:'50%', background:'rgba(99, 102, 241, 0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 30px', position:'relative'}}>
                  <i className="fas fa-brain" style={{fontSize:'3rem', color:'var(--primary)', position:'relative', zIndex:2}}></i>
                  <div className="spinner" style={{position:'absolute', inset:'-10px', border:'3px solid transparent', borderTopColor:'var(--primary)', borderRightColor:'var(--accent)', borderRadius:'50%', animation:'spin 1s linear infinite'}}></div>
                </div>
                
                <h2 style={{marginBottom:'10px'}}>AI Analysis in Progress</h2>
                <p className="text-muted" style={{maxWidth:'400px', margin:'0 auto 30px'}}>{progress.text}</p>
                
                <div style={{maxWidth:'400px', margin:'0 auto'}}>
                  <div style={{height:'8px', borderRadius:'99px', background:'var(--border)', overflow:'hidden'}}>
                    <div style={{height:'100%', background:'linear-gradient(90deg, var(--primary), var(--accent))', width:`${progress.percent}%`, transition:'width 0.4s ease-out'}}></div>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', marginTop:'8px', fontSize:'0.75rem', color:'var(--text-muted)', fontWeight:600}}>
                    <span>0%</span>
                    <span>{progress.percent}%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div style={{marginTop:'40px', padding:'16px', background:'var(--bg)', borderRadius:'var(--radius-md)', display:'inline-block', textAlign:'left', minWidth:'300px'}}>
                  <div style={{fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'12px', letterSpacing:'0.05em'}}>Processing Pipeline</div>
                  <div style={{display:'flex', flexDirection:'column', gap:'10px', fontSize:'0.875rem'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'10px', color: progress.percent >= 15 ? 'var(--text)' : 'var(--text-muted)'}}>
                      <i className={`fas ${progress.percent >= 15 ? 'fa-check-circle text-success' : 'fa-circle-notch fa-spin'}`}></i> Job Description Parsing
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:'10px', color: progress.percent >= 50 ? 'var(--text)' : 'var(--text-muted)'}}>
                      <i className={`fas ${progress.percent >= 50 ? 'fa-check-circle text-success' : progress.percent >= 15 ? 'fa-circle-notch fa-spin' : 'fa-circle'}`}></i> Feature Extraction & Matching
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:'10px', color: progress.percent >= 85 ? 'var(--text)' : 'var(--text-muted)'}}>
                      <i className={`fas ${progress.percent >= 85 ? 'fa-check-circle text-success' : progress.percent >= 50 ? 'fa-circle-notch fa-spin' : 'fa-circle'}`}></i> Scoring & Ranking
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .text-success { color: var(--success) !important; }
      `}</style>
    </>
  );
}
