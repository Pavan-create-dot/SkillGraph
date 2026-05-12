import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  Network,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Resume',         path: '/resume',      icon: <FileText size={20} /> },
  { label: 'Mock Interview', path: '/interview',   icon: <MessageSquare size={20} /> },
  { label: 'Skill Graph',    path: '/skill-graph', icon: <Network size={20} /> },
  { label: 'Profile',        path: '/profile',     icon: <User size={20} /> },
];

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const handleNavClick = () => setMobileOpen(false);

  return (
    <div className="min-h-screen flex bg-slate-900 text-white">

      {/* ── Mobile overlay backdrop ─────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={[
          'fixed top-0 left-0 h-full z-40 flex flex-col bg-slate-800 border-r border-slate-700 transition-all duration-300',
          collapsed ? 'lg:w-16' : 'lg:w-64',
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {/* ── Sidebar Header ──────────────────────────────────── */}
        <div className="flex items-center h-16 px-3 border-b border-slate-700 shrink-0">
          <Link
            to="/resume"
            onClick={handleNavClick}
            className={[
              'flex items-center gap-2 group overflow-hidden transition-all',
              collapsed ? 'lg:w-0 lg:opacity-0 lg:pointer-events-none' : 'flex-1',
            ].join(' ')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">SG</span>
            </div>
            <div className="flex flex-col leading-none overflow-hidden">
              <span className="text-white font-semibold text-base whitespace-nowrap">SkillGraph</span>
              <span className="text-[10px] text-primary-400 font-medium whitespace-nowrap">Adaptive Learning</span>
            </div>
          </Link>

          {collapsed && (
            <Link
              to="/resume"
              className="hidden lg:flex w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg items-center justify-center mx-auto"
            >
              <span className="text-white font-bold text-sm">SG</span>
            </Link>
          )}

          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden lg:flex ml-auto items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden ml-auto flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Nav Links ───────────────────────────────────────── */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleNavClick}
                  title={collapsed ? item.label : undefined}
                  className={[
                    'flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.path)
                      ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/60',
                  ].join(' ')}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span
                    className={[
                      'whitespace-nowrap overflow-hidden transition-all duration-300',
                      collapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100',
                    ].join(' ')}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── User Section ────────────────────────────────────── */}
        <div className="border-t border-slate-700 p-3 shrink-0">
          <div
            className={[
              'flex items-center gap-3 overflow-hidden',
              collapsed ? 'lg:justify-center' : '',
            ].join(' ')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-semibold">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div
              className={[
                'flex-1 overflow-hidden transition-all duration-300 min-w-0',
                collapsed ? 'lg:w-0 lg:opacity-0' : '',
              ].join(' ')}
            >
              <p className="text-xs font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.targetRole || 'Candidate'}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className={[
                'flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors shrink-0',
                collapsed ? 'lg:mx-auto' : '',
              ].join(' ')}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────── */}
      <div
        className={[
          'flex flex-col flex-1 min-w-0 transition-all duration-300',
          collapsed ? 'lg:ml-16' : 'lg:ml-64',
        ].join(' ')}
      >
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center h-14 px-4 bg-slate-800 border-b border-slate-700 sticky top-0 z-20">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-md border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <Link to="/resume" className="flex items-center gap-2 ml-3">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-accent-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">SG</span>
            </div>
            <span className="text-white font-semibold text-sm">SkillGraph</span>
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        <footer className="border-t border-slate-800 py-3 px-6 shrink-0">
          <p className="text-center text-slate-500 text-xs">
            © 2026 SkillGraph AI · Adaptive Learning Path Engine
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
