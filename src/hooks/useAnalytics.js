import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllLeadsForAnalytics } from '../services/api';

/**
 * useAnalytics — hook that fetches all leads and derives analytics data
 * Provides loading, error, refetch, proper cleanup, and efficient state updates.
 */
const useAnalytics = () => {
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Keep track of the active AbortController to cancel previous requests
  const abortControllerRef = useRef(null);

  const fetchAnalytics = useCallback(async () => {
    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new controller for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await getAllLeadsForAnalytics({ signal: controller.signal });
      setAllLeads(data);
    } catch (err) {
      // Axios v1+ uses ERR_CANCELED for AbortController-based cancellations
      if (err?.code === 'ERR_CANCELED' || err?.name === 'AbortError') {
        return;
      }
      setError(err.message || 'Cannot connect to database. Make sure Baserow is running at localhost:85');
    } finally {
      // Only update loading state if this remains the most recent request
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();

    // Aborts pending request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchAnalytics]);

  return {
    allLeads,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};

export default useAnalytics;
