import React, { useEffect, useRef, useState } from 'react';
import { resumeApi, type ResumeData } from '../api/resume.api';
import { Upload, FileText, X, Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

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
        'Unable to analyze resume. Please verify AI configuration.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <span className="text-xs uppercase tracking-widest text-indigo-700 font-bold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Resume Analyzer
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">AI Resume Analysis</h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload your resume to extract skills, evaluate placement readiness, and identify gaps for{' '}
          <strong className="text-indigo-600">{data?.targetRole || 'your target role'}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left — Upload */}
        <div className="lg:col-span-5 card space-y-5 bg-white">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Upload size={18} className="text-indigo-600" />
            Upload Resume File
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Upload a <span className="text-slate-900 font-semibold">PDF</span> or{' '}
            <span className="text-slate-900 font-semibold">TXT</span> document (max 5 MB). The AI engine will parse your skills and experience.
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
                  ? 'border-indigo-600 bg-indigo-50/50'
                  : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50',
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
                  <FileText size={32} className="text-indigo-600" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-900">{selectedFile.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {(selectedFile.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                    className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors mt-1"
                  >
                    <X size={12} /> Remove file
                  </button>
                </>
              ) : (
                <>
                  <Upload size={28} className="text-slate-400" />
                  <div className="text-center">
                    <p className="text-sm text-slate-600">
                      <span className="text-indigo-600 font-bold">Click to upload</span> or drag & drop
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">PDF, TXT · up to 5 MB</p>
                  </div>
                </>
              )}
            </div>

            {error && (
              <p className="text-xs text-rose-700 font-semibold bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isAnalyzing || !selectedFile}
              className="btn-primary w-full py-2.5 font-bold text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs flex items-center justify-center gap-2"
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
              <div className="card border-indigo-100 bg-white">
                <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  AI Placement Evaluation
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">{data.analysis.summary}</p>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card border-emerald-200 bg-emerald-50/40">
                  <h3 className="text-xs font-bold text-emerald-800 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-600" />
                    Key Strengths
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {data.analysis.strengths?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card border-rose-200 bg-rose-50/40">
                  <h3 className="text-xs font-bold text-rose-800 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-rose-600" />
                    Areas for Growth
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {data.analysis.weaknesses?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Skills */}
              <div className="card bg-white">
                <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
                  Recommended Skill Gaps — {data.targetRole}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.analysis.missingSkills?.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-full font-semibold"
                    >
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Extracted Skills */}
              {data.parsed?.skills && (
                <div className="card bg-white">
                  <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
                    Extracted Candidate Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.parsed.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-md font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card text-center py-16 border-dashed border-slate-300 bg-white">
              <FileText size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Analysis Yet</h3>
              <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto">
                Upload your resume on the left and click "Analyze Resume with AI" to generate your placement readiness evaluation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
