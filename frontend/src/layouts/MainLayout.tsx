import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* ─── Navigation ─────────────────────────────────────────── */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SG</span>
              </div>
              <span className="text-white font-semibold text-lg">SkillGraph</span>
              <span className="text-xs text-primary-400 font-medium bg-primary-500/10 px-2 py-0.5 rounded-full border border-primary-500/20">
                AI
              </span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                to="/dashboard"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/skills"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Skills
              </Link>
              <Link
                to="/skills/graph"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Knowledge Graph
              </Link>
              <Link
                to="/career-goals"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Career Goals
              </Link>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white leading-none">{user?.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-xs">
          © 2026 SkillGraph AI · Adaptive Learning Path Engine
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
