import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRoadmapStatus } from '../hooks/useRoadmap';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: roadmapStatus, isLoading: statusLoading } = useRoadmapStatus();

  const hasRoadmap = roadmapStatus?.hasRoadmap ?? false;
  const topic = roadmapStatus?.topic ?? '';

  return (
    <div className="space-y-8">
      {/* ─── Hero / Header Section ────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 p-8 sm:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="relative z-10 max-w-2xl">
          <span className="text-primary-400 text-xs font-semibold uppercase tracking-wider bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
            {hasRoadmap ? '🗺️ Roadmap Active' : '✨ Let\'s Get Started'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-3">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {hasRoadmap
              ? <>Your personalized roadmap for <span className="font-semibold text-primary-400">"{topic}"</span> is ready. Keep learning!</>
              : "Tell us what you want to learn and we'll build a personalized skill graph just for you — powered by Gemini AI."
            }
          </p>
          <div className="mt-6 flex gap-3 flex-wrap">
            {!statusLoading && !hasRoadmap && (
              <button
                id="btn-generate-roadmap"
                onClick={() => navigate('/onboarding')}
                className="btn-primary px-6 py-3 text-base font-semibold bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 shadow-lg shadow-primary-500/20"
              >
                🤖 Generate My Learning Path
              </button>
            )}
            {hasRoadmap && (
              <>
                <Link to="/skills/graph" id="btn-view-graph" className="btn-primary px-6 py-3 text-base">
                  View My Graph →
                </Link>
                <button
                  id="btn-regenerate"
                  onClick={() => navigate('/onboarding')}
                  className="btn-secondary px-6 py-3 text-base"
                >
                  🔄 Regenerate Roadmap
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── AI Roadmap CTA (if no roadmap) ─────────────────────── */}
      {!statusLoading && !hasRoadmap && (
        <div
          id="cta-generate"
          className="relative overflow-hidden rounded-2xl border border-dashed border-primary-500/40 bg-gradient-to-br from-primary-500/5 to-accent-500/5 p-8 cursor-pointer group hover:border-primary-500/60 transition-all duration-300"
          onClick={() => navigate('/onboarding')}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-2xl" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              🤖
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-300 transition-colors">
                Generate Your Personalized Learning Roadmap
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Answer 4 quick questions about what you want to learn, your level, and your goal.
                Gemini AI will create a custom skill graph with prerequisites mapped out for you.
              </p>
            </div>
            <span className="text-primary-400 text-2xl group-hover:translate-x-1 transition-transform duration-200">→</span>
          </div>
          <div className="relative z-10 mt-6 flex gap-4 flex-wrap">
            {['React', 'Machine Learning', 'AWS', 'Data Science', 'Flutter', 'Rust'].map((t) => (
              <span key={t} className="text-xs bg-slate-800 border border-slate-700 text-slate-400 rounded-full px-3 py-1">
                {t}
              </span>
            ))}
            <span className="text-xs text-slate-500">+ anything you want…</span>
          </div>
        </div>
      )}

      {/* ─── Navigation Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card: Knowledge Graph */}
        <div className="card hover:border-primary-500/50 transition-colors group">
          <div className="text-3xl mb-4">🕸️</div>
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
            Knowledge Graph
          </h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            {hasRoadmap
              ? `Visualize your "${topic}" roadmap as an interactive skill graph with prerequisites.`
              : 'Generate your roadmap first, then explore it as an interactive graph.'
            }
          </p>
          <Link
            to="/skills/graph"
            id="nav-knowledge-graph"
            className="btn-secondary group-hover:bg-primary-600 group-hover:text-white transition-colors"
          >
            {hasRoadmap ? 'Open Graph →' : 'View Graph →'}
          </Link>
        </div>

        {/* Card: Skills */}
        <div className="card hover:border-emerald-500/50 transition-colors group">
          <div className="text-3xl mb-4">🧠</div>
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
            Skills Catalog
          </h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Browse all available skills, filter by category and difficulty, and track your progress.
          </p>
          <Link to="/skills" id="nav-skills" className="btn-secondary group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            View Skills →
          </Link>
        </div>

        {/* Card: Onboarding */}
        <div className="card hover:border-accent-500/50 transition-colors group cursor-pointer" onClick={() => navigate('/onboarding')}>
          <div className="text-3xl mb-4">✨</div>
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-accent-400 transition-colors">
            {hasRoadmap ? 'New Roadmap' : 'Get Started'}
          </h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            {hasRoadmap
              ? 'Want to learn something new? Generate a fresh roadmap for a different topic.'
              : 'Tell us what you want to learn and let Gemini AI build your personalized path.'
            }
          </p>
          <button id="nav-onboarding" className="btn-secondary group-hover:bg-accent-600 group-hover:text-white transition-colors">
            {hasRoadmap ? '🔄 Regenerate →' : '🤖 Generate Path →'}
          </button>
        </div>
      </div>

      {/* ─── System Status ────────────────────────────────────────── */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
        <div className="border border-slate-700 rounded-lg overflow-hidden divide-y divide-slate-700">
          {[
            { name: 'Backend API (Render)', status: 'Active', desc: 'Node.js + Express with Helmet, Rate Limiter, CORS' },
            { name: 'PostgreSQL Database', status: 'Active', desc: 'Prisma ORM with 6 relational tables' },
            { name: 'Authentication Layer', status: 'Active', desc: 'JWT access & refresh tokens configured' },
            { name: 'Gemini AI', status: 'Active', desc: 'Personalized roadmap generation via Google AI' },
          ].map((item) => (
            <div key={item.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-800/50 gap-2">
              <div>
                <p className="text-sm font-medium text-white">{item.name}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
