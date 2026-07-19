import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/Layout/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportDamage from './pages/citizen/ReportDamage';
import MyReports from './pages/citizen/MyReports';
import MapView from './pages/citizen/MapView';
import SafeRoute from './pages/citizen/SafeRoute';
import LiveDetection from './pages/citizen/LiveDetection';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CityMap from './pages/admin/CityMap';
import ReportsManagement from './pages/admin/ReportsManagement';
import Analytics from './pages/admin/Analytics';
import AlertsPanel from './pages/admin/AlertsPanel';

// Maintenance Pages
import MaintenanceDashboard from './pages/maintenance/MaintenanceDashboard';
import TaskDetail from './pages/maintenance/TaskDetail';

// Settings (shared)
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const RoleRouter = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'maintenance') return <Navigate to="/maintenance/dashboard" replace />;
  return <Navigate to="/citizen/dashboard" replace />;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/" element={<ProtectedRoute><RoleRouter /></ProtectedRoute>} />

      {/* Citizen Routes */}
      <Route path="/citizen" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<CitizenDashboard />} />
        <Route path="report" element={<ReportDamage />} />
        <Route path="reports" element={<MyReports />} />
        <Route path="map" element={<MapView />} />
        <Route path="safe-route" element={<SafeRoute />} />
        <Route path="live-detection" element={<LiveDetection />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="map" element={<CityMap />} />
        <Route path="reports" element={<ReportsManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="alerts" element={<AlertsPanel />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Maintenance Routes */}
      <Route path="/maintenance" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<MaintenanceDashboard />} />
        <Route path="task/:id" element={<TaskDetail />} />
        <Route path="map" element={<MapView />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <HashRouter>
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  </HashRouter>
);

export default App;
