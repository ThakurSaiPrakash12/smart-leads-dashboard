import { useState, type FormEvent } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { LEAD_STATUSES, LEAD_SOURCES } from '../../constants';
import type { Lead, CreateLeadInput, LeadStatus, LeadSource } from '../../types/lead.types';

interface LeadFormProps {
  initialData?: Partial<Lead>;
  onSubmit: (data: CreateLeadInput) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

interface FormState {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource | '';
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const selectBase = [
  'w-full rounded-xl px-3.5 py-2.5 text-sm',
  'bg-white/70 dark:bg-slate-800/60',
  'border transition-all duration-200',
  'text-slate-900 dark:text-slate-100',
  'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 dark:focus:border-primary-500',
  'hover:border-slate-300 dark:hover:border-slate-600',
].join(' ');

export function LeadForm({ initialData, onSubmit, onCancel, isLoading }: LeadFormProps) {
  const [form, setForm] = useState<FormState>({
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    status: initialData?.status ?? 'New',
    source: initialData?.source ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      next.name = 'Name must be at least 2 characters';
    }
    if (!form.email.trim() || !EMAIL_REGEX.test(form.email)) {
      next.email = 'Enter a valid email address';
    }
    if (!form.source) {
      next.source = 'Source is required';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      status: form.status,
      source: form.source as LeadSource,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="lead-name"
        label="Name"
        placeholder="Jane Smith"
        value={form.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        }
      />

      <Input
        id="lead-email"
        label="Email"
        type="email"
        placeholder="jane@example.com"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        }
      />

      {/* Status select */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="lead-status" className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Status
        </label>
        <select
          id="lead-status"
          value={form.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className={`${selectBase} border-slate-200 dark:border-slate-700/80`}
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Source select */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="lead-source" className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Source
        </label>
        <select
          id="lead-source"
          value={form.source}
          onChange={(e) => handleChange('source', e.target.value)}
          className={`${selectBase} ${errors.source ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700/80'}`}
        >
          <option value="">Select a source…</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.source && (
          <p className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
            <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.source}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Save Changes' : 'Add Lead'}
        </Button>
      </div>
    </form>
  );
}
