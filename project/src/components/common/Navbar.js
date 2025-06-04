import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, LogOut, LogIn, UserPlus, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Activity className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">HealthCare System</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <>
                <Link 
                  to={
                    user.role === 'patient' ? '/patient-portal' : 
                    user.role === 'doctor' ? '/doctor-portal' : '/admin-portal'
                  }
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="px-3 py-2 rounded-md text-sm font-medium text-gray-700">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-4 flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;