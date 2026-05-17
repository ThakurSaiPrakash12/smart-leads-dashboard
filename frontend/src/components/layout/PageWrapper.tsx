import React from 'react';

interface PageWrapperProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageWrapper({ title, subtitle, actions, children }: PageWrapperProps) {
  return (
    <>
      {(title || subtitle || actions) && (
        <div className={[
          'mb-6 flex flex-col gap-4 rounded-2xl p-5 sm:p-6',
          'sm:flex-row sm:items-center sm:justify-between',
          'bg-white/70 dark:bg-slate-900/60',
          'border border-slate-200/60 dark:border-slate-800/60',
          'backdrop-blur-sm',
          'shadow-sm',
          'animate-fade-in-up',
        ].join(' ')}>
          <div>
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Lead Management
            </p>
            {title && (
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>
          )}
        </div>
      )}
      {children}
    </>
  );
}
