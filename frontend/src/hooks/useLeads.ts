import { useCallback, useEffect, useState } from 'react';
import { getLeads } from '../api/leads.api';
import type { Lead, LeadFilters } from '../types/lead.types';
import type { PaginationMeta } from '../types/api.types';
import { getErrorMessage } from '../utils/helpers';

interface UseLeadsReturn {
  leads: Lead[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLeads(filters: LeadFilters): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function fetchLeads() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getLeads(filters);
        if (!cancelled) {
          setLeads(response.data.data);
          setPagination(response.data.pagination);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchLeads();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [filters, tick]);

  return { leads, pagination, isLoading, error, refetch };
}
