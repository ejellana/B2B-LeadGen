# PhilLeads Dashboard

### AI-Powered B2B Lead Generation Dashboard for Philippine Companies

PhilLeads Dashboard is a modern React-based frontend application built as part of my Internship. It serves as a visualization and management interface for an AI-powered B2B lead generation workflow developed in **n8n**.

The project was created to demonstrate how workflow automation, data enrichment, and business intelligence can be presented through an intuitive and responsive dashboard. While the backend automation is handled entirely by **n8n**, this frontend provides a professional user interface for viewing, filtering, analyzing, and exporting generated leads.

> **Note:** The primary focus of this internship project is the n8n workflow automation. This dashboard was independently developed to enhance visualization and improve the presentation of workflow results.

---

# Features

- **Dashboard:** Real-time statistics, analytics cards, interactive charts, and KPI overview.
- **Lead Management:** Search, filtering, pagination, company profile drawer, and quick copy actions.
- **Company Map:** Interactive Philippine map, clustered markers, industry-colored pins, tooltips, company drawer, reset view, and industry legend.
- **New Leads Feed:** Timeline feed, auto-refresh, relative timestamps, industry filters, live statistics, and company details.
- **Export & Reports:** CSV export, PDF report generation, dynamic statistics, industry breakdown, and city summaries.
- **User Experience:** Responsive design, dark/light mode, loading skeletons, empty states, error handling, smooth animations, and modern glassmorphism-inspired UI.

# Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- React Leaflet
- Leaflet Marker Cluster
- Recharts
- Lucide React
- PapaParse
- jsPDF

### Backend

- n8n Workflow Automation
- Baserow Database
- REST API
- Apollo.io – Company lead discovery
- Hunter.io – Email discovery
- People Data Labs (PDL) – Company enrichment
- Groq AI – AI-powered categorization

---

# Project Architecture

```text
┌──────────────────────────────────────────────┐
│           n8n Workflow Automation            │
│                                              │
│ • Apollo.io Lead Discovery                   │
│ • Hunter.io Email Lookup                     │
│ • People Data Labs Enrichment                │
│ • Groq AI Categorization                     │
└──────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│              Baserow Database                │
│                                              │
│ Stores discovered companies and lead data    │
└──────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│                 REST API                     │
│                                              │
│ Retrieves lead data for the frontend         │
└──────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│      PhilLeads Dashboard (React + Vite)      │
│                                              │
│ • Dashboard Analytics                        │
│ • Lead Management                            │
│ • Company Map                                │
│ • New Leads Feed                             │
│ • Export & Reports                           │
└──────────────────────────────────────────────┘
```

---

# Screenshots

## Dashboard
<img width="1440" height="777" alt="dashboard1" src="https://github.com/user-attachments/assets/e9dd9d7c-14be-4e35-bdd4-53b78ab4b5cc" />
<img width="1440" height="777" alt="dashboard2" src="https://github.com/user-attachments/assets/5256e53a-cfeb-4dbe-bb16-c6b529592171" />
<img width="1440" height="777" alt="dashboard3" src="https://github.com/user-attachments/assets/e19b918e-b6b6-4413-bbe3-96ed26988278" />

## Lead Management
<img width="1439" height="777" alt="leadtable" src="https://github.com/user-attachments/assets/44c8defc-a959-45aa-819e-daa3b1615acd" />
<img width="1439" height="777" alt="companyprofile" src="https://github.com/user-attachments/assets/e2333f45-20fe-44c5-80ce-58507801df86" />

## Company Map
<img width="1437" height="777" alt="companymap" src="https://github.com/user-attachments/assets/f5009c02-907c-4b6d-a06d-5f99b302ff45" />
<img width="1439" height="778" alt="companymap-profile" src="https://github.com/user-attachments/assets/1aef8645-5234-4cfb-8a07-c8cc2de59e88" />

## New Leads Feed
<img width="1440" height="777" alt="newleads" src="https://github.com/user-attachments/assets/a1c8b7ce-74cf-4eb9-8c2f-47334c2f5375" />

## Export & Reports
<img width="1440" height="778" alt="export" src="https://github.com/user-attachments/assets/c191a6a8-af9d-4bba-829b-1c1ad973de06" />

## n8n Backend Workflow
<img width="1326" height="569" alt="N8N-backend" src="https://github.com/user-attachments/assets/21378e8b-1576-48fa-9851-7f20bf23e19a" />

---

# Learning Outcomes

Throughout this project, I gained practical experience in:

* Building modern React applications
* Designing responsive dashboards
* Integrating frontend applications with REST APIs
* Data visualization and analytics
* Interactive mapping with React Leaflet
* Exporting reports in CSV and PDF formats
* Component-based architecture
* State management using React Hooks
* UI/UX design principles
* Working alongside workflow automation using n8n

---

# Acknowledgements

This project was developed during my Internship.

Special thanks to my internship supervisors and mentors for providing the opportunity to work with **n8n workflow automation**, API integrations, and business process automation. The frontend dashboard was independently designed and developed to provide a modern visualization layer for the automated lead generation system.
