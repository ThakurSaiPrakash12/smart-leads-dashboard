import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { STATUS_COLORS, SOURCE_COLORS } from '../../constants';
import { formatDate } from '../../utils/helpers';
import type { Lead } from '../../types/lead.types';
import type { UserRole } from '../../types/auth.types';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  userRole: UserRole;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800/60">
      {[68, 76, 52, 44, 64, 36].map((w, i) => (
        <td key={i} className="px-5 py-3.5">
          <div
            className="h-3.5 rounded-full skeleton"
            style={{ width: `${w}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

export function LeadTable({ leads, isLoading, onView, onEdit, onDelete, userRole }: LeadTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800/60">
            {['Name', 'Email', 'Status', 'Source', 'Created At', 'Actions'].map((col) => (
              <th
                key={col}
                className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : leads.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <EmptyState
                  title="No leads found"
                  description="Try adjusting your filters or add a new lead."
                />
              </td>
            </tr>
          ) : (
            leads.map((lead, index) => (
              <tr
                key={lead._id}
                className={[
                  'group border-b border-slate-100 dark:border-slate-800/50',
                  'hover:bg-slate-50/80 dark:hover:bg-slate-800/30',
                  'transition-colors duration-150',
                  'animate-fade-in',
                ].join(' ')}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Name */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-xs font-bold shadow-sm">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{lead.name}</span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-5 py-3.5">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{lead.email}</span>
                </td>

                {/* Status */}
                <td className="px-5 py-3.5">
                  <Badge label={lead.status} colorClass={STATUS_COLORS[lead.status]} />
                </td>

                {/* Source */}
                <td className="px-5 py-3.5">
                  <Badge label={lead.source} colorClass={SOURCE_COLORS[lead.source]} />
                </td>

                {/* Created */}
                <td className="px-5 py-3.5">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{formatDate(lead.createdAt)}</span>
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(lead)}
                      aria-label={`View ${lead.name}`}
                      className="text-slate-400 hover:text-primary-600 dark:text-slate-500 dark:hover:text-primary-400"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(lead)}
                      aria-label={`Edit ${lead.name}`}
                      className="text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Button>
                    {userRole === 'Admin' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(lead)}
                        aria-label={`Delete ${lead.name}`}
                        className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
