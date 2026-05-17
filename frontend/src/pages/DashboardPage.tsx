import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { PageWrapper } from '../components/layout/PageWrapper';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadForm } from '../components/leads/LeadForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { Spinner } from '../components/ui/Spinner';
import { useLeads } from '../hooks/useLeads';
import { useAuth } from '../context/AuthContext';
import { createLead, updateLead, deleteLead, exportLeadsCSV, getLeadById } from '../api/leads.api';
import { formatDate, getErrorMessage } from '../utils/helpers';
import type { Lead, LeadFilters as LeadFiltersType, CreateLeadInput } from '../types/lead.types';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accentClass: string;
  helper: string;
  delay?: string;
}

function StatCard({ label, value, icon, accentClass, helper, delay = '' }: StatCardProps) {
  return (
    <div className={[
      'relative overflow-hidden rounded-2xl p-5',
      'bg-white/70 dark:bg-slate-900/60',
      'border border-slate-200/60 dark:border-slate-800/60',
      'shadow-sm hover:shadow-md',
      'backdrop-blur-sm',
      'hover:border-slate-300/60 dark:hover:border-slate-700/60',
      'transition-all duration-300 group',
      'animate-fade-in-up',
      delay,
    ].join(' ')}>
      {/* Background accent */}
      <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-10 blur-xl transition-opacity group-hover:opacity-20 ${accentClass}`} />

      <div className="relative">
        <div className="mb-4 flex items-start justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accentClass} text-white shadow-sm`}>
            {icon}
          </div>
        </div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">{value}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helper}</p>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<LeadFiltersType>({ page: 1 });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { leads, pagination, isLoading, error, refetch } = useLeads(filters);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthCount = leads.filter((l) => {
    const d = new Date(l.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  function handleFilterChange(next: LeadFiltersType) { setFilters(next); }
  function handlePageChange(page: number) { setFilters((prev) => ({ ...prev, page })); }
  function openCreate() { setActionError(null); setIsCreateOpen(true); }

  async function openView(lead: Lead) {
    setDetailsError(null);
    setViewingLead(null);
    setIsDetailsOpen(true);
    setDetailsLoading(true);
    try {
      const response = await getLeadById(lead._id);
      setViewingLead(response.data);
    } catch (err) {
      setDetailsError(getErrorMessage(err));
    } finally {
      setDetailsLoading(false);
    }
  }

  function closeDetails() { setIsDetailsOpen(false); setViewingLead(null); setDetailsError(null); }
  function openEdit(lead: Lead) { setActionError(null); setEditingLead(lead); }
  function openDelete(lead: Lead) { setDeletingLead(lead); }

  async function handleCreate(data: CreateLeadInput) {
    setActionLoading(true); setActionError(null);
    try { await createLead(data); refetch(); setIsCreateOpen(false); }
    catch (err) { setActionError(getErrorMessage(err)); }
    finally { setActionLoading(false); }
  }

  async function handleUpdate(data: CreateLeadInput) {
    if (!editingLead) return;
    setActionLoading(true); setActionError(null);
    try { await updateLead(editingLead._id, data); refetch(); setEditingLead(null); }
    catch (err) { setActionError(getErrorMessage(err)); }
    finally { setActionLoading(false); }
  }

  async function handleDelete() {
    if (!deletingLead) return;
    setActionLoading(true);
    try { await deleteLead(deletingLead._id); refetch(); setDeletingLead(null); }
    catch (err) { setActionError(getErrorMessage(err)); }
    finally { setActionLoading(false); }
  }

  async function handleExport() {
    setActionLoading(true); setActionError(null);
    try {
      await exportLeadsCSV({ status: filters.status, source: filters.source, search: filters.search, sort: filters.sort });
    } catch (err) { setActionError(getErrorMessage(err)); }
    finally { setActionLoading(false); }
  }

  const statCards = [
    {
      label: 'Total Leads',
      value: pagination?.total ?? 0,
      helper: 'Across all access',
      accentClass: 'bg-primary-500',
      delay: '',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
        </svg>
      ),
    },
    {
      label: 'New',
      value: leads.filter((l) => l.status === 'New').length,
      helper: 'Visible on this page',
      accentClass: 'bg-blue-500',
      delay: 'delay-75',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      label: 'Qualified',
      value: leads.filter((l) => l.status === 'Qualified').length,
      helper: 'Ready opportunities',
      accentClass: 'bg-primary-500',
      delay: 'delay-150',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      label: 'This Month',
      value: thisMonthCount,
      helper: 'Created this month',
      accentClass: 'bg-violet-500',
      delay: 'delay-200',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060a0f] transition-colors">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Page header */}
        <PageWrapper
          title="Leads Dashboard"
          subtitle="Manage and track your sales pipeline"
          actions={
            <>
              {user?.role === 'Admin' && (
                <Button variant="secondary" size="sm" isLoading={actionLoading} onClick={handleExport}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export CSV
                </Button>
              )}
              <Button variant="primary" size="sm" onClick={openCreate}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Lead
              </Button>
            </>
          }
        />

        {/* Error banners */}
        {(actionError || error) && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200/60 dark:border-red-800/50 animate-fade-in">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-600 dark:text-red-400 whitespace-pre-line">{actionError || error}</p>
          </div>
        )}

        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* Main table card */}
        <div className={[
          'overflow-hidden rounded-2xl',
          'bg-white/70 dark:bg-slate-900/60',
          'border border-slate-200/60 dark:border-slate-800/60',
          'shadow-sm',
          'backdrop-blur-sm',
          'animate-fade-in-up delay-300',
        ].join(' ')}>
          {/* Filters */}
          <div className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 p-4">
            <LeadFilters filters={filters} onChange={handleFilterChange} />
          </div>

          <LeadTable
            leads={leads}
            isLoading={isLoading}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
            userRole={user?.role ?? 'SalesUser'}
          />

          {pagination && pagination.totalPages > 1 && (
            <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 p-4">
              <Pagination pagination={pagination} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add New Lead">
        <LeadForm onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} isLoading={actionLoading} />
      </Modal>

      <Modal isOpen={isDetailsOpen} onClose={closeDetails} title="Lead Details" size="md">
        {detailsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : detailsError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {detailsError}
          </div>
        ) : viewingLead ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Name', value: viewingLead.name },
              { label: 'Email', value: viewingLead.email },
              { label: 'Status', value: viewingLead.status },
              { label: 'Source', value: viewingLead.source },
              { label: 'Created', value: formatDate(viewingLead.createdAt) },
              { label: 'Updated', value: formatDate(viewingLead.updatedAt) },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">{label}</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{value}</p>
              </div>
            ))}
            {viewingLead.createdBy && (
              <div className="sm:col-span-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Creator ID</p>
                <p className="break-all text-sm font-medium text-slate-900 dark:text-white">{viewingLead.createdBy}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">No lead details available.</p>
        )}
      </Modal>

      <Modal isOpen={!!editingLead} onClose={() => setEditingLead(null)} title="Edit Lead">
        {editingLead && (
          <LeadForm
            initialData={editingLead}
            onSubmit={handleUpdate}
            onCancel={() => setEditingLead(null)}
            isLoading={actionLoading}
          />
        )}
      </Modal>

      <Modal isOpen={!!deletingLead} onClose={() => setDeletingLead(null)} title="Delete Lead" size="sm">
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Delete Lead</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-slate-900 dark:text-white">{deletingLead?.name}</span>?
                This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeletingLead(null)}>Cancel</Button>
            <Button variant="danger" isLoading={actionLoading} onClick={handleDelete}>Delete Lead</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
