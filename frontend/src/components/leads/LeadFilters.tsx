import { useState, useEffect, type ChangeEvent } from 'react';
import type { LeadFilters, LeadStatus, LeadSource } from '../../types/lead.types';
import { LEAD_STATUSES, LEAD_SOURCES } from '../../constants';
import { useDebounce } from '../../hooks/useDebounce';
import { Button } from '../ui/Button';

interface LeadFiltersProps {
  filters: LeadFilters;
  onChange: (filters: LeadFilters) => void;
}

const selectBase = [
  'h-10 rounded-xl px-3 text-sm',
  'bg-white/80 dark:bg-slate-800/60',
  'border border-slate-200 dark:border-slate-700/80',
  'text-slate-700 dark:text-slate-200',
  'shadow-sm',
  'transition-all duration-200',
  'focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 dark:focus:border-primary-500',
  'hover:border-slate-300 dark:hover:border-slate-600',
  'cursor-pointer',
  'backdrop-blur-sm',
].join(' ');

export function LeadFilters({ filters, onChange }: LeadFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    onChange({ ...filters, search: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasActiveFilters = !!filters.status || !!filters.source || !!filters.search || !!filters.sort;

  function handleStatusChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange({ ...filters, status: (e.target.value as LeadStatus) || undefined, page: 1 });
  }

  function handleSourceChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange({ ...filters, source: (e.target.value as LeadSource) || undefined, page: 1 });
  }

  function handleSortChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange({ ...filters, sort: (e.target.value as 'latest' | 'oldest') || undefined, page: 1 });
  }

  function handleClear() {
    setSearchInput('');
    onChange({ page: 1 });
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Search */}
      <div className="relative min-w-[200px] flex-1">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name or email…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={`${selectBase} pl-9 w-full`}
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Status filter */}
      <select value={filters.status ?? ''} onChange={handleStatusChange} className={selectBase}>
        <option value="">All Statuses</option>
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Source filter */}
      <select value={filters.source ?? ''} onChange={handleSourceChange} className={selectBase}>
        <option value="">All Sources</option>
        {LEAD_SOURCES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Sort */}
      <select value={filters.sort ?? ''} onChange={handleSortChange} className={selectBase}>
        <option value="">Latest first</option>
        <option value="oldest">Oldest first</option>
      </select>

      {/* Clear */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleClear}
          className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 animate-fade-in"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear filters
        </Button>
      )}
    </div>
  );
}
