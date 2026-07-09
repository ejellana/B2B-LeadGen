# PhilLeads — Philippine B2B Intelligence Platform
## Frontend Build Prompt for Claude / Gemini

---

## AI DEVELOPMENT RULES

Before writing any code:

- Read this entire document first.
- Treat this file as the single source of truth.
- Do not skip features.
- Do not simplify the UI unless instructed.
- Build production-quality, reusable components.
- Keep code modular and avoid duplication.
- Use React best practices.
- Do not proceed to the next phase until the current phase is complete.
- If information is missing, ask before making assumptions.

## PROJECT OVERVIEW

Build a full React web application called **PhilLeads** — a Philippine B2B Intelligence Platform. This is the frontend for an existing N8N + Baserow backend pipeline that collects, enriches, and stores Philippine company data.

The frontend connects to two backends:
1. **Baserow REST API** — reads all stored lead data
2. **N8N Webhook** — triggers new lead discovery

---

## TECH STACK

- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Maps:** Leaflet.js + react-leaflet
- **HTTP Client:** axios
- **Routing:** react-router-dom
- **Icons:** lucide-react
- **Export:** PapaParse (CSV), jsPDF (PDF)

---

## BACKEND CONFIGURATION

### Baserow REST API
- Base URL: `http://localhost:85`
- API Token: `z4fVqkHKIKcWxTCAMECwoCk6MoMAVw3N`
- Table ID: `683`
- Database ID: `168`

All requests to Baserow must include this header:
```
Authorization: Token z4fVqkHKIKcWxTCAMECwoCk6MoMAVw3N
```

### Baserow Endpoints Used

**Get all leads (paginated):**
```
GET http://localhost:85/api/database/rows/table/683/?user_field_names=true&page=1&size=100
```

**Filter leads by industry:**
```
GET http://localhost:85/api/database/rows/table/683/?user_field_names=true&filter__industry__equal=BPO
```

**Filter leads by city:**
```
GET http://localhost:85/api/database/rows/table/683/?user_field_names=true&filter__city__equal=Makati
```

**Search leads by company name:**
```
GET http://localhost:85/api/database/rows/table/683/?user_field_names=true&search=UnionBank
```

**Get single lead:**
```
GET http://localhost:85/api/database/rows/table/683/{row_id}/?user_field_names=true
```

### N8N Webhook
- Test URL: `http://localhost:5678/webhook/leads/search`
- Production URL: `http://localhost:5678/webhook/leads/search`
- Method: POST
- Body: `{ "keyword": "BPO" }`
- Response: `{ "status": "ok", "message": "Lead generation complete" }`

---

## LEAD DATA SCHEMA

Each lead row from Baserow has these fields:

```json
{
  "id": 1,
  "company_name": "string",
  "domain": "string — e.g. gcash.com",
  "industry": "BPO | FinTech | Healthcare | Retail | Manufacturing | Tech | Real Estate | Logistics | Education | Other",
  "size_tier": "SMB (<50) | Mid-Market (50–500) | Enterprise (500+)",
  "headcount": "number",
  "city": "string — e.g. Makati, Cebu City, Taguig",
  "region": "string — e.g. NCR, Region VII",
  "country": "Philippines",
  "sec_registration_no": "string or null",
  "tech_stack": "string or null",
  "funding_stage": "Bootstrapped | Seed | Series A/B/C | Public | Unknown",
  "linkedin_url": "string or null",
  "email_contact": "string or null",
  "phone_number": "string or null",
  "mobile_number": "string or null",
  "source": "apollo | hunter | pdl",
  "raw_description": "string or null",
  "created_at": "ISO8601 datetime",
  "last_updated": "ISO8601 datetime"
}
```

---

## PAGES AND FEATURES TO BUILD

### 1. Layout & Navigation
Build a sidebar navigation with these pages:
- 🏠 Dashboard (Analytics)
- 🔍 Lead Search & Discovery
- 📋 Lead Table
- 🗺️ Company Map
- 📈 Enrichment Tracker
- 🔔 New Leads Feed

Include a top header with:
- PhilLeads logo/name
- Total leads count (live from Baserow)
- Dark/light mode toggle

---

### 2. 🏠 Dashboard — Analytics (MAJOR FEATURE)

This is the main page. Show these charts and stats:

**Summary Cards (top row):**
- Total Companies
- Total Cities covered
- Industries tracked
- Companies with Email Contact

**Charts:**

A) **Industry Breakdown — Pie Chart (Recharts)**
- Count companies per industry
- Colors: BPO=blue, FinTech=green, Healthcare=red, Real Estate=orange, Manufacturing=gray, Tech=purple, Retail=yellow, Logistics=teal, Education=pink, Other=slate

B) **Size Tier Distribution — Bar Chart (Recharts)**
- X axis: SMB, Mid-Market, Enterprise
- Y axis: count
- Show percentage labels on bars

C) **Top 10 Cities — Horizontal Bar Chart (Recharts)**
- Most common cities where companies are located
- Example: Makati, Taguig, Pasig, Cebu City, etc.

D) **Funding Stage Distribution — Donut Chart (Recharts)**
- Bootstrapped, Public, Seed, Series A/B/C, Unknown

E) **Headcount by Industry — Grouped Bar Chart (Recharts)**
- Average headcount per industry
- Helps see which industry has larger companies

F) **Companies Added Over Time — Line Chart (Recharts)**
- X axis: dates from created_at field
- Y axis: cumulative count
- Shows pipeline growth

G) **Industry x City Heatmap — Table style**
- Rows = industries, Columns = top cities
- Cell = count of companies
- Color intensity based on count

---

### 3. 🔍 Lead Search & Discovery

This page triggers the N8N webhook to discover new leads.

**Components:**

A) **Search Form**
- Keyword input field (type: BPO, FinTech, Healthcare, etc.)
- Suggested keywords as clickable badges: BPO, FinTech, Healthcare, Real Estate, Manufacturing, Retail, Logistics, Education, Tech, Banking, Pharmaceutical, Insurance, Construction, Energy, Food
- "Discover Leads" button
- On submit: POST to N8N webhook with `{ "keyword": selectedKeyword }`
- Show loading spinner while N8N processes (it takes 30-60 seconds due to Wait node)
- Show success message with count when done

B) **Recent Searches**
- List of last 5 keywords searched (stored in localStorage)
- Click to re-run

C) **Discovery Status**
- Shows "Last run: X minutes ago"
- Shows total leads in database

---

### 4. 📋 Lead Table

Full paginated table of all leads from Baserow.

**Features:**
- Columns: Company Name, Domain, Industry, Size Tier, City, Headcount, Funding Stage, Email, Source, Created At
- Sort by any column (click header)
- Filter bar at top:
  - Industry dropdown (All, BPO, FinTech, Healthcare, etc.)
  - City input
  - Size Tier dropdown
  - Funding Stage dropdown
  - Search by company name
- Pagination (25 per page)
- Click row → opens Company Profile modal/page
- Export buttons: CSV, Excel

**Industry badges with colors** (matching dashboard colors)
**Size tier badges:** SMB=green, Mid-Market=yellow, Enterprise=red

---

### 5. 🏢 Company Profile Page/Modal

Show when user clicks a company in the table or map.

**Layout:**
- Company name as heading
- Domain as link (opens website)
- Industry badge, Size tier badge, Funding stage badge
- Source tag (apollo/hunter/pdl)

**Info sections:**
- Contact: email_contact, phone_number, mobile_number
- Profile: headcount, city, region, country
- Links: linkedin_url (clickable), domain (clickable)
- Description: raw_description (if available)
- Metadata: created_at, last_updated, source

---

### 6. 🗺️ Philippine Company Map (Leaflet.js)

Interactive map centered on the Philippines.

**Features:**
- Use react-leaflet with OpenStreetMap tiles
- Place markers for each company based on city
- Use these hardcoded city coordinates for Philippine cities:

```javascript
const CITY_COORDINATES = {
  'Manila': [14.5995, 120.9842],
  'Makati': [14.5547, 121.0244],
  'Taguig': [14.5176, 121.0509],
  'Pasig': [14.5764, 121.0851],
  'Quezon City': [14.6760, 121.0437],
  'Mandaluyong': [14.5794, 121.0359],
  'Pasay': [14.5378, 121.0014],
  'Cebu City': [10.3157, 123.8854],
  'Davao City': [7.1907, 125.4553],
  'Batangas': [13.7565, 121.0583],
  'Cavite': [14.2829, 120.8686],
  'Laguna': [14.1407, 121.4692],
  'Pampanga': [15.0794, 120.6200],
  'Iloilo City': [10.7202, 122.5621],
  'Cagayan de Oro': [8.4542, 124.6319],
  'Antipolo': [14.5862, 121.1760],
  'Muntinlupa': [14.4081, 121.0415],
  'San Fernando': [15.0289, 120.6897],
  'Taytay': [14.5611, 121.1320],
  'Ormoc': [11.0064, 124.6073],
  'Parañaque': [14.4793, 121.0198],
  'Las Piñas': [14.4453, 120.9830],
  'Valenzuela': [14.7011, 120.9830],
  'Marikina': [14.6507, 121.1029],
  'Caloocan': [14.6500, 120.9667]
};
```

- Marker color by industry (matching dashboard colors)
- Click marker → show company info popup with name, industry, city, headcount
- Filter panel on the left:
  - Industry filter (checkboxes)
  - Size tier filter
- Marker clustering for cities with many companies
- Legend showing industry colors

---

### 7. 📈 Enrichment Status Tracker

Shows data completeness for all leads.

**Summary cards:**
- % leads with email contact
- % leads with LinkedIn URL
- % leads with phone number
- % leads with headcount data

**Table:**
- Company Name | Email ✅/❌ | LinkedIn ✅/❌ | Phone ✅/❌ | Headcount ✅/❌ | Enrich Button
- "Enrich Now" button per row (disabled for now, shows tooltip: "Coming soon — Hunter.io and PDL enrichment")
- Color code rows: fully enriched = green bg, partially = yellow, missing all = red

**Progress bars:**
- Overall data completeness progress bar
- Per-field completion percentage

---

### 8. 🔔 New Leads Feed

Shows recently added companies.

**Features:**
- List of leads sorted by created_at descending
- Show last 50 additions
- Each item shows: company name, industry badge, city, when added (relative time: "2 hours ago")
- Filter by industry
- "X new leads today" counter at top
- Auto-refresh every 60 seconds

---

### 9. 📤 Export & Reports

**CSV Export:**
- Export all current filtered leads as CSV
- Use PapaParse library
- Filename: `philleads_export_YYYY-MM-DD.csv`

**PDF Report:**
- Use jsPDF
- Include: summary stats, industry breakdown table, top cities table
- Filename: `philleads_report_YYYY-MM-DD.pdf`

---

## IMPORTANT IMPLEMENTATION NOTES

### CORS Issue
Since Baserow runs on `localhost:85` and your React app runs on `localhost:3000`, you will hit CORS errors. Handle this by:
- Creating a simple proxy in `vite.config.js`:

```javascript
export default {
  server: {
    proxy: {
      '/baserow-api': {
        target: 'http://localhost:85',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/baserow-api/, '')
      },
      '/n8n-api': {
        target: 'http://localhost:5678',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/n8n-api/, '')
      }
    }
  }
}
```

Then use `/baserow-api/api/database/rows/table/683/` in your fetch calls instead of the full URL.

### API Service File
Create `src/services/api.js` with these functions:

```javascript
const BASEROW_TOKEN = 'z4fVqkHKIKcWxTCAMECwoCk6MoMAVw3N';
const TABLE_ID = '683';

export const getLeads = async (params = {}) => { ... }
export const getLeadById = async (id) => { ... }
export const searchLeads = async (query) => { ... }
export const filterLeads = async (filters) => { ... }
export const triggerLeadSearch = async (keyword) => { ... }
export const getAllLeadsForAnalytics = async () => { ... } // fetches all pages
```

### Loading States
Every data fetch must show a loading skeleton or spinner. Never show empty UI while data loads.

### Error Handling
If Baserow is unreachable, show a friendly error: "Cannot connect to database. Make sure Baserow is running at localhost:85"

If N8N webhook fails, show: "Lead discovery failed. Make sure N8N is running at localhost:5678"

### Responsive Design
- Desktop first (dashboard is complex)
- Sidebar collapses on mobile to bottom nav
- Table scrolls horizontally on mobile
- Map takes full screen on mobile

---

## FILE STRUCTURE

```
src/
├── components/
│   ├── Layout/
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── Layout.jsx
│   ├── Charts/
│   │   ├── IndustryPieChart.jsx
│   │   ├── SizeTierBarChart.jsx
│   │   ├── CityBarChart.jsx
│   │   ├── FundingDonutChart.jsx
│   │   ├── HeadcountChart.jsx
│   │   ├── GrowthLineChart.jsx
│   │   └── IndustryCityHeatmap.jsx
│   ├── Map/
│   │   └── PhilippinesMap.jsx
│   ├── Table/
│   │   ├── LeadTable.jsx
│   │   ├── LeadTableFilters.jsx
│   │   └── Pagination.jsx
│   ├── Company/
│   │   └── CompanyProfile.jsx
│   ├── common/
│   │   ├── IndustryBadge.jsx
│   │   ├── SizeTierBadge.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   └── StatCard.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── LeadSearch.jsx
│   ├── LeadTable.jsx
│   ├── CompanyMap.jsx
│   ├── EnrichmentTracker.jsx
│   ├── NewLeadsFeed.jsx
│   └── ExportReports.jsx
├── services/
│   └── api.js
├── hooks/
│   ├── useLeads.js
│   └── useAnalytics.js
├── utils/
│   ├── cityCoordinates.js
│   ├── industryColors.js
│   └── exportHelpers.js
├── App.jsx
└── main.jsx
```

---

## INDUSTRY COLORS (use consistently across all charts, badges, map)

```javascript
export const INDUSTRY_COLORS = {
  'BPO': '#3B82F6',        // blue
  'FinTech': '#10B981',    // green
  'Healthcare': '#EF4444', // red
  'Real Estate': '#F97316',// orange
  'Manufacturing': '#6B7280',// gray
  'Tech': '#8B5CF6',       // purple
  'Retail': '#EAB308',     // yellow
  'Logistics': '#14B8A6',  // teal
  'Education': '#EC4899',  // pink
  'Other': '#94A3B8'       // slate
};
```

---

## BUILD ORDER (do in this sequence)

1. Vite + React + Tailwind setup
2. Routing + Layout + Sidebar
3. API service file with all Baserow calls
4. Dashboard page with all charts
5. Lead Table page with filters
6. Company Profile modal
7. Lead Search page with N8N webhook trigger
8. Philippine Map page
9. Enrichment Tracker
10. New Leads Feed
11. Export functionality

---

## STARTING COMMAND

```bash
npm create vite@latest philleads -- --template react
cd philleads
npm install tailwindcss @tailwindcss/vite recharts react-leaflet leaflet axios react-router-dom lucide-react papaparse jspdf
```

Build the complete application following all specifications above. Start with step 1 and show me each component before moving to the next.
