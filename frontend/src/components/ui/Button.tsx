import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variantStyles = {
  primary: [
    'bg-gradient-to-r from-primary-500 to-primary-600',
    'hover:from-primary-400 hover:to-primary-500',
    'text-white font-semibold',
    'shadow-lg shadow-primary-500/25',
    'hover:shadow-primary-500/40',
    'border border-primary-400/20',
    'focus-visible:ring-primary-500',
    'active:scale-[0.98]',
  ].join(' '),
  secondary: [
    'bg-white/80 dark:bg-slate-800/80',
    'border border-slate-200 dark:border-slate-700/80',
    'hover:bg-slate-50 dark:hover:bg-slate-700/80',
    'text-slate-700 dark:text-slate-200',
    'shadow-sm',
    'focus-visible:ring-primary-500',
    'active:scale-[0.98]',
  ].join(' '),
  danger: [
    'bg-gradient-to-r from-red-500 to-rose-600',
    'hover:from-red-400 hover:to-rose-500',
    'text-white font-semibold',
    'shadow-lg shadow-red-500/25',
    'hover:shadow-red-500/40',
    'focus-visible:ring-red-500',
    'active:scale-[0.98]',
  ].join(' '),
  ghost: [
    'hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
    'text-slate-600 dark:text-slate-400',
    'hover:text-slate-900 dark:hover:text-slate-200',
    'focus-visible:ring-primary-500',
    'active:scale-[0.98]',
  ].join(' '),
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-2.5 text-base gap-2',
};

export function Button({
  variant,
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center rounded-xl font-medium',
        'transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(' ')}
      {...rest}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
