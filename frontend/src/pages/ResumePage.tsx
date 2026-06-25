import React, { useEffect, useRef, useState } from 'react';
import { resumeApi, type ResumeData } from '../api/resume.api';
import { Upload, FileText, X, Loader2 } from 'lucide-react';

const ResumePage: React.FC = () => {
  const [data, setData] = useState<ResumeData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    resumeApi.getResume()
      .then((res) => { if (res.data) setData(res.data); })
      .catch(() => setError('Failed to load resume profile'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'txt'].includes(ext ?? '')) {
      setError('Only PDF and TXT files are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be under 5 MB.');
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await resumeApi.analyzeResumeFile(selectedFile);
      if (response.data) setData(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Unable to analyze resume. Please verify AI API configuration.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-7">
        <span className="text-xs uppercase tracking-widest text-primary-400 font-semibold bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
          Resume Analyzer
        </span>
        <h1 className="text-2xl font-bold text-white mt-3">AI Resume Analysis</h1>
        <p className="text-slate-400 text-sm mt-1">
          Upload your resume to extract skills, evaluate placement readiness, and identify gaps for{' '}
          <strong className="text-primary-300">{data?.targetRole || 'your target role'}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left — Upload */}
        <div className="lg:col-span-5 card space-y-5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Upload size={16} className="text-primary-400" />
            Upload Resume
          </h2>
          <p className="text-xs text-slate-400">
            Upload a <span className="text-slate-200 font-medium">PDF</span> or{' '}
            <span className="text-slate-200 font-medium">TXT</span> file (max 5 MB). The AI will
            extract your skills, experience, and generate an analysis.
          </p>

          <form onSubmit={handleAnalyze} className="space-y-4">
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={[
                'flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all',
                dragOver
                  ? 'border-primary-500 bg-primary-500/5'
                  : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/40',
              ].join(' ')}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
              />
              {selectedFile ? (
                <>
                  <FileText size={32} className="text-primary-400" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-200">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {(selectedFile.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors mt-1"
                  >
                    <X size={12} /> Remove file
                  </button>
                </>
              ) : (
                <>
                  <Upload size={28} className="text-slate-600" />
                  <div className="text-center">
                    <p className="text-sm text-slate-400">
                      <span className="text-primary-400 font-medium">Click to upload</span> or drag & drop
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">PDF, TXT · up to 5 MB</p>
                  </div>
                </>
              )}
            </div>

            {error && (
              <p className="text-xs text-rose-400 font-medium bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isAnalyzing || !selectedFile}
              className="btn-primary w-full py-3 font-semibold text-sm bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing with Gemini AI…
                </>
              ) : (
                'Analyze Resume with AI'
              )}
            </button>
          </form>
        </div>

        {/* Right — Results */}
        <div className="lg:col-span-7 space-y-5">
          {data?.analysis ? (
            <>
              {/* Summary */}
              <div className="card border-primary-500/30 bg-slate-900/90">
                <h3 className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2">
                  AI Placement Overview
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed">{data.analysis.summary}</p>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card border-emerald-500/30 bg-emerald-950/10">
                  <h3 className="text-xs font-semibold text-emerald-400 mb-3 uppercase tracking-wider">
                    Key Strengths
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {data.analysis.strengths?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card border-rose-500/30 bg-rose-950/10">
                  <h3 className="text-xs font-semibold text-rose-400 mb-3 uppercase tracking-wider">
                    Areas for Growth
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {data.analysis.weaknesses?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-400 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Skills */}
              <div className="card">
                <h3 className="text-xs font-semibold text-accent-400 mb-3 uppercase tracking-wider">
                  Skill Gaps — {data.targetRole}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.analysis.missingSkills?.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs bg-accent-500/10 border border-accent-500/30 text-accent-300 px-3 py-1 rounded-full font-medium"
                    >
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Extracted Skills */}
              {data.parsed?.skills && (
                <div className="card">
                  <h3 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                    Extracted Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.parsed.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-700/60 border border-slate-600 text-slate-300 px-3 py-1 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvement Tips */}
              <div className="card">
                <h3 className="text-xs font-semibold text-white mb-3 uppercase tracking-wider">
                  Recommended Actions
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
            <div className="card text-center py-16 border-dashed border-slate-700 bg-slate-900/50">
              <FileText size={40} className="mx-auto text-slate-700 mb-3" />
              <h3 className="text-base font-semibold text-slate-300">No Analysis Yet</h3>
              <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto">
                Upload your resume on the left and click "Analyze Resume with AI" to generate your placement readiness report.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
