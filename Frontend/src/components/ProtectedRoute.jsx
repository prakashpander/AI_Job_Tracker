import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Jab tak token verify ho raha hai — loader dikhao
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0a0a0f] text-[#e8e8f0]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7c3aed] border-t-transparent"></div>
          <p className="font-mono text-sm tracking-wider text-[#9ca3af]">
            LOADING AUTHENTICATION STATE...
          </p>
        </div>
      </div>
    );
  }

  // Token valid hai → page dikhao, nahi hai → login pe bhejo
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;