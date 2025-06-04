import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDoctors, createAppointment } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { Calendar, Clock, Check, AlertCircle } from 'lucide-react';

const AppointmentBooking = ({ onSuccess }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form state
  const [formData, setFormData] = useState({
    doctor_id: location.state?.doctorId || '',
    date: '',
    time: ''
  });
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);
  
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
    setSuccess(false);
    setSubmitting(true);
    
    // Validate form data
    if (!formData.doctor_id || !formData.date || !formData.time) {
      setError('Please fill out all fields');
      setSubmitting(false);
      return;
    }
    
    try {
      await createAppointment(formData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        doctor_id: '',
        date: '',
        time: ''
      });
      
      // Notify parent component
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/patient-portal/appointments');
      }, 2000);
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError(
        err.response?.data?.detail || 
        'Failed to book appointment. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };
  
  // Get current date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];
  
  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-md flex items-start">
          <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>Appointment booked successfully! Redirecting...</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="doctor_id" className="block text-gray-700 font-medium mb-2">
            Select Doctor
          </label>
          <select
            id="doctor_id"
            name="doctor_id"
            value={formData.doctor_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={submitting}
          >
            <option value="">-- Select a Doctor --</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.user.username}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
            Appointment Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="date"
              name="date"
              type="date"
              min={today}
              value={formData.date}
              onChange={handleChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={submitting}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="time" className="block text-gray-700 font-medium mb-2">
            Appointment Time
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={submitting}
            >
              <option value="">-- Select a Time --</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
          disabled={submitting}
        >
          {submitting ? (
            <LoadingSpinner size="small\" color="white" />
          ) : (
            <>
              <Calendar className="h-5 w-5 mr-2" />
              Book Appointment
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AppointmentBooking;