import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* ─── Hero / Header Section ────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 p-8 sm:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="relative z-10 max-w-2xl">
          <span className="text-primary-400 text-xs font-semibold uppercase tracking-wider bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
            Engine Foundation Loaded
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-3">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            The database seed and authentication foundations are ready. You are currently logged in as a/an <span className="font-semibold text-primary-400">{user?.role}</span>.
          </p>
        </div>
      </div>

      {/* ─── Navigation Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Skills */}
        <div className="card hover:border-primary-500/50 transition-colors group">
          <div className="text-3xl mb-4">🧠</div>
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
            Explore Skills
          </h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Browse the 20 pre-populated skills, categorized by technology area and sorted by difficulty level.
          </p>
          <Link to="/skills" className="btn-secondary group-hover:bg-primary-600 group-hover:text-white transition-colors">
            View Skills →
          </Link>
        </div>

        {/* Card: Career Goals */}
        <div className="card hover:border-accent-500/50 transition-colors group">
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-accent-400 transition-colors">
            Career Goals
          </h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Select one of the pre-populated career paths to begin your personalized learning path generation.
          </p>
          <Link to="/career-goals" className="btn-secondary group-hover:bg-accent-600 group-hover:text-white transition-colors">
            View Career Goals →
          </Link>
        </div>
      </div>

      {/* ─── Current Progress / System Status ─────────────────────── */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Foundation Status</h3>
        <div className="border border-slate-700 rounded-lg overflow-hidden divide-y divide-slate-700">
          {[
            { name: 'Node.js & Express API', status: 'Active', desc: 'Helmet, Rate Limiter, CORS enabled' },
            { name: 'PostgreSQL Database', status: 'Active', desc: 'Prisma Client, 5 relational tables' },
            { name: 'Authentication Layer', status: 'Active', desc: 'JWT access & refresh tokens configured' },
            { name: 'Seed Data Loaded', status: 'Active', desc: '20 skills, 20 graph edges, 2 career goals, 3 accounts' },
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
