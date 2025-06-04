import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeaves } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { Calendar, FileText, Clock, AlertCircle } from 'lucide-react';

const Dashboard = ({ appointments, prescriptions }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);
  const [errorLeaves, setErrorLeaves] = useState('');

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const leaveData = await getLeaves();
        if (!Array.isArray(leaveData)) {
          throw new Error('Invalid API response: Expected array');
        }

        const formattedLeaves = leaveData
          .filter(req => req.status?.toLowerCase() === 'pending')
          .map(req => ({
            id: req.id || '',
            start_date: req.start_date ? new Date(req.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            end_date: req.end_date ? new Date(req.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            reason: req.reason || 'No reason provided',
            status: req.status || 'pending',
          }))
          .slice(0, 3);

        setLeaveRequests(formattedLeaves);
        setErrorLeaves('');
        console.log('Formatted Leaves:', formattedLeaves);
      } catch (err) {
        setErrorLeaves(`Failed to load leave requests: ${err.message}`);
        console.error('Error:', err);
      } finally {
        setLoadingLeaves(false);
      }
    };

    fetchLeaves();
  }, []);

  // Ensure arrays
  const upcomingAppointments = Array.isArray(appointments) ? appointments : [];
  const recentPrescriptions = Array.isArray(prescriptions) ? prescriptions : [];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Doctor Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length}
          icon={<Calendar className="h-8 w-8 text-blue-600" />}
          link="/doctor-portal/appointments"
        />
        <StatCard
          title="Recent Prescriptions"
          value={recentPrescriptions.length}
          icon={<FileText className="h-8 w-8 text-blue-600" />}
          link="/doctor-portal/prescriptions"
        />
        <StatCard
          title="Pending Leave Requests"
          value={leaveRequests.length}
          icon={<Clock className="h-8 w-8 text-blue-600" />}
          link="/doctor-portal/leave"
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-blue-700">Upcoming Appointments</h3>
          <Link to="/doctor-portal/appointments" className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-colors"
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium text-blue-800">{appointment.patient}</h4>
                    <p className="text-gray-600 text-sm">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-md">
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-white rounded-md">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">You have no upcoming appointments</p>
            <Link
              to="/doctor-portal/appointments"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              View Appointments
            </Link>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-blue-700">Recent Prescriptions</h3>
          <Link to="/doctor-portal/prescriptions" className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        {recentPrescriptions.length > 0 ? (
          <div className="space-y-3">
            {recentPrescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="bg-white p-4 rounded-md shadow-sm"
              >
                <div>
                  <h4 className="font-medium text-blue-800">{prescription.patient}</h4>
                  <p className="text-gray-600 text-sm">{prescription.medication} ({prescription.dosage})</p>
                  <p className="text-gray-600 text-sm">{prescription.instructions}</p>
                  <p className="text-gray-600 text-sm">Issued: {prescription.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-white rounded-md">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">You have no recent prescriptions</p>
            <Link
              to="/doctor-portal/prescriptions"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Upload Prescription
            </Link>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-blue-700">Pending Leave Requests</h3>
          <Link to="/doctor-portal/leave" className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        {loadingLeaves ? (
          <div className="py-6 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : errorLeaves ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {errorLeaves}
          </div>
        ) : leaveRequests.length > 0 ? (
          <div className="space-y-3">
            {leaveRequests.map((leave) => (
              <div
                key={leave.id}
                className="bg-white p-4 rounded-md shadow-sm"
              >
                <div>
                  <h4 className="font-medium text-blue-800">{leave.reason}</h4>
                  <p className="text-gray-600 text-sm">
                    From {leave.start_date} to {leave.end_date}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Status: {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-white rounded-md">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">You have no pending leave requests</p>
            <Link
              to="/doctor-portal/leave"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Request Leave
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, link }) => (
  <Link to={link} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-colors">
    <div className="flex items-center">
      <div className="mr-4">{icon}</div>
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  </Link>
);

export default Dashboard;