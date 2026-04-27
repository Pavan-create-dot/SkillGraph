import React, { useEffect, useState } from 'react';
import { resumeApi, type ResumeData } from '../api/resume.api';

const ResumePage: React.FC = () => {
  const [data, setData] = useState<ResumeData | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await resumeApi.getResume();
        if (response.data) {
          setData(response.data);
          setResumeText(response.data.resumeText || '');
        }
      } catch {
        setError('Failed to load resume profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim() || resumeText.length < 50) {
      setError('Please paste or enter at least 50 characters of resume text.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await resumeApi.analyzeResume(resumeText);
      if (response.data) {
        setData(response.data);
      }
    } catch {
      setError('Unable to analyze resume. Please verify AI API configuration.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary-400 font-semibold bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
              Module 3
            </span>
            <h1 className="text-3xl font-bold text-white mt-3">AI Resume Analyzer</h1>
            <p className="text-slate-400 text-sm mt-1">
              Extract technical skills, evaluate placement strengths, and identify missing keywords for target role: <strong className="text-primary-300">{data?.targetRole || 'Full-Stack Developer'}</strong>.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Resume Input Form */}
        <div className="lg:col-span-5 card space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📄</span> Resume Text Input
          </h2>
          <p className="text-xs text-slate-400">
            Paste your raw resume text below. Our Gemini AI model will extract your structured profile and evaluate placement readiness.
          </p>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <textarea
              rows={16}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume text here (Summary, Skills, Experience, Education, Projects)..."
              className="input-field font-mono text-xs leading-relaxed resize-none"
              required
            />

            {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={isAnalyzing}
              className="btn-primary w-full py-3 font-semibold text-sm bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 shadow-md flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing with Gemini AI…
                </>
              ) : (
                '🤖 Analyze Resume with AI'
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Parsed Results & AI Feedback */}
        <div className="lg:col-span-7 space-y-6">
          {data?.analysis ? (
            <>
              {/* Summary & Key Stats */}
              <div className="card border-primary-500/30 bg-slate-900/90">
                <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-2">
                  AI Placement Overview
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed font-medium">
                  {data.analysis.summary}
                </p>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="card border-emerald-500/30 bg-emerald-950/10">
                  <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
                    <span>✅</span> Key Strengths
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {data.analysis.strengths?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="card border-rose-500/30 bg-rose-950/10">
                  <h3 className="text-sm font-bold text-rose-400 mb-3 flex items-center gap-1.5">
                    <span>⚠️</span> Areas for Growth
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {data.analysis.weaknesses?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Skills */}
              <div className="card">
                <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                  <span>⚡</span> Missing Skills for {data.targetRole}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.analysis.missingSkills?.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full font-medium"
                    >
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Extracted Technical Skills */}
              {data.parsed?.skills && (
                <div className="card">
                  <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                    <span>🧠</span> Extracted Resume Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.parsed.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Improvement Tips */}
              <div className="card border-slate-700 bg-slate-900/90">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span>💡</span> Recommended Improvement Actions
                </h3>
                <ul className="space-y-2.5">
                  {data.analysis.suggestions?.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="card text-center py-16 border-dashed border-slate-700">
              <div className="text-4xl mb-3">📄</div>
              <h3 className="text-base font-bold text-white">No Resume Analyzed Yet</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                Paste your resume text on the left and click "Analyze Resume with AI" to generate your placement readiness breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
