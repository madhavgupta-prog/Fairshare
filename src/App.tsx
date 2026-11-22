import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ActiveTrips from './routes/ActiveTrips';
import Dashboard from './routes/Dashboard';
import History from './routes/History';
import Landing from './routes/Landing';
import Profile from './routes/Profile';
import TripLedger from './routes/TripLedger';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trip/:tripId"
        element={
          <ProtectedRoute>
            <TripLedger />
          </ProtectedRoute>
        }
      />
      <Route
        path="/active-trips"
        element={
          <ProtectedRoute>
            <ActiveTrips />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
