import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  async function handleLogout() {
    await logout();
  }

  return (
    <header className={[
      'sticky top-0 z-40',
      'border-b border-slate-200/60 dark:border-slate-800/60',
      'bg-white/80 dark:bg-slate-950/80',
      'backdrop-blur-xl',
    ].join(' ')}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className={[
            'flex h-9 w-9 items-center justify-center rounded-xl',
            'bg-gradient-to-br from-primary-500 to-primary-700',
            'shadow-lg shadow-primary-500/30',
            'group-hover:shadow-primary-500/50 group-hover:scale-105',
            'transition-all duration-200',
          ].join(' ')}>
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-900 dark:text-white sm:text-base leading-tight">
              Smart Leads
            </span>
            <span className="hidden text-[10px] font-medium text-primary-600 dark:text-primary-400 sm:block uppercase tracking-wide">
              Pipeline workspace
            </span>
          </div>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={[
              'relative inline-flex h-9 w-[3.75rem] items-center rounded-full p-0.5',
              'border border-slate-200 dark:border-slate-700',
              'bg-slate-100 dark:bg-slate-800',
              'hover:border-primary-400 dark:hover:border-primary-500',
              'transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            ].join(' ')}
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <span
              className={[
                'flex h-8 w-8 items-center justify-center rounded-full',
                'bg-white dark:bg-slate-700',
                'shadow-sm',
                'transition-all duration-300',
                theme === 'dark' ? 'translate-x-[1.75rem]' : 'translate-x-0',
              ].join(' ')}
            >
              {theme === 'light' ? (
                <svg className="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              )}
            </span>
          </button>

          {/* User profile chip */}
          {user && (
            <Link
              to="/profile"
              className={[
                'hidden sm:flex items-center gap-2.5',
                'rounded-xl border border-slate-200/80 dark:border-slate-700/60',
                'bg-white/60 dark:bg-slate-800/60',
                'px-2.5 py-1.5',
                'hover:bg-white dark:hover:bg-slate-800',
                'hover:border-slate-300 dark:hover:border-slate-600',
                'transition-all duration-200',
                'backdrop-blur-sm',
              ].join(' ')}
            >
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=16a34a&color=ffffff&size=128&bold=true`}
                  alt="Profile"
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-primary-400/30"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary-500 border-2 border-white dark:border-slate-800" />
              </div>
              <div className="leading-tight">
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[100px]">
                  {user.name}
                </span>
                <span className={[
                  'text-[10px] font-medium uppercase tracking-wide',
                  user.role === 'Admin'
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-slate-400 dark:text-slate-500',
                ].join(' ')}>
                  {user.role}
                </span>
              </div>
            </Link>
          )}

          {/* Logout */}
          <Button variant="ghost" size="sm" onClick={handleLogout}
            className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3H9.75m9 0l-3-3m3 3l-3 3" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
