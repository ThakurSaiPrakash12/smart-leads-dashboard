import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';

export function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=16a34a&color=ffffff&size=256&bold=true`;

  const joinDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060a0f] transition-colors">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Page header */}
        <div className="mb-6 animate-fade-in-up">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-1">
            Account
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        </div>

        {/* Profile card */}
        <div className={[
          'overflow-hidden rounded-2xl',
          'bg-white/80 dark:bg-slate-900/70',
          'border border-slate-200/60 dark:border-slate-700/40',
          'shadow-xl shadow-slate-900/5 dark:shadow-black/30',
          'backdrop-blur-sm',
          'animate-fade-in-up delay-75',
        ].join(' ')}>
          {/* Cover banner */}
          <div className="relative h-36 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-emerald-400" />
            {/* Decorative circles */}
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -right-4 top-8 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute left-1/3 -bottom-8 h-32 w-32 rounded-full bg-white/5" />
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          </div>

          {/* Avatar + quick actions */}
          <div className="relative px-6 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 sm:-mt-12 mb-6">
              <div className="relative w-fit">
                <img
                  src={avatarUrl}
                  alt={user.name}
                  className={[
                    'h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover',
                    'ring-4 ring-white dark:ring-slate-900',
                    'shadow-xl shadow-slate-900/20',
                  ].join(' ')}
                />
                {/* Online indicator */}
                <div className="absolute bottom-1.5 right-1.5">
                  <span className="relative flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-primary-500 border-2 border-white dark:border-slate-900" />
                  </span>
                </div>
              </div>

              {/* Role badge + logout */}
              <div className="flex items-center gap-3 pb-1">
                <span className={[
                  'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide',
                  user.role === 'Admin'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                    : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border border-primary-200 dark:border-primary-800/40',
                ].join(' ')}>
                  {user.role === 'Admin' ? (
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                  {user.role}
                </span>

                <button
                  onClick={logout}
                  className={[
                    'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium',
                    'text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400',
                    'bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/20',
                    'border border-slate-200/60 dark:border-slate-700/60',
                    'hover:border-red-200 dark:hover:border-red-800/40',
                    'transition-all duration-200',
                  ].join(' ')}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3H9.75m9 0l-3-3m3 3l-3 3" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            {/* Name + email */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>

            {/* Info grid */}
            <div className="grid gap-3 sm:grid-cols-2 mb-8">
              <InfoCard
                icon={
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                }
                label="Email Address"
                value={user.email}
              />
              <InfoCard
                icon={
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                }
                label="Role"
                value={user.role}
              />
              <InfoCard
                icon={
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                }
                label="Member since"
                value={joinDate}
              />
              <InfoCard
                icon={
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                }
                label="Account Status"
                value="Active"
                valueClassName="text-primary-600 dark:text-primary-400"
                badge={
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
                  </span>
                }
              />
            </div>

            {/* Quick actions */}
            <div className={[
              'mb-6 rounded-xl p-4',
              'bg-primary-50/50 dark:bg-primary-900/10',
              'border border-primary-100 dark:border-primary-900/30',
            ].join(' ')}>
              <p className="text-xs font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wide mb-3">
                Quick Actions
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/dashboard"
                  className={[
                    'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
                    'bg-white dark:bg-slate-800',
                    'border border-slate-200 dark:border-slate-700',
                    'text-slate-700 dark:text-slate-200',
                    'hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700',
                    'dark:hover:bg-primary-900/20 dark:hover:border-primary-800/40 dark:hover:text-primary-400',
                    'transition-all duration-200',
                  ].join(' ')}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                  </svg>
                  Go to Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  valueClassName = '',
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className={[
      'rounded-xl p-4',
      'bg-slate-50/80 dark:bg-slate-800/40',
      'border border-slate-100 dark:border-slate-700/40',
      'hover:border-slate-200 dark:hover:border-slate-600/60',
      'transition-colors duration-200',
    ].join(' ')}>
      <div className="mb-2 flex items-center gap-2 text-slate-400 dark:text-slate-500">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge}
        <p className={`text-sm font-medium text-slate-900 dark:text-slate-100 ${valueClassName}`}>
          {value}
        </p>
      </div>
    </div>
  );
}