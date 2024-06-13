import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from './components/api';

const ProtectedRoute = ({ element: Element }) => {
  const location = useLocation();
  return getCurrentUser() ? (
    <Element />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default ProtectedRoute;
