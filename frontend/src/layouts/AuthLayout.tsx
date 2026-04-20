import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* ─── Left Panel (Branding) ────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900">
        {/* Background glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white font-bold text-lg">SG</span>
            </div>
            <div>
              <span className="text-white font-bold text-2xl">SkillGraph</span>
              <span className="text-primary-400 font-semibold text-sm ml-2">AI</span>
            </div>
          </Link>

          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Map your path to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
              career mastery
            </span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mb-12">
            AI-powered adaptive learning that identifies your skill gaps and builds a personalized
            roadmap to your career goals.
          </p>

          {/* Feature highlights */}
          <ul className="space-y-4">
            {[
              { icon: '🧠', text: 'AI-powered skill gap analysis' },
              { icon: '🗺️', text: 'Adaptive learning paths' },
              { icon: '📊', text: 'Real-time progress tracking' },
              { icon: '🎯', text: 'Goal-oriented micro lessons' },
            ].map((feature) => (
              <li key={feature.text} className="flex items-center gap-3 text-slate-300">
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-sm">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── Right Panel (Auth Form) ──────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SG</span>
            </div>
            <span className="text-white font-bold text-xl">SkillGraph AI</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
