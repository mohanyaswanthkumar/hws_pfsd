import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Calendar, Activity, Search, User, FileText, Clock } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getAppointments, getPrescriptions } from '../services/api';

// Patient components
import Dashboard from '../components/patient/Dashboard';
import DoctorSearch from '../components/patient/DoctorSearch';
import DoctorProfile from '../components/patient/DoctorProfile';
import AppointmentBooking from '../components/patient/AppointmentBooking';
import PrescriptionView from '../components/patient/PrescriptionView';
import HealthHistory from '../components/patient/HealthHistory';
import ProfileManager from '../components/patient/ProfileManager';

const PatientPortal = () => {
  const [appointments, setAppointments] = useState([]);
   const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
   const fetchAppointments = async () => {
  try {
    const data = await getAppointments();
    const currentDateTime = new Date();

    // Filter appointments that are scheduled for a future date and time
    const upcomingAppointments = data.filter(appointment => {
      const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
      return appointmentDateTime > currentDateTime;
    });

    // Set only the filtered upcoming appointments
    setAppointments(upcomingAppointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    setError('Failed to load appointments. Please try again later.');
  } finally {
    setLoading(false);
  }
};

    const fetchPrescriptions = async () => {
      try {
        const data = await getPrescriptions();
        setPrescriptions(data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
    fetchPrescriptions();
  }, []);
  
  return (
    <div className="bg-gray-100 min-h-[calc(100vh-16rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-primary-700 text-white rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold">Patient Portal</h1>
          <p className="mt-2">Manage your appointments, prescriptions, and health records</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Navigation</h2>
            <nav className="space-y-2">
              <NavLink to="/patient-portal" exact icon={<Activity />} label="Dashboard" />
              <NavLink to="/patient-portal/doctors" icon={<Search />} label="Find Doctors" />
              <NavLink to="/patient-portal/appointments" icon={<Calendar />} label="Appointments" />
              <NavLink to="/patient-portal/prescriptions" icon={<FileText />} label="Prescriptions" />
              <NavLink to="/patient-portal/history" icon={<Clock />} label="Health History" />
              <NavLink to="/patient-portal/profile" icon={<User />} label="My Profile" />
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
            <Routes>
              <Route path="/" element={<Dashboard appointments={appointments} prescriptions={prescriptions} loading={loading} error={error} />} />
              <Route path="/doctors" element={<DoctorSearch />} />
              <Route path="/doctors/:id" element={<DoctorProfile />} />
              <Route path="/appointments" element={
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Appointments</h2>
                  {loading ? (
                    <div className="py-10">
                      <LoadingSpinner />
                    </div>
                  ) : error ? (
                    <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
                  ) : (
                    <>
                      {appointments.length > 0 ? (
                        <div className="space-y-4">
                          {appointments.map((appointment) => (
                            <div key={appointment.id} className="border rounded-md p-4 hover:bg-gray-50">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-gray-800">
                                    Dr. {appointment.doctor.user.username}
                                  </h3>
                                  <p className="text-gray-600 text-sm">
                                    Date: {appointment.date} | Time: {appointment.time}
                                  </p>
                                </div>
                                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                                  Confirmed
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-800 mb-2">No Appointments</h3>
                          <p className="text-gray-600 mb-4">You don't have any upcoming appointments.</p>
                          <Link
                            to="/patient-portal/doctors"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Find a Doctor
                          </Link>
                        </div>
                      )}
                      
                      <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Book a New Appointment</h3>
                        <AppointmentBooking onSuccess={() => setLoading(true)} />
                      </div>
                    </>
                  )}
                </div>
              } />
              <Route path="/prescriptions" element={<PrescriptionView />} />
              <Route path="/history" element={<HealthHistory />} />
              <Route path="/profile" element={<ProfileManager />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper NavLink component
const NavLink = ({ to, icon, label, exact }) => {
  return (
    <Link
      to={exact ? to : to}
      className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md transition-colors"
    >
      <span className="mr-3 text-gray-500">{icon}</span>
      {label}
    </Link>
  );
};

export default PatientPortal;