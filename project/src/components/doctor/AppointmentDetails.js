import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAppointmentDetail } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { AlertCircle, Calendar, Clock, User, ArrowLeft } from 'lucide-react';

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        console.log(`Fetching appointment details for ID: ${id}`);
        const data = await getAppointmentDetail(id);
        setAppointment({
          id: data.id || '',
          patient: data.patient?.username || data.patient?.user?.username || data.patient?.name || 'Unknown',
          date: data.date || 'N/A',
          time: data.time || 'N/A',
          status: (data.status || 'pending').toLowerCase(),
          notes: data.notes || 'No notes provided',
        });
        setError('');
        console.log('Appointment details loaded:', data);
      } catch (err) {
        const errMsg = `Failed to load appointment details: ${err.response?.status || ''} ${err.response?.data?.detail || err.message}`;
        setError(errMsg);
        console.error('Error details:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          {error}
        </div>
        <Link
          to="/doctor-portal/appointments"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Appointments
        </Link>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="p-6">
        <div className="mb-6 p-3 bg-yellow-100 border border-yellow-200 text-yellow-700 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          Appointment not found
        </div>
        <Link
          to="/doctor-portal/appointments"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Appointments
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link
        to="/doctor-portal/appointments"
        className="text-blue-600 hover:text-blue-800 flex items-center mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Appointments
      </Link>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Appointment Details</h2>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <User className="h-5 w-5 text-gray-500 mr-2 mt-1" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Patient</h3>
              <p className="text-gray-800">{appointment.patient}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-1" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="text-gray-800">{appointment.date}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-gray-500 mr-2 mt-1" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Time</h3>
              <p className="text-gray-800">{appointment.time}</p>
            </div>
          </div>
          <div className="flex items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'booked'
                    ? 'bg-green-100 text-green-800'
                    : appointment.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
            <p className="text-gray-800">{appointment.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;