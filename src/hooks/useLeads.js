import { useState, useEffect, useCallback, useRef } from 'react';
import { filterLeads } from '../services/api';

/**
 * Helper to parse the page size parameter from Baserow next/previous URLs.
 * Falls back to actual results length or keeps the existing page size if on the last page.
 */
const getPageSizeFromUrls = (nextUrl, prevUrl, resultsLength, currentPageSize) => {
  const extract = (url) => {
    if (!url) return null;
    try {
      const match = url.match(/[?&]size=(\d+)/);
      return match ? parseInt(match[1], 10) : null;
    } catch {
      return null;
    }
  };
  
  const urlSize = extract(nextUrl) || extract(prevUrl);
  if (urlSize) return urlSize;

  // If there is a next page, the current results length represents the full page size
  if (nextUrl) return resultsLength;

  // If we are on the last page (nextUrl is null) and already have a resolved page size, preserve it
  if (currentPageSize && currentPageSize > 0) return currentPageSize;

  return resultsLength || 100;
};

/**
 * useLeads — hook for paginated, filtered lead data from Baserow
 * Provides loading, error, refetch, proper cleanup, and efficient state updates.
 */
const useLeads = (initialFilters = {}) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, pageSize: 100 });
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
      setPagination((prev) => {
        const pageSize = getPageSizeFromUrls(data.next, data.previous, data.results.length, prev.pageSize);
        return {
          count: data.count,
          next: data.next,
          previous: data.previous,
          pageSize,
        };
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
