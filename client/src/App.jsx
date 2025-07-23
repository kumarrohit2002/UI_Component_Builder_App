import React, { useEffect } from 'react';
import { useAuthContext } from './contexts/AuthContext';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthContext();

  const checkAuthentication = async () => {
    if(isAuthenticated) return;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/isAuthenticated`, {
        withCredentials: true,
      });
      if (response.data.isSuccess) {
        setIsAuthenticated(true);
        console.log('User is authenticated');
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
      console.error('Auth check error:', error.message);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>}/>

    </Routes>
  );
};

export default App;
