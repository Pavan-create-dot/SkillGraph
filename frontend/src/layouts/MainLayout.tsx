import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-slate-900">
      {/* ─── Navigation ─────────────────────────────────────────── */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SG</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-semibold text-lg">SkillGraph</span>
                <span className="text-xs text-primary-400 font-medium">AI roadmap</span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900/70 p-2 text-slate-300 hover:border-slate-600 hover:text-white lg:hidden"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Toggle navigation menu"
              >
                <span className="text-lg">☰</span>
              </button>

              <nav className="hidden lg:flex items-center gap-6">
                <Link to="/dashboard" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/skills" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                  Skills
                </Link>
                <Link to="/skills/graph" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                  Knowledge Graph
                </Link>
                <Link to="/profile" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                  Profile
                </Link>
              </nav>

              <div className="hidden xl:flex items-center gap-3 pl-4 border-l border-slate-700">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white leading-none">{user?.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>

          {menuOpen && (
            <div className="lg:hidden border-t border-slate-700 bg-slate-900/95 py-4">
              <div className="space-y-3 px-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  to="/skills"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Skills
                </Link>
                <Link
                  to="/skills/graph"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Knowledge Graph
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left rounded-xl px-3 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <main className="flex-1 h-full max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
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
