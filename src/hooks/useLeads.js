import { useState, useEffect, useCallback, useRef } from 'react';
import { filterLeads } from '../services/api';

/**
 * useLeads — hook for paginated, filtered lead data from Baserow
 * Provides loading, error, refetch, proper cleanup, and efficient state updates.
 */
const useLeads = (initialFilters = {}) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);

  // Keep track of the active AbortController to abort previous pending requests
  const abortControllerRef = useRef(null);

  const fetchLeads = useCallback(async () => {
    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new controller for the current request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await filterLeads(
        { ...filters, page },
        { signal: controller.signal }
      );
      
      setLeads(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (err) {
      // Axios v1+ uses ERR_CANCELED for AbortController-based cancellations
      if (err?.code === 'ERR_CANCELED' || err?.name === 'AbortError') {
        return;
      }
      setError(err.message || 'Cannot connect to database. Make sure Baserow is running at localhost:85');
    } finally {
      // Only set loading state if this remains the most recent request
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, [filters, page]);

  useEffect(() => {
    fetchLeads();

    // Cleanup aborts active request on unmount or parameter changes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchLeads]);

  return {
    leads,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    page,
    setPage,
    refetch: fetchLeads,
  };
};

export default useLeads;
