import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DocumentReferencesPage from './pages/DocumentReferencesPage';

const AppRoutes: React.FC = () => {
  const { loading, authenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={authenticated ? <Navigate to="/home" replace /> : <LoginPage />} 
      />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/document-references"
        element={
          <ProtectedRoute>
            <DocumentReferencesPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/" 
        element={<Navigate to="/home" replace />} 
      />
      <Route 
        path="*" 
        element={<Navigate to="/home" replace />} 
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;