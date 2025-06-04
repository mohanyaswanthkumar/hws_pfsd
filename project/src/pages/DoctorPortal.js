import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Calendar, Activity, FileText, Clock, User, Users } from 'lucide-react';
import { getAppointments, getPrescriptions } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Dashboard from '../components/doctor/Dashboard';
import AppointmentManager from '../components/doctor/AppointmentManager';
import PrescriptionUpload from '../components/doctor/PrescriptionUpload';
import LeaveRequest from '../components/doctor/LeaveRequest';
import ProfileManager from '../components/doctor/ProfileManager';
import MyPatients from '../components/doctor/MyPatients';
import AppointmentDetails from '../components/doctor/AppointmentDetails';
import { AlertCircle } from 'lucide-react';
const DoctorPortal = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        if (!Array.isArray(data)) {
          throw new Error('Invalid API response: Expected array');
        }

        // Current date and time (May 29, 2025, 12:58 PM IST)
        const currentDateTime = new Date('2025-05-29T12:58:00+05:30');

        // Filter booked, non-prescribed, future appointments
        const upcomingAppointments = data
          .filter(appointment => {
            if (!appointment || !appointment.id) {
              console.warn('Invalid appointment skipped:', appointment);
              return false;
            }
            const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}+05:30`);
            return (
              appointment.status?.toLowerCase() === 'booked' &&
              !('prescription' in appointment) && // No prescription field
              appointmentDateTime >= currentDateTime
            );
          })
          .map(appointment => ({
            id: appointment.id,
            patient: appointment.patient?.username || appointment.patient?.user?.username || 'Unknown',
            date: appointment.date || 'N/A',
            time: appointment.time.split(':').slice(0, 2).join(':') || 'N/A', // Format HH:mm
            status: (appointment.status || 'booked').toLowerCase(),
          }))
          .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
          .slice(0, 3); // Limit to 3

        setAppointments(upcomingAppointments);
        console.log('Filtered Appointments:', upcomingAppointments);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again later.');
      }
    };

    const fetchPrescriptions = async () => {
      try {
        const data = await getPrescriptions();
        if (!Array.isArray(data)) {
          throw new Error('Invalid API response: Expected array');
        }

        // Format prescriptions, limit to 3 recent
        const formattedPrescriptions = data
          .map(presc => ({
            id: presc.id || '',
            patient: presc.appointment?.patient?.username || presc.appointment?.patient?.user?.username || 'N/A',
            medication: presc.medication || 'N/A',
            dosage: presc.dosage || 'N/A',
            instructions: presc.instructions || 'No instructions',
            date: presc.created_at ? new Date(presc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);

        setPrescriptions(formattedPrescriptions);
        console.log('Formatted Prescriptions:', formattedPrescriptions);
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
        setError('Failed to load prescriptions. Please try again later.');
      }
    };

    const fetchData = async () => {
      try {
        await Promise.all([fetchAppointments(), fetchPrescriptions()]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-16rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-secondary-700 text-white rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold">Doctor Portal</h1>
          <p className="mt-2">Manage your appointments, patients, and leave requests</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Navigation</h2>
            <nav className="space-y-2">
              <NavLink to="/doctor-portal" exact icon={<Activity />} label="Dashboard" />
              <NavLink to="/doctor-portal/appointments" icon={<Calendar />} label="Appointments" />
              <NavLink to="/doctor-portal/prescriptions" icon={<FileText />} label="Prescriptions" />
              <NavLink to="/doctor-portal/leave" icon={<Clock />} label="Leave Requests" />
              <NavLink to="/doctor-portal/patients" icon={<Users />} label="My Patients" />
              <NavLink to="/doctor-portal/profile" icon={<User />} label="My Profile" />
            </nav>
          </div>
          
          <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
            {loading ? (
              <div className="py-8 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Dashboard appointments={appointments} prescriptions={prescriptions} />} />
                <Route path="/appointments" element={<AppointmentManager />} />
                <Route path="/appointments/:id" element={<AppointmentDetails />} />
                <Route path="/prescriptions" element={<PrescriptionUpload />} />
                <Route path="/patients" element={<MyPatients />} />
                <Route path="/leave" element={<LeaveRequest />} />
                <Route path="/profile" element={<ProfileManager />} />
              </Routes>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NavLink = ({ to, icon, label, exact }) => {
  return (
    <Link
      to={exact ? to : to}
      className="flex items-center px-4 py-2 text-gray-700 hover:bg-secondary-50 hover:text-secondary-700 rounded-md transition-colors"
    >
      <span className="mr-3 text-gray-500">{icon}</span>
      {label}
    </Link>
  );
};

export default DoctorPortal;