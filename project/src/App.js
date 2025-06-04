import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientPortal from './pages/PatientPortal';
import DoctorPortal from './pages/DoctorPortal';
import AdminPortal from './pages/AdminPortal';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/\" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/patient-portal/*" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientPortal />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor-portal/*" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorPortal />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-portal/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPortal />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/\" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;