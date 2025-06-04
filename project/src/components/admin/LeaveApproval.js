import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeaves, updateLeave } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { AlertCircle, Check, X, Clock } from 'lucide-react';

const LeaveApproval = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const data = await getLeaves();
        if (!Array.isArray(data)) throw new Error('Invalid API response: Expected array');

        const formattedLeaves = data
          .filter(req => req.status?.toLowerCase() === 'pending')
          .map(req => ({
            id: req.id || '',
            doctor: req.doctor?.user?.username || 'N/A',
            start_date: req.start_date ? new Date(req.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            end_date: req.end_date ? new Date(req.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            reason: req.reason || 'No reason provided',
            status: req.status || 'pending',
          }));

        setLeaveRequests(formattedLeaves);
        setError('');
        console.log('Leave Requests:', formattedLeaves);
      } catch (err) {
        setError(`Failed to load leave requests: ${err.message}`);
        console.error('Leaves Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const handleStatusUpdate = async (leaveId, newStatus) => {
    try {
      await updateLeave(leaveId, { status: newStatus });
      setLeaveRequests(prev => prev.filter(leave => leave.id !== leaveId));
      setError('');
    } catch (err) {
      setError(`Failed to update leave request: ${err.message}`);
      console.error('Error updating leave:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6 text-blue-700">Leave Approval</h2>
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center mb-6">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
      {loading ? (
        <div className="py-10 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : leaveRequests.length > 0 ? (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 text-blue-700">Pending Leave Requests</h3>
          <div className="space-y-4">
            {leaveRequests.map(leave => (
              <div key={leave.id} className="bg-white p-4 rounded-md shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-blue-800">Doctor: {leave.doctor}</h4>
                  <p className="text-gray-600 text-sm">Reason: {leave.reason}</p>
                  <p className="text-gray-600 text-sm">From {leave.start_date} to {leave.end_date}</p>
                  <p className="text-gray-600 text-sm">
                    Status: {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusUpdate(leave.id, 'approved')}
                    className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
                    title="Approve"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(leave.id, 'rejected')}
                    className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
                    title="Reject"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-md">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No pending leave requests</p>
          <Link
            to="/admin-portal/leave"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            View All Leave Requests
          </Link>
        </div>
      )}
    </div>
  );
};

export default LeaveApproval;