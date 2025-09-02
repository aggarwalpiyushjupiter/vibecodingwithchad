import { Route, Routes, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { AuthPage } from './pages/AuthPage';
import { InstancesPage } from './pages/InstancesPage';
import { InstancePage } from './pages/InstancePage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './lib/auth/AuthContext';
import { ToastProvider } from './lib/ui/ToastContext';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<AppLayout />}>
            <Route
              path="/instances"
              element={
                <ProtectedRoute>
                  <InstancesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instances/:instanceId/*"
              element={
                <ProtectedRoute>
                  <InstancePage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/auth" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

