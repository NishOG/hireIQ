// ===================================================
// HireIQ — AI Analysis Engine
// All 14 Features Implemented in Pure JavaScript
// ===================================================

import { SKILL_SYNONYMS, JD_SECTION_PATTERNS, RESUME_SECTION_PATTERNS } from './data.js';

export const Engine = (() => {

  // ---- FEATURE 7: Bias Reduction — Strip identifying info ----
  function stripBiasInfo(text) {
    let cleaned = text;
    // Remove email addresses
    cleaned = cleaned.replace(/[\w.-]+@[\w.-]+\.\w+/gi, '[EMAIL]');
    // Remove phone numbers
    cleaned = cleaned.replace(/(\+?[\d\s\-().]{7,15})/g, (m) => m.trim().length > 7 ? '[PHONE]' : m);
    // Remove LinkedIn/GitHub URLs
    cleaned = cleaned.replace(/https?:\/\/[^\s]+/gi, '[URL]');
    // Remove gender pronouns
    const pronouns = /\b(he|she|his|her|him|hers|himself|herself)\b/gi;
    cleaned = cleaned.replace(pronouns, '[PRONOUN]');
    return cleaned;
  }

  // ---- FEATURE 1: Resume Parsing Engine ----
  function parseResume(rawText, index) {
    if (!rawText || rawText.trim().length < 30) {
      return {
        id: `candidate_${index + 1}`,
        rawText: rawText || '',
        name: `Candidate ${index + 1}`,
        isInvalid: true,
        invalidReason: rawText?.trim().length === 0 ? 'Empty resume submitted' : 'Resume too short or unreadable',
        skills: [],
        experience: [],
        projects: [],
        education: [],
        yearsExperience: 0,
        sectionCount: 0
      };
    }

    const lines = rawText.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const fullText = rawText.toLowerCase();

    // Extract name from first non-empty line
    const nameLine = lines[0] || `Candidate ${index + 1}`;
    const name = nameLine.length < 60 ? nameLine : `Candidate ${index + 1}`;

    // Extract sections
    const sections = extractSections(lines);

    // Extract skills
    const skills = extractSkills(sections.skills.join(' ') + ' ' + rawText);

    // Extract experience
    const experienceData = extractExperience(sections.experience);

    // Extract projects
    const projects = sections.projects;

    // Extract education
    const education = sections.education;

    // Calculate years of experience
    const yearsExperience = calculateYearsExperience(sections.experience.join(' ') + ' ' + rawText);

    const sectionCount = [sections.skills.length, sections.experience.length, sections.projects.length, sections.education.length].filter(l => l > 0).length;

    return {
      id: `candidate_${index + 1}`,
      rawText,
      name,
      isInvalid: false,
      skills,
      experience: experienceData,
      experienceText: sections.experience.join(' '),
      projectText: sections.projects.join(' '),
      projects,
      education,
      yearsExperience,
      sectionCount,
      fullText: fullText
    };
  }

  function extractSections(lines) {
    const sections = { skills: [], experience: [], projects: [], education: [], other: [] };
    let currentSection = 'other';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const upperLine = line.toUpperCase();

      if (RESUME_SECTION_PATTERNS.skills.test(line) && line.length < 40) {
        currentSection = 'skills'; continue;
      } else if (RESUME_SECTION_PATTERNS.experience.test(line) && line.length < 40) {
        currentSection = 'experience'; continue;
      } else if (RESUME_SECTION_PATTERNS.projects.test(line) && line.length < 40) {
        currentSection = 'projects'; continue;
      } else if (RESUME_SECTION_PATTERNS.education.test(line) && line.length < 40) {
        currentSection = 'education'; continue;
      }

      if (sections[currentSection]) sections[currentSection].push(line);
      else sections.other.push(line);
    }

    return sections;
  }

  function extractSkills(skillsText) {
    const allKnownSkills = [
      'react', 'react.js', 'reactjs', 'typescript', 'javascript', 'js', 'es6', 'es6+',
      'node.js', 'nodejs', 'express', 'next.js', 'nextjs', 'vue', 'angular',
      'css', 'css3', 'html', 'html5', 'tailwind', 'tailwind css', 'bootstrap', 'sass', 'scss',
      'rest api', 'rest apis', 'graphql', 'apollo',
      'git', 'github', 'gitlab',
      'python', 'django', 'flask', 'fastapi',
      'aws', 'docker', 'kubernetes', 'ci/cd', 'github actions',
      'mongodb', 'postgresql', 'mysql', 'redis', 'sql',
      'redux', 'redux toolkit', 'zustand', 'mobx',
      'jest', 'cypress', 'testing', 'webpack', 'vite',
      'typescript', 'storybook', 'figma',
      'performance optimization', 'web accessibility',
      'linux', 'bash', 'java', 'c++', 'rust',
      'firebase', 'supabase', 'vercel', 'netlify'
    ];

    const text = skillsText.toLowerCase();
    const found = [];

    for (const skill of allKnownSkills) {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(text) && !found.some(f => f.toLowerCase() === skill.toLowerCase())) {
        found.push(skill);
      }
    }

    // Also extract comma-separated items from skills section
    const commaItems = skillsText.split(/[,\n|•·]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 40);
    for (const item of commaItems) {
      const clean = item.replace(/^[-*•·]\s*/, '').trim();
      if (clean.length > 1 && clean.length < 35 && !found.some(f => f.toLowerCase() === clean.toLowerCase())) {
        found.push(clean);
      }
    }

    return [...new Set(found)].slice(0, 30);
  }

  function extractExperience(experienceLines) {
    const experiences = [];
    const yearPattern = /(\d{4})\s*[-–—]\s*(\d{4}|present|current)/gi;

    for (const line of experienceLines) {
      const yearMatch = yearPattern.exec(line);
      if (yearMatch || line.match(/developer|engineer|designer|analyst|manager|architect/i)) {
        experiences.push({
          title: line.substring(0, 100),
          years: yearMatch ? [yearMatch[1], yearMatch[2]] : []
        });
      }
    }
    return experiences;
  }

  function calculateYearsExperience(text) {
    let totalYears = 0;
    const patterns = [
      /(\d+)\+?\s*years?\s+(?:of\s+)?(?:professional\s+)?(?:frontend|backend|full.?stack|development|experience)/gi,
      /(\d{4})\s*[-–—]\s*(\d{4}|present|current)/gi
    ];

    // Try to find explicit year mention
    const explicitMatch = text.match(/(\d+)\+?\s*years?\s+(?:of\s+)?(?:professional|relevant|work|total)?\s*experience/i);
    if (explicitMatch) return parseInt(explicitMatch[1]);

    // Calculate from date ranges
    const dateRangePattern = /(\d{4})\s*[-–—]\s*(\d{4}|present|current)/gi;
    let match;
    let ranges = [];
    while ((match = dateRangePattern.exec(text)) !== null) {
      const start = parseInt(match[1]);
      const end = match[2].toLowerCase() === 'present' || match[2].toLowerCase() === 'current'
        ? new Date().getFullYear()
        : parseInt(match[2]);
      if (start >= 1990 && end >= start) {
        ranges.push(end - start);
      }
    }

    if (ranges.length > 0) {
      // Sum unique ranges (approximate)
      return Math.min(ranges.reduce((a, b) => a + b, 0), 20);
    }

    return 0;
  }

  // ---- FEATURE 2: JD Analyzer ----
  function analyzeJD(jdText) {
    if (!jdText || jdText.trim().length < 20) return null;

    const lines = jdText.split('\n').map(l => l.trim()).filter(Boolean);
    const fullText = jdText.toLowerCase();

    const requiredSkills = [];
    const optionalSkills = [];
    const roleKeywords = [];
    let experienceYears = 0;

    // Extract experience years
    const expMatch = jdText.match(/(\d+)\+?\s*years?/i);
    if (expMatch) experienceYears = parseInt(expMatch[1]);

    // Parse sections
    let inRequired = false, inOptional = false;
    for (const line of lines) {
      const lline = line.toLowerCase();

      // Detect section context
      if (JD_SECTION_PATTERNS.requiredKeywords.some(kw => lline.includes(kw))) {
        inRequired = true; inOptional = false;
      }
      if (JD_SECTION_PATTERNS.optionalKeywords.some(kw => lline.includes(kw))) {
        inOptional = true; inRequired = false;
      }

      // Extract bullet items
      const bulletMatch = line.match(/^[-*•·]\s*(.+)/);
      if (bulletMatch) {
        const item = bulletMatch[1].trim();
        // Extract skill from item (first part before parens/comma)
        const skillName = item.split(/[,(]/)[0].trim();

        if (skillName.length < 50 && skillName.length > 1) {
          // Check if it's a skill (has a known tech word)
          const isTech = /react|typescript|javascript|css|node|python|api|git|docker|aws|sql|mongo|vue|angular|java|swift|kotlin|rust|go|redis/i.test(skillName);

          if (inOptional) {
            optionalSkills.push(skillName);
          } else if (inRequired || isTech) {
            requiredSkills.push(skillName);
          }
        }
      }
    }

    // Fallback: extract skills from the whole text
    if (requiredSkills.length === 0) {
      const extracted = extractSkills(jdText);
      extracted.slice(0, 8).forEach(s => requiredSkills.push(s));
      extracted.slice(8).forEach(s => optionalSkills.push(s));
    }

    // Extract role keywords
    const roleWords = ['frontend', 'backend', 'full-stack', 'ui', 'ux', 'api', 'mobile', 'responsive', 'performance', 'architect', 'component', 'testing', 'cloud'];
    for (const word of roleWords) {
      if (fullText.includes(word)) roleKeywords.push(word);
    }

    return {
      rawText: jdText,
      requiredSkills: [...new Set(requiredSkills)].slice(0, 12),
      optionalSkills: [...new Set(optionalSkills)].slice(0, 10),
      experienceYears,
      roleKeywords: [...new Set(roleKeywords)].slice(0, 8)
    };
  }

  // ---- FEATURE 3: Semantic Skill Matching ----
  function matchSkills(candidateSkills, requiredSkills, optionalSkills) {
    const normalizeSkill = s => s.toLowerCase().trim();
    const candidateNorm = candidateSkills.map(normalizeSkill);

    function findMatch(reqSkill) {
      const reqNorm = normalizeSkill(reqSkill);

      // Exact match
      if (candidateNorm.includes(reqNorm)) return 'exact';

      // Synonym map match
      const synonyms = SKILL_SYNONYMS[reqNorm] || [];
      for (const syn of synonyms) {
        if (candidateNorm.includes(syn)) return 'partial';
      }

      // Check reverse synonyms
      for (const candSkill of candidateNorm) {
        const candSynonyms = SKILL_SYNONYMS[candSkill] || [];
        if (candSynonyms.includes(reqNorm)) return 'partial';
      }

      // Substring match (partial)
      for (const candSkill of candidateNorm) {
        if (reqNorm.includes(candSkill) || candSkill.includes(reqNorm)) return 'partial';
      }

      return 'missing';
    }

    const exactMatches = [];
    const partialMatches = [];
    const missingSkills = [];

    for (const req of requiredSkills) {
      const result = findMatch(req);
      if (result === 'exact') exactMatches.push(req);
      else if (result === 'partial') partialMatches.push(req);
      else missingSkills.push(req);
    }

    const optionalMatches = [];
    for (const opt of optionalSkills) {
      const result = findMatch(opt);
      if (result !== 'missing') optionalMatches.push(opt);
    }

    const totalRequired = requiredSkills.length || 1;
    const skillMatchScore = Math.round(((exactMatches.length + partialMatches.length * 0.6) / totalRequired) * 100);

    return {
      exactMatches,
      partialMatches,
      missingSkills,
      optionalMatches,
      skillMatchScore: Math.min(skillMatchScore, 100)
    };
  }

  // ---- FEATURE 4: AI Scoring System ----
  function computeScore(candidate, jdData) {
    if (candidate.isInvalid) return { total: 0, breakdown: { skill: 0, experience: 0, project: 0, semantic: 0 } };

    const skillMatch = matchSkills(candidate.skills, jdData.requiredSkills, jdData.optionalSkills);

    // Skill Match Score (40%)
    const skillScore = skillMatch.skillMatchScore;

    // Experience Relevance (25%)
    const requiredYears = jdData.experienceYears || 2;
    const candidateYears = candidate.yearsExperience || 0;
    let expScore;
    if (candidateYears >= requiredYears * 2) expScore = 100;
    else if (candidateYears >= requiredYears) expScore = 85 + Math.min((candidateYears - requiredYears) * 5, 15);
    else if (candidateYears >= requiredYears * 0.7) expScore = 60 + ((candidateYears / requiredYears) * 25);
    else if (candidateYears > 0) expScore = Math.max((candidateYears / requiredYears) * 60, 10);
    else expScore = 5;
    expScore = Math.min(Math.round(expScore), 100);

    // Project Relevance (20%)
    const projectText = (candidate.projectText || '').toLowerCase();
    const roleKeywords = jdData.roleKeywords || [];
    const requiredInProject = jdData.requiredSkills.filter(s => projectText.includes(s.toLowerCase()));
    const roleWordsInProject = roleKeywords.filter(k => projectText.includes(k.toLowerCase()));
    const projectScore = Math.min(Math.round(
      ((requiredInProject.length / Math.max(jdData.requiredSkills.length, 1)) * 60) +
      ((roleWordsInProject.length / Math.max(roleKeywords.length, 1)) * 40)
    ), 100);

    // Semantic Similarity (15%) — text overlap analysis
    const jdWords = new Set(jdData.rawText.toLowerCase().split(/\W+/).filter(w => w.length > 3));
    const candidateWords = new Set((candidate.rawText || '').toLowerCase().split(/\W+/).filter(w => w.length > 3));
    const overlap = [...jdWords].filter(w => candidateWords.has(w)).length;
    const semanticScore = Math.min(Math.round((overlap / Math.max(jdWords.size, 1)) * 200), 100);

    // Weighted total
    const total = Math.round(
      (skillScore * 0.40) +
      (expScore * 0.25) +
      (projectScore * 0.20) +
      (semanticScore * 0.15)
    );

    return {
      total: Math.min(total, 100),
      breakdown: {
        skill: skillScore,
        experience: expScore,
        project: projectScore,
        semantic: semanticScore
      },
      skillMatch
    };
  }

  // ---- FEATURE 10: Confidence Score ----
  function computeConfidence(candidate) {
    if (candidate.isInvalid) return 0;

    let score = 0;
    const text = candidate.rawText || '';

    // Resume length
    const wordCount = text.split(/\s+/).length;
    if (wordCount > 400) score += 0.3;
    else if (wordCount > 200) score += 0.2;
    else if (wordCount > 100) score += 0.1;

    // Section count
    score += candidate.sectionCount * 0.15;

    // Skills count
    const skillCount = candidate.skills.length;
    if (skillCount > 10) score += 0.25;
    else if (skillCount > 5) score += 0.15;
    else if (skillCount > 2) score += 0.05;

    // Experience entries
    if (candidate.experience.length > 1) score += 0.15;
    else if (candidate.experience.length > 0) score += 0.08;

    // Years experience
    if (candidate.yearsExperience > 0) score += 0.1;

    return Math.min(Math.round(score * 100) / 100, 1.0);
  }

  // ---- FEATURE 11: Clustering ----
  function classifyCandidate(score) {
    if (score >= 70) return 'Strong Fit';
    if (score >= 45) return 'Moderate Fit';
    return 'Weak Fit';
  }

  function clusterCandidates(scored) {
    // Determine specialty cluster
    const getSpecialtyCluster = (candidate) => {
      const text = (candidate.rawText || '').toLowerCase();
      const skills = candidate.skills.map(s => s.toLowerCase());
      const frontendSkills = ['react', 'css', 'html', 'vue', 'angular', 'tailwind', 'sass', 'ui', 'frontend'];
      const backendSkills = ['node', 'python', 'django', 'flask', 'java', 'go', 'rust', 'sql', 'backend', 'api'];

      let frontendCount = frontendSkills.filter(s => skills.some(sk => sk.includes(s)) || text.includes(s)).length;
      let backendCount = backendSkills.filter(s => skills.some(sk => sk.includes(s)) || text.includes(s)).length;

      // Fresher detection
      if (candidate.yearsExperience <= 1 || text.includes('fresher') || text.includes('bootcamp') || text.includes('intern')) {
        return 'Fresher';
      }
      if (frontendCount > backendCount + 1) return 'Frontend-Heavy';
      if (backendCount > frontendCount + 1) return 'Backend-Leaning';
      return 'Full Stack';
    };

    return scored.map(s => ({
      ...s,
      cluster: getSpecialtyCluster(s.candidate)
    }));
  }

  // ---- FEATURE 6: Explainable AI Reasoning ----
  function generateExplanation(candidate, scoringResult, jdData) {
    if (candidate.isInvalid) {
      return {
        strengths: [],
        weaknesses: ['Resume is empty or unreadable'],
        reason: `Invalid resume: ${candidate.invalidReason}. Cannot evaluate candidate.`
      };
    }

    const { breakdown, skillMatch } = scoringResult;
    const strengths = [];
    const weaknesses = [];

    // Analyze skill strengths
    if (skillMatch.exactMatches.length > 0) {
      strengths.push(`Strong match on ${skillMatch.exactMatches.slice(0, 3).join(', ')}`);
    }
    if (skillMatch.partialMatches.length > 0) {
      strengths.push(`Partial match on related skills: ${skillMatch.partialMatches.slice(0, 2).join(', ')}`);
    }
    if (skillMatch.optionalMatches.length > 0) {
      strengths.push(`Bonus skills: ${skillMatch.optionalMatches.slice(0, 2).join(', ')}`);
    }

    // Experience strength/weakness
    const reqYears = jdData.experienceYears || 2;
    if (candidate.yearsExperience >= reqYears) {
      strengths.push(`${candidate.yearsExperience} years experience meets or exceeds ${reqYears}+ year requirement`);
    } else if (candidate.yearsExperience > 0) {
      weaknesses.push(`Only ${candidate.yearsExperience} years experience vs ${reqYears}+ required`);
    } else {
      weaknesses.push('Years of experience unclear from resume');
    }

    // Project strength
    if (breakdown.project >= 60) {
      strengths.push('Projects demonstrate direct relevance to the role');
    } else if (breakdown.project < 30) {
      weaknesses.push('Projects lack demonstrated relevance to this role');
    }

    // Missing skills
    if (skillMatch.missingSkills.length > 0) {
      weaknesses.push(`Missing required skills: ${skillMatch.missingSkills.slice(0, 3).join(', ')}`);
    }

    // Low confidence
    if (breakdown.skill < 40) {
      weaknesses.push('Limited skill overlap with job requirements');
    }

    // Generate final reason
    const scoreTotal = scoringResult.total;
    let reason = '';

    if (scoreTotal >= 80) {
      reason = `${candidate.name} is an excellent fit with strong matches on ${skillMatch.exactMatches.slice(0,2).join(' and ')}. `;
      if (candidate.yearsExperience >= reqYears) reason += `${candidate.yearsExperience} years of experience exceeds the requirement. `;
      if (skillMatch.missingSkills.length > 0) reason += `Minor gap in ${skillMatch.missingSkills[0]}.`;
      else reason += 'No significant skill gaps identified.';
    } else if (scoreTotal >= 60) {
      reason = `${candidate.name} is a moderate fit with relevant experience in ${skillMatch.exactMatches.slice(0,2).join(' and ') || 'some areas'}. `;
      if (skillMatch.missingSkills.length > 0) reason += `Key gaps include ${skillMatch.missingSkills.slice(0,2).join(' and ')}. `;
      reason += 'Would benefit from upskilling in missing areas.';
    } else {
      reason = `${candidate.name} currently lacks key requirements for this role. `;
      if (skillMatch.missingSkills.length > 0) reason += `Critical missing skills: ${skillMatch.missingSkills.slice(0,3).join(', ')}. `;
      reason += 'Not recommended for this specific position.';
    }

    return { strengths, weaknesses, reason };
  }

  // ---- FEATURE 8: Skill Gap Detection ----
  function detectSkillGaps(candidate, jdData, skillMatch) {
    const gaps = [];
    for (const missing of skillMatch.missingSkills) {
      let suggestion = '';
      const m = missing.toLowerCase();
      if (m.includes('typescript') || m.includes('ts')) {
        suggestion = 'Take a TypeScript fundamentals course and convert a JS project to TS';
      } else if (m.includes('react')) {
        suggestion = 'Build 2-3 React projects including one with hooks and state management';
      } else if (m.includes('api') || m.includes('rest')) {
        suggestion = 'Practice REST API integration using fetch/axios in a real project';
      } else if (m.includes('test') || m.includes('jest')) {
        suggestion = 'Learn Jest and write unit tests for an existing project';
      } else if (m.includes('docker')) {
        suggestion = 'Complete Docker\'s official getting started guide and containerize a project';
      } else if (m.includes('git')) {
        suggestion = 'Practice Git workflows: branching, merging, pull requests on GitHub';
      } else {
        suggestion = `Gain hands-on experience with ${missing} through a project or course`;
      }
      gaps.push({ skill: missing, suggestion });
    }
    return gaps;
  }

  // ---- FEATURE 9: Comparative Analysis ----
  function compareTopCandidates(rankedResults) {
    const top = rankedResults.slice(0, 3);
    const comparisons = [];

    for (let i = 0; i < top.length - 1; i++) {
      const a = top[i], b = top[i + 1];
      const reasons = [];

      if (a.score > b.score) {
        const diff = a.score - b.score;
        reasons.push(`${a.name} ranks #${i+1} over #${i+2} with a ${diff}-point lead.`);

        if (a.breakdown.skill > b.breakdown.skill) {
          reasons.push(`Stronger skill match (${a.breakdown.skill}% vs ${b.breakdown.skill}%).`);
        }
        if (a.yearsExperience > b.yearsExperience) {
          reasons.push(`More experience (${a.yearsExperience}y vs ${b.yearsExperience}y).`);
        }
        if (a.breakdown.project > b.breakdown.project) {
          reasons.push(`More relevant project portfolio.`);
        }
      }

      comparisons.push({
        candidateA: a.name,
        candidateB: b.name,
        explanation: reasons.join(' ')
      });
    }

    return comparisons;
  }

  // ---- FEATURE 5: Full Ranking System ----
  function rankCandidates(parsed, jdData) {
    // Score all candidates
    const scored = parsed.map(candidate => {
      const scoring = computeScore(candidate, jdData);
      const confidence = computeConfidence(candidate);
      const explanation = generateExplanation(candidate, scoring, jdData);
      const skillGaps = detectSkillGaps(candidate, jdData, scoring.skillMatch || { missingSkills: [] });
      const classification = classifyCandidate(scoring.total);

      return {
        candidate,
        name: candidate.name,
        score: scoring.total,
        confidence,
        classification,
        breakdown: scoring.breakdown,
        skillMatch: scoring.skillMatch || { exactMatches: [], partialMatches: [], missingSkills: [], optionalMatches: [] },
        explanation,
        skillGaps,
        yearsExperience: candidate.yearsExperience,
        decision: 'None'
      };
    });

    // Sort descending, tie-break by experience then project relevance
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.yearsExperience !== a.yearsExperience) return b.yearsExperience - a.yearsExperience;
      return b.breakdown.project - a.breakdown.project;
    });

    // Add ranks
    scored.forEach((s, i) => { s.rank = i + 1; });

    // Mark top 5-8 as shortlisted
    const shortlistCount = Math.min(Math.max(scored.filter(s => s.score > 0).length, 0), 8);
    scored.slice(0, shortlistCount).forEach(s => { if (s.score >= 30) s.shortlisted = true; });

    // Cluster
    const clustered = clusterCandidates(scored);

    // Comparative analysis
    const comparisons = compareTopCandidates(clustered);

    return { ranked: clustered, comparisons };
  }

  // ---- MAIN: Run Full Analysis ----
  function runAnalysis(jdText, candidateTexts) {
    const jdData = analyzeJD(jdText);
    if (!jdData) throw new Error('Invalid Job Description');

    const parsed = candidateTexts.map((text, i) => parseResume(text, i));
    const { ranked, comparisons } = rankCandidates(parsed, jdData);

    const validCandidates = ranked.filter(r => !r.candidate.isInvalid);
    const avgScore = validCandidates.length > 0
      ? Math.round(validCandidates.reduce((a, b) => a + b.score, 0) / validCandidates.length)
      : 0;

    return {
      id: `eval_${Date.now()}`,
      title: extractJDTitle(jdText),
      date: new Date().toISOString(),
      jdData,
      ranked,
      comparisons,
      stats: {
        total: parsed.length,
        valid: validCandidates.length,
        avgScore,
        topScore: ranked[0]?.score || 0,
        strongFit: ranked.filter(r => r.classification === 'Strong Fit').length,
        moderateFit: ranked.filter(r => r.classification === 'Moderate Fit').length,
        weakFit: ranked.filter(r => r.classification === 'Weak Fit').length
      }
    };
  }

  function extractJDTitle(jdText) {
    const lines = jdText.trim().split('\n').filter(l => l.trim());
    for (const line of lines.slice(0, 5)) {
      if (line.trim().length > 5 && line.trim().length < 80 &&
          /developer|engineer|designer|manager|analyst|architect/i.test(line)) {
        return line.trim();
      }
    }
    return lines[0]?.trim().substring(0, 60) || 'Job Evaluation';
  }

  return { runAnalysis, analyzeJD, parseResume, matchSkills };
})();
