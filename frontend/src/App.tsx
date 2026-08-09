import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { IncidentManagement } from './pages/IncidentManagement';
import { VolunteerManagement } from './pages/VolunteerManagement';
import { LocationIntelligence } from './pages/LocationIntelligence';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing/Welcome Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard Core Layout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/incidents" element={<IncidentManagement />} />
          <Route path="/volunteers" element={<VolunteerManagement />} />
          <Route path="/location" element={<LocationIntelligence />} />
        </Route>

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;