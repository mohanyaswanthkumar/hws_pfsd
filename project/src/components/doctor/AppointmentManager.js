import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAppointments, updateAppointment, deleteAppointment } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { Calendar, Clock, AlertCircle, Eye, Trash2 } from 'lucide-react';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  React.useEffect(() => {
    const errorHandler = (error) => {
      console.error('ErrorBoundary caught:', error);
      setHasError(true);
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);
  if (hasError) {
    return (
      <div className="p-6">
        <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          Something went wrong. Please refresh the page.
        </div>
      </div>
    );
  }
  return children;
};

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const data = await getAppointments();
      if (!Array.isArray(data)) {
        throw new Error('Invalid API response: Expected array');
      }
      const validAppointments = data
        .filter((appt) => {
          if (!appt || !appt.id) {
            console.warn('Invalid appointment skipped:', appt);
            return false;
          }
          return true;
        })
        .map((appt) => ({
          id: appt.id,
          patient: appt.patient?.username || appt.patient?.user?.username || appt.patient?.name || 'Unknown',
          date: appt.date || 'N/A',
          time: appt.time || 'N/A',
          status: (appt.status || 'pending').toLowerCase(),
        }));
      setAppointments(validAppointments);
      setError('');
      console.log('Appointments loaded:', validAppointments);
    } catch (err) {
      const errMsg = `Failed to load appointments: ${err.response?.status || ''} ${err.response?.data?.detail || err.message}`;
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

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoading(true);
      await updateAppointment(id, { status: newStatus });
      await fetchAppointments();
    } catch (err) {
      setError(`Failed to update appointment: ${err.response?.data?.detail || err.message}`);
      console.error('Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      setLoading(true);
      await deleteAppointment(id);
      await fetchAppointments();
    } catch (err) {
      setError(`Failed to delete appointment: ${err.response?.data?.detail || err.message}`);
      console.error('Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Appointment Manager</h2>
        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
            {error}
          </div>
        )}
        {loading && !appointments.length ? (
          <div className="py-10 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{appt.patient}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{appt.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{appt.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appt.status === 'booked'
                            ? 'bg-green-100 text-green-800'
                            : appt.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                      {appt.id && (
                        <Link
                          to={`/doctor-portal/appointments/${appt.id}`}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      )}
                      {appt.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(appt.id, 'booked')}
                            className="text-green-600 hover:text-green-800"
                            disabled={loading}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusChange(appt.id, 'cancelled')}
                            className="text-red-600 hover:text-red-800"
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(appt.id)}
                        className="text-red-600 hover:text-red-800 flex items-center"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && !appointments.length && (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">No appointments found</h3>
                <p className="text-gray-600">You have no scheduled appointments.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AppointmentManager;