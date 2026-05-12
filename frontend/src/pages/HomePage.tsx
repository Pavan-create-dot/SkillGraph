import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-300">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-500/15 text-primary-300">✨</span>
              AI-powered adaptive learning engine
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-white">
                Upload your resume. Practice your interview. See your skill graph.
              </h1>
              <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
                SkillGraph AI parses your resume into a structured candidate profile, generates
                tailored mock interview questions, evaluates your answers, and visualizes your
                skills as an interactive graph.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
              <Link to="/register" className="btn-primary px-6 py-3 text-sm font-semibold shadow-lg shadow-primary-500/20">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary px-6 py-3 text-sm font-semibold">
                Sign In
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { title: 'Resume parsing',      subtitle: 'AI extracts your skills, experience, and gaps.' },
                { title: 'Role selection',       subtitle: 'Target any role and tailor the entire flow.' },
                { title: 'Mock interviews',      subtitle: '5 questions generated from your profile and goal.' },
                { title: 'Skill graph',          subtitle: 'Visual map of your candidate skill profile.' },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-6">
                  <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8 overflow-hidden shadow-2xl shadow-slate-950/50">
            <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-primary-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-accent-500/10 blur-3xl" />
            <div className="relative z-10">
              <div className="mb-8">
                <span className="text-xs uppercase tracking-[0.35em] text-slate-500">The flow</span>
                <h2 className="mt-4 text-3xl font-semibold text-white">From resume to skill graph in 6 steps</h2>
              </div>
              <div className="space-y-3">
                {[
                  'Sign up and create your account',
                  'Upload your resume for AI parsing',
                  'Select your target role',
                  'Complete a 5-question mock interview',
                  'Review your results and score',
                  'Explore your interactive skill graph',
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-950/80 p-3">
                    <span className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-300">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-8">
            <h3 className="text-xl font-semibold text-white mb-4">Why SkillGraph?</h3>
            <p className="text-slate-400 leading-relaxed">
              Turn your resume into a structured candidate profile, practice with AI-generated
              questions matched to your skills, and understand your strengths and gaps visually.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-8">
            <h3 className="text-xl font-semibold text-white mb-4">Who it's for</h3>
            <ul className="space-y-3 text-slate-400">
              <li>• Students preparing for job interviews</li>
              <li>• Career changers entering a new field</li>
              <li>• Developers targeting a specific role</li>
              <li>• Anyone wanting clarity on their skill profile</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-8">
            <h3 className="text-xl font-semibold text-white mb-4">Powered by AI</h3>
            <div className="grid gap-3">
              {['Resume parsing & analysis', 'Interview question generation', 'Answer evaluation & scoring'].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-950/80 border border-slate-700 p-4">
                  <p className="text-sm text-primary-300">{item}</p>
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
