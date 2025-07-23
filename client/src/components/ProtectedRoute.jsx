// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  // Prevent flickering during auth check
  if (isAuthenticated === undefined) {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;
