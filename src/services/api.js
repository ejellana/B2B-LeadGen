import axios from 'axios';

const BASEROW_TOKEN = 'z4fVqkHKIKcWxTCAMECwoCk6MoMAVw3N';
const TABLE_ID = '683';

// Reusable configurations
const BASEROW_TIMEOUT = 15000; // 15 seconds for database queries
const N8N_TIMEOUT = 90000;     // 90 seconds for lead discovery triggers

const baserowClient = axios.create({
  baseURL: '/baserow-api',
  timeout: BASEROW_TIMEOUT,
  headers: {
    Authorization: `Token ${BASEROW_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

const n8nClient = axios.create({
  baseURL: '/n8n-api',
  timeout: N8N_TIMEOUT,
});

// Helper to normalize Baserow select/field formats to flat string/number values
const normalizeSelectField = (field, defaultValue = '') => {
  if (field === null || field === undefined) return defaultValue;
  if (typeof field === 'object' && field.value !== undefined) return field.value;
  return String(field);
};

export const normalizeLead = (lead) => {
  if (!lead) return null;
  return {
    id: lead.id,
    company_name: lead.company_name || '',
    domain: lead.domain || '',
    industry: normalizeSelectField(lead.industry, 'Other'),
    size_tier: normalizeSelectField(lead.size_tier, 'SMB (<50)'),
    headcount: lead.headcount !== undefined && lead.headcount !== null ? Number(lead.headcount) : 0,
    city: normalizeSelectField(lead.city, ''),
    region: normalizeSelectField(lead.region, ''),
    country: lead.country || 'Philippines',
    sec_registration_no: lead.sec_registration_no || null,
    tech_stack: lead.tech_stack || null,
    funding_stage: normalizeSelectField(lead.funding_stage, 'Unknown'),
    linkedin_url: lead.linkedin_url || null,
    email_contact: lead.email_contact || null,
    phone_number: lead.phone_number || null,
    mobile_number: lead.mobile_number || null,
    source: normalizeSelectField(lead.source, 'hunter'),
    raw_description: lead.raw_description || null,
    created_at: lead.created_at || new Date().toISOString(),
    last_updated: lead.last_updated || new Date().toISOString(),
  };
};

const handleBaserowError = (error) => {
  if (axios.isCancel(error)) {
    throw error; // Let cancel errors propagate
  }
  if (error.code === 'ECONNABORTED') {
    throw new Error('Request timed out. Please try again.');
  }
  if (!error.response) {
    throw new Error('Cannot connect to database. Make sure Baserow is running at localhost:85');
  }
  const status = error.response.status;
  if (status >= 500) {
    throw new Error('Baserow server error. Please contact the administrator.');
  }
  if (status === 401 || status === 403) {
    throw new Error('Unauthorized. Invalid Baserow API token.');
  }
  if (status === 404) {
    throw new Error('Lead not found.');
  }
  throw new Error(error.response.data?.error || 'Received invalid data from the server.');
};

const handleN8NError = (error) => {
  if (axios.isCancel(error)) {
    throw error;
  }
  if (error.code === 'ECONNABORTED') {
    throw new Error('Request timed out. Lead discovery took too long.');
  }
  if (!error.response) {
    throw new Error('Lead discovery failed. Make sure N8N is running at localhost:5678');
  }
  throw new Error('Lead discovery failed. Make sure N8N is running at localhost:5678');
};

/**
 * Get paginated leads from Baserow
 * @param {Object} params - Query parameters (page, size, filters, search)
 * @param {Object} config - Axios request config (e.g. AbortSignal)
 */
export const getLeads = async (params = {}, config = {}) => {
  try {
    const response = await baserowClient.get(
      `/api/database/rows/table/${TABLE_ID}/`,
      {
        params: {
          user_field_names: true,
          size: 25,
          ...params,
        },
        ...config,
      }
    );

    if (!response.data || !Array.isArray(response.data.results)) {
      throw new Error('Received invalid data from the server.');
    }

    return {
      count: response.data.count || 0,
      next: response.data.next || null,
      previous: response.data.previous || null,
      results: response.data.results.map(normalizeLead),
    };
  } catch (error) {
    handleBaserowError(error);
  }
};

/**
 * Get a single lead by row ID
 * @param {number|string} id - Baserow row ID
 * @param {Object} config - Axios request config
 */
export const getLeadById = async (id, config = {}) => {
  try {
    const response = await baserowClient.get(
      `/api/database/rows/table/${TABLE_ID}/${id}/`,
      {
        params: { user_field_names: true },
        ...config,
      }
    );
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Received invalid data from the server.');
    }
    return normalizeLead(response.data);
  } catch (error) {
    handleBaserowError(error);
  }
};

/**
 * Search leads by company name
 * @param {string} query - Search term
 * @param {Object} config - Axios request config
 */
export const searchLeads = async (query, config = {}) => {
  try {
    const response = await baserowClient.get(
      `/api/database/rows/table/${TABLE_ID}/`,
      {
        params: {
          user_field_names: true,
          search: query,
        },
        ...config,
      }
    );
    if (!response.data || !Array.isArray(response.data.results)) {
      throw new Error('Received invalid data from the server.');
    }
    return {
      count: response.data.count || 0,
      next: response.data.next || null,
      previous: response.data.previous || null,
      results: response.data.results.map(normalizeLead),
    };
  } catch (error) {
    handleBaserowError(error);
  }
};

/**
 * Filter leads by one or more fields.
 * Incorporates Baserow's URL filter syntax.
 * Uses contains instead of equal for single_select options (size_tier, funding_stage).
 * @param {Object} filters - e.g. { industry: 'BPO', city: 'Makati' }
 * @param {Object} config - Axios request config
 */
export const filterLeads = async (filters = {}, config = {}) => {
  try {
    const params = { user_field_names: true };

    if (filters.industry) params['filter__industry__equal'] = filters.industry;
    if (filters.city) params['filter__city__equal'] = filters.city;
    if (filters.size_tier) params['filter__size_tier__contains'] = filters.size_tier;
    if (filters.funding_stage) params['filter__funding_stage__contains'] = filters.funding_stage;
    if (filters.search) params.search = filters.search;
    if (filters.page) params.page = filters.page;
    if (filters.size) params.size = filters.size;

    const response = await baserowClient.get(
      `/api/database/rows/table/${TABLE_ID}/`,
      { params, ...config }
    );
    if (!response.data || !Array.isArray(response.data.results)) {
      throw new Error('Received invalid data from the server.');
    }
    return {
      count: response.data.count || 0,
      next: response.data.next || null,
      previous: response.data.previous || null,
      results: response.data.results.map(normalizeLead),
    };
  } catch (error) {
    handleBaserowError(error);
  }
};

/**
 * Trigger N8N webhook to discover new leads
 * @param {string} keyword - Industry keyword e.g. 'BPO'
 * @param {Object} config - Axios request config
 */
export const triggerLeadSearch = async (keyword, config = {}) => {
  try {
    const response = await n8nClient.post(
      '/webhook/leads/search',
      { keyword },
      config
    );
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Received invalid data from the server.');
    }
    return response.data;
  } catch (error) {
    handleN8NError(error);
  }
};

/**
 * Fetch ALL leads across all pages (for analytics)
 * Iterates through Baserow pagination until all rows are collected
 * @param {Object} config - Axios request config
 */
export const getAllLeadsForAnalytics = async (config = {}) => {
  let allLeads = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const data = await getLeads({ page, size: 200 }, config);
    allLeads = [...allLeads, ...data.results];

    if (data.next) {
      page += 1;
    } else {
      hasMore = false;
    }
  }

  return allLeads;
};
