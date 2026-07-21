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
              AI-powered learning for ambitious learners
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-white">
                Build the right skill roadmap, track progress, and reach your goals faster.
              </h1>
              <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
                SkillGraph turns your career goal into a personalized learning path with connected skills, priority order, and progress tracking. Launch your AI-powered study plan in minutes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
              <Link to="/register" className="btn-primary px-6 py-3 text-sm font-semibold shadow-lg shadow-primary-500/20">
                Start Free
              </Link>
              <Link to="/login" className="btn-secondary px-6 py-3 text-sm font-semibold">
                Sign In
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { title: 'Personalized roadmap', subtitle: 'AI builds a custom learning path for your goal.' },
                { title: 'Interactive skill graph', subtitle: 'See prerequisites and next steps visually.' },
                { title: 'Track your progress', subtitle: 'Update mastery and status as you learn.' },
                { title: 'Goal-driven results', subtitle: 'Designed for jobs, projects, or deep learning.' },
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
                <span className="text-xs uppercase tracking-[0.35em] text-slate-500">Featured workflow</span>
                <h2 className="mt-4 text-3xl font-semibold text-white">Launch a roadmap in 4 steps</h2>
              </div>
              <div className="space-y-4">
                {[
                  'Define your target skill or career goal',
                  'Pick your experience level and time commitment',
                  'Generate a connected skill graph with AI',
                  'Track progress on each skill until completion',
                ].map((step) => (
                  <div key={step} className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-4">
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
              Convert uncertainty into a clear learning map. SkillGraph makes it easy to understand what to learn next, which skills depend on each other, and how far you’ve come.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-8">
            <h3 className="text-xl font-semibold text-white mb-4">Who it’s for</h3>
            <ul className="space-y-3 text-slate-400">
              <li>• Career changers building in-demand skills</li>
              <li>• Developers developing a roadmap for growth</li>
              <li>• Students learning with a goal in mind</li>
              <li>• Teams aligning training with outcomes</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-8">
            <h3 className="text-xl font-semibold text-white mb-4">Trusted by learners</h3>
            <div className="grid gap-3">
              {['Faster learning', 'Clear skill paths', 'Better retention'].map((item) => (
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
