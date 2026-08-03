import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  TrendingUp,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Resume',         path: '/resume',      icon: <FileText size={18} /> },
  { label: 'Mock Interview', path: '/interview',   icon: <MessageSquare size={18} /> },
  { label: 'Performance Graph', path: '/skill-graph', icon: <TrendingUp size={18} /> },
];

const PAGE_LABELS: Record<string, string> = {
  '/resume':      'Resume Analyzer',
  '/interview':   'Mock Interview',
  '/skill-graph': 'Interview Performance Graph',
  '/profile':     'Profile Settings',
};

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const handleNavClick = () => setMobileOpen(false);
  const currentPageLabel = PAGE_LABELS[location.pathname] ?? 'SkillGraph';

  // Close profile dropdown on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">

      {/* ── Mobile overlay backdrop ─────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className={[
        'fixed top-0 left-0 h-full z-40 flex flex-col w-64 bg-white border-r border-slate-200 transition-transform duration-300 shadow-xs',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ].join(' ')}>

        {/* Sidebar Header */}
        <div className="flex items-center h-16 px-5 border-b border-slate-100 shrink-0">
          <Link to="/resume" onClick={handleNavClick} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm group-hover:bg-indigo-700 transition-colors">
              <span className="text-white font-bold text-sm">SG</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-slate-900 font-bold text-[15px] tracking-tight">SkillGraph</span>
              <span className="text-[10px] text-indigo-600 font-medium tracking-wide">Interview Prep</span>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden ml-auto flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-5 overflow-y-auto">
          <p className="px-5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Navigation
          </p>
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleNavClick}
                  className={[
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive(item.path)
                      ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                  ].join(' ')}
                >
                  <span className={isActive(item.path) ? 'text-indigo-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-100 p-4 shrink-0">
          <p className="text-[10px] text-slate-400 text-center">
            © 2026 SkillGraph AI
          </p>
        </div>
      </aside>

      {/* ── Main Area ─────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-64">

        {/* ── Top Bar (both mobile and desktop) ──────────────── */}
        <header className="flex items-center justify-between h-14 px-4 sm:px-6 bg-white/90 border-b border-slate-200 sticky top-0 z-20 backdrop-blur-sm shadow-2xs">
          {/* Left: mobile menu button + page title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>
            <span className="text-sm font-bold text-slate-800 hidden sm:block">
              {currentPageLabel}
            </span>
          </div>

          {/* Right: profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 shadow-xs">
                <span className="text-white text-xs font-semibold">{initials}</span>
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-xs font-semibold text-slate-800">{user?.name}</span>
                <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                  {user?.targetRole || 'Candidate'}
                </span>
              </div>
              <ChevronDown
                size={14}
                className={['text-slate-400 transition-transform', profileOpen ? 'rotate-180' : ''].join(' ')}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.targetRole || 'Candidate'}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors font-medium"
                >
                  <User size={14} />
                  Profile Settings
                </Link>
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 py-3 px-6 shrink-0 bg-white">
          <p className="text-center text-slate-500 text-xs font-medium">
            SkillGraph AI · Candidate Performance & Placement Readiness
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
