import type { LeadStatus, LeadSource } from '../types/lead.types';

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
export const LEAD_SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];
export const PAGE_LIMIT = 10;

export const STATUS_COLORS: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Contacted: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  Qualified: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  Lost: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export const SOURCE_COLORS: Record<LeadSource, string> = {
  Website: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  Instagram: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  Referral: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
};
