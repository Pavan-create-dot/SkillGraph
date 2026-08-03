import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-xs">✨</span>
              AI-Powered Candidate Preparation Platform
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-slate-900 tracking-tight">
                Upload your resume. Practice mock interviews. Track your growth.
              </h1>
              <p className="text-slate-600 max-w-2xl text-lg leading-relaxed font-normal">
                SkillGraph AI evaluates your resume, generates role-first mock interview questions, scores your answers, and visualizes your progress over time with clean growth graphs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
              <Link to="/register" className="btn-primary px-8 py-3.5 text-sm font-bold shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary px-8 py-3.5 text-sm font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 rounded-xl">
                Sign In
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { title: 'Resume parsing', subtitle: 'AI extracts your skills, experience, and gap analysis.' },
                { title: 'Role selection', subtitle: 'Target any engineering role and tailor your prep.' },
                { title: 'Mock interviews', subtitle: 'Practice Technical, System Design, and Behavioral rounds.' },
                { title: 'Growth graphs', subtitle: 'Simple 2-graph overview tracking your score gains.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-3xl border border-slate-200 bg-white p-8 overflow-hidden shadow-sm">
            <div className="relative z-10">
              <div className="mb-6">
                <span className="text-xs uppercase font-bold tracking-[0.25em] text-indigo-700">The Candidate Journey</span>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">How SkillGraph Works</h2>
              </div>
              <div className="space-y-3">
                {[
                  'Create your candidate profile',
                  'Upload your resume file (.pdf, .txt)',
                  'Confirm your target software role',
                  'Complete AI mock interview rounds',
                  'Receive instant score evaluation',
                  'Track score growth on 2 simple graphs',
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-800 font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Why SkillGraph?</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Designed for candidates wanting a clean, straightforward way to practice interviews and track performance improvements without clutter or over-complication.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Built for Placement Prep</h3>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>• Software engineers targeting interviews</li>
              <li>• Role-specific practice (Technical, Behavioral)</li>
              <li>• Instant AI scoring and model answers</li>
              <li>• 2-graph score progress visualization</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Google Gemini AI Engine</h3>
            <div className="grid gap-2.5">
              {['Resume parsing & gap analysis', 'Tailored interview question generation', 'Per-answer scoring & feedback'].map((item) => (
                <div key={item} className="rounded-xl bg-indigo-50 border border-indigo-100 p-3">
                  <p className="text-xs font-bold text-indigo-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
