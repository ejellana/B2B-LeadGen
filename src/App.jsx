import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import LeadTablePage from './pages/LeadTable';
import CompanyMap from './pages/CompanyMap';
import NewLeadsFeed from './pages/NewLeadsFeed';
import ExportReports from './pages/ExportReports';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<LeadTablePage />} />
        <Route path="/map" element={<CompanyMap />} />
        <Route path="/feed" element={<NewLeadsFeed />} />
        <Route path="/export" element={<ExportReports />} />
      </Routes>
    </Layout>
  );
}

export default App;
