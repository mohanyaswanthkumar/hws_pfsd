import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
  username: '',
  email: '',
  password: '',
  role: 'patient',
  phone: '',
  address: '',
  profile_photo: ''
});
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }
    
    try {
      await register(formData);
      // Redirect to login on success
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.detail || 
        'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 mt-2">Join our healthcare platform today</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Choose a username"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Create a password"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
              Register as
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="mb-4">
  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone</label>
  <input
    id="phone"
    name="phone"
    type="text"
    value={formData.phone}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
    placeholder="Enter phone number"
  />
</div>

<div className="mb-4">
  <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Address</label>
  <textarea
    id="address"
    name="address"
    value={formData.address}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
    placeholder="Enter address"
  />
</div>

<div className="mb-6">
  <label htmlFor="profile_photo" className="block text-gray-700 font-medium mb-2">Profile Photo URL</label>
  <input
    id="profile_photo"
    name="profile_photo"
    type="text"
    value={formData.profile_photo}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
    placeholder="Optional profile photo URL"
  />
</div>

          
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="small\" color="white" />
            ) : (
              <>
                <UserPlus className="h-5 w-5 mr-2" />
                Register
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;