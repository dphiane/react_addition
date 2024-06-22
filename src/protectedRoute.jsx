import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getCurrentUser, removeToken } from './api';
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ element: Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCurrentUser();
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const tokenExpired = decodedToken.exp < Date.now() / 1000;
        if (tokenExpired) {
          // Redirection vers la page de connexion si le token est expiré
          setIsAuthenticated(false);
          removeToken()
          navigate('/login');
          console.log('token expired')
        }

      } catch (error) {
        console.error('Erreur lors du décodage du token JWT :', error);
        setIsAuthenticated(false);
        navigate('/login');
      }
    } else {
      console.log('non authentifiée')
      setIsAuthenticated(false);
      navigate('/login');
    }
  }, [navigate]);
  

  return isAuthenticated ? (
    <Element />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
