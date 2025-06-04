import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAppointments, getPrescriptions, getLeaves } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { Calendar, FileText, Clock, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(true);
  const [loadingLeaves, setLoadingLeaves] = useState(true);
  const [errorAppointments, setErrorAppointments] = useState('');
  const [errorPrescriptions, setErrorPrescriptions] = useState('');
  const [errorLeaves, setErrorLeaves] = useState('');

  // Current date and time (May 29, 2025, 01:23 PM IST)
  const currentDateTime = new Date('2025-05-29T13:23:00+05:30');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        if (!Array.isArray(data)) throw new Error('Invalid API response: Expected array');

        const upcomingAppointments = data
          .filter(appt => {
            if (!appt || !appt.id) {
              console.warn('Invalid appointment skipped:', appt);
              return false;
            }
            const apptDateTime = new Date(`${appt.date}T${appt.time}+05:30`);
            return (
              appt.status?.toLowerCase() === 'booked' &&
              !('prescription' in appt) &&
              apptDateTime >= currentDateTime
            );
          })
          .map(appt => ({
            id: appt.id,
            patient: appt.patient?.username || 'Unknown',
            doctor: appt.doctor?.user?.username || 'Unknown',
            date: appt.date || 'N/A',
            time: appt.time.split(':').slice(0, 2).join(':') || 'N/A',
            status: (appt.status || 'booked').toLowerCase(),
          }))
          .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
          .slice(0, 3);

        setAppointments(upcomingAppointments);
        setErrorAppointments('');
        console.log('Admin Appointments:', upcomingAppointments);
      } catch (err) {
        setErrorAppointments(`Failed to load appointments: ${err.message}`);
        console.error('Appointments Error:', err);
      } finally {
        setLoadingAppointments(false);
      }
    };

    const fetchPrescriptions = async () => {
      try {
        const data = await getPrescriptions();
        if (!Array.isArray(data)) throw new Error('Invalid API response: Expected array');

        const formattedPrescriptions = data
          .map(presc => ({
            id: presc.id || '',
            patient: presc.appointment?.patient?.username || 'N/A',
            doctor: presc.appointment?.doctor?.user?.username || 'N/A',
            medication: presc.medication || 'N/A',
            dosage: presc.dosage || 'N/A',
            instructions: presc.instructions || 'No instructions',
            date: presc.created_at ? new Date(presc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);

        setPrescriptions(formattedPrescriptions);
        setErrorPrescriptions('');
        console.log('Admin Prescriptions:', formattedPrescriptions);
      } catch (err) {
        setErrorPrescriptions(`Failed to load prescriptions: ${err.message}`);
        console.error('Prescriptions Error:', err);
      } finally {
        setLoadingPrescriptions(false);
      }
    };

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
          }))
          .slice(0, 3);

        setLeaveRequests(formattedLeaves);
        setErrorLeaves('');
        console.log('Admin Leaves:', formattedLeaves);
      } catch (err) {
        setErrorLeaves(`Failed to load leave requests: ${err.message}`);
        console.error('Leaves Error:', err);
      } finally {
        setLoadingLeaves(false);
      }
    };

    fetchAppointments();
    fetchPrescriptions();
    fetchLeaves();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Upcoming Appointments"
          value={appointments.length}
          icon={<Calendar className="h-8 w-8 text-blue-600" />}
          link="/admin-portal/appointments"
        />
        <StatCard
          title="Recent Prescriptions"
          value={prescriptions.length}
          icon={<FileText className="h-8 w-8 text-blue-600" />}
          link="/admin-portal/prescriptions"
        />
        <StatCard
          title="Pending Leave Requests"
          value={leaveRequests.length}
          icon={<Clock className="h-8 w-8 text-blue-600" />}
          link="/admin-portal/leave-approval"
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-blue-700">Upcoming Appointments</h3>
          <Link to="/admin-portal/appointments" className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        {loadingAppointments ? (
          <div className="py-6 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : errorAppointments ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {errorAppointments}
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-3">
            {appointments.map(appt => (
              <div key={appt.id} className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-colors">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium text-blue-800">Patient: {appt.patient}</h4>
                    <p className="text-gray-600 text-sm">Doctor: {appt.doctor}</p>
                    <p className="text-gray-600 text-sm">{appt.date} at {appt.time}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-md">
                    {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-white rounded-md">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No upcoming appointments</p>
            <Link
              to="/admin-portal/appointments"
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
          <Link to="/admin-portal/prescriptions" className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        {loadingPrescriptions ? (
          <div className="py-6 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : errorPrescriptions ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {errorPrescriptions}
          </div>
        ) : prescriptions.length > 0 ? (
          <div className="space-y-3">
            {prescriptions.map(presc => (
              <div key={presc.id} className="bg-white p-4 rounded-md shadow-sm">
                <div>
                  <h4 className="font-medium text-blue-800">Patient: {presc.patient}</h4>
                  <p className="text-gray-600 text-sm">Doctor: {presc.doctor}</p>
                  <p className="text-gray-600 text-sm">{presc.medication} ({presc.dosage})</p>
                  <p className="text-gray-600 text-sm">{presc.instructions}</p>
                  <p className="text-gray-600 text-sm">Issued: {presc.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-white rounded-md">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No recent prescriptions</p>
            <Link
              to="/admin-portal/prescriptions"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              View Prescriptions
            </Link>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-blue-700">Pending Leave Requests</h3>
          <Link to="/admin-portal/leave" className="text-sm text-blue-600 hover:text-blue-800">
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
            {leaveRequests.map(leave => (
              <div key={leave.id} className="bg-white p-4 rounded-md shadow-sm">
                <div>
                  <h4 className="font-medium text-blue-800">Doctor: {leave.doctor}</h4>
                  <p className="text-gray-600 text-sm">Reason: {leave.reason}</p>
                  <p className="text-gray-600 text-sm">From {leave.start_date} to {leave.end_date}</p>
                  <p className="text-gray-600 text-sm">
                    Status: {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-white rounded-md">
            <Clock className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-600">No pending leave requests</p>
            <Link
              to="/admin-portal/leave"
              className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600"
            >
              Review Leave Requests
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, link }) => (
  <Link to={link} className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center">
      <div className="mr-6">{icon}</div>
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  </Link>
);

export default Dashboard;