import React, { useState, useEffect } from 'react';
import { getLeaves, createLeave } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { Calendar, Check, AlertCircle } from 'lucide-react';

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
          Something went wrong. Please refresh the page or contact support.
        </div>
      </div>
    );
  }
  return children;
};

const LeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    reason: '',
  });

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const data = await getLeaves();
        setLeaveRequests(
          data.map((req) => ({
            id: req.id || '',
            start_date: req.start_date || 'N/A',
            end_date: req.end_date || 'N/A',
            reason: req.reason || 'No reason provided',
            status: req.status || 'pending',
          }))
        );
        setError('');
        console.log('Leaves fetched:', data);
      } catch (err) {
        const status = err.status || err.response?.status;
        let errMsg = 'Failed to load leave requests.';
        if (status === 403) {
          errMsg = 'Unauthorized: Please log in as a doctor with a valid account or contact support to verify your doctor profile.';
        } else if (err.detail || err.response?.data?.detail) {
          errMsg = err.detail || err.response.data.detail;
        } else if (err.response?.data) {
          errMsg = Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
        }
        setError(errMsg);
        console.error('Fetch leaves error:', err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveRequests();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'reason' ? value.trimStart() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    // Validate inputs
    if (!formData.start_date || !formData.end_date || !formData.reason) {
      setError('Please fill out all fields.');
      setSubmitting(false);
      return;
    }

    if (formData.end_date < formData.start_date) {
      setError('End date cannot be before start date.');
      setSubmitting(false);
      return;
    }

    const trimmedReason = formData.reason.trim();
    if (trimmedReason.length < 3) {
      setError('Reason must be at least 3 characters long.');
      setSubmitting(false);
      return;
    }

    if (trimmedReason.length > 500) {
      setError('Reason cannot exceed 500 characters.');
      setSubmitting(false);
      return;
    }

    const leaveData = {
      start_date: formData.start_date,
      end_date: formData.end_date,
      reason: trimmedReason,
      doctor_id: 0, // Dummy ID to satisfy serializer; overwritten by leave_create
    };

    console.log('Submitting leave request:', leaveData);

    try {
      const response = await createLeave(leaveData);
      setLeaveRequests((prev) => [
        {
          id: response.id,
          start_date: response.start_date,
          end_date: response.end_date,
          reason: response.reason,
          status: response.status || 'pending',
        },
        ...prev,
      ]);
      setSuccess('Leave request submitted successfully!');
      setFormData({ start_date: '', end_date: '', reason: '' });
      console.log('Leave created:', response);
    } catch (err) {
      const status = err.status || err.response?.status;
      let errMsg = 'Failed to submit leave request.';
      if (status === 403) {
        errMsg = 'Unauthorized: Please log in as a doctor with a valid account or contact support to verify your doctor profile.';
      } else if (status === 400 && err.response?.data) {
        errMsg = Object.entries(err.response.data)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ');
      } else if (err.detail || err.response?.data?.detail) {
        errMsg = err.detail || err.response.data.detail;
      } else {
        errMsg = err.message || 'An unexpected error occurred.';
      }
      setError(errMsg);
      console.error('Submit leave error:', err.response?.data || err);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <ErrorBoundary>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Leave Requests</h2>
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-md flex items-start">
              <Check className="h-5 w-5 mr-2 mt-0.5" />
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="start_date" className="block text-gray-700 font-medium mb-2">
                  Start Date
                </label>
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  min={today}
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={submitting}
                  required
                />
              </div>
              <div>
                <label htmlFor="end_date" className="block text-gray-700 font-medium mb-2">
                  End Date
                </label>
                <input
                  id="end_date"
                  name="end_date"
                  type="date"
                  min={formData.start_date || today}
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={submitting}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="reason" className="block text-gray-700 font-medium mb-2">
                  Reason
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={submitting}
                  rows="4"
                  required
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={submitting}
              >
                {submitting ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  <>
                    <Calendar className="h-5 w-5 mr-2 inline" />
                    Submit Leave Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <h3 className="text-lg font-medium text-gray-800 p-6">Previous Leave Requests</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaveRequests.map((req) => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {req.start_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {req.end_date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {req.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        req.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : req.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leaveRequests.length === 0 && (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-800 mb-1">No leave requests found</h3>
              <p className="text-gray-600">You have no submitted leave requests.</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LeaveRequest;