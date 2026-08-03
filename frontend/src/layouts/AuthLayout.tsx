import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* ─── Left Panel (Branding) ────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900">
        <div className="relative z-10 flex flex-col justify-center px-16 py-12 text-white">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <span className="text-white font-extrabold text-lg">SG</span>
            </div>
            <div>
              <span className="text-white font-bold text-2xl tracking-tight">SkillGraph</span>
              <span className="text-indigo-200 font-semibold text-sm ml-2">AI</span>
            </div>
          </Link>

          <h1 className="text-4xl font-extrabold text-white leading-tight mb-6">
            Prepare for your next
            <br />
            <span className="text-indigo-200 font-black">
              tech interview with AI
            </span>
          </h1>

          <p className="text-indigo-100 text-base leading-relaxed mb-12 max-w-md">
            Upload your resume, practice role-first mock interview questions, and visualize your score growth over time.
          </p>

          {/* Feature highlights */}
          <ul className="space-y-4">
            {[
              { icon: '📄', text: 'AI resume file upload & skill analysis' },
              { icon: '🎯', text: 'Role-first 3-step mock interview rounds' },
              { icon: '📈', text: 'Visual score improvement trajectory graphs' },
              { icon: '⚡', text: 'Instant answer feedback & scoring' },
            ].map((feature) => (
              <li key={feature.text} className="flex items-center gap-3 text-indigo-50">
                <span className="text-xl">{feature.icon}</span>
                <span className="text-sm font-medium">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── Right Panel (Auth Form) ──────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-xs">
              <span className="text-white font-bold text-sm">SG</span>
            </div>
            <span className="text-slate-900 font-bold text-xl">SkillGraph AI</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
