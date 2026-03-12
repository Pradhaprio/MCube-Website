import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) {
    return <div className="container-shell py-20 text-center text-sm text-slate-500">Checking session...</div>;
  }
  if (!token) {
    return <Navigate to="/owner/login" replace />;
  }
  return children;
}
