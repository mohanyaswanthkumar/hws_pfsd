import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Activity, Users, Clock, User, Settings} from 'lucide-react';
import { Stethoscope } from 'lucide-react';

// Admin components
import Dashboard from '../components/admin/Dashboard';
import DoctorManager from '../components/admin/DoctorManager';
import LeaveApproval from '../components/admin/LeaveApproval';
import ProfileManager from '../components/admin/ProfileManager';
import HospitalManager from '../components/admin/HospitalManager';
import AppointmentManager from '../components/admin/AppointmentManager';
import PrescriptionManager from '../components/admin/PrescriptionManager';

const AdminPortal = () => {
  return (
    <div className="bg-gray-100 min-h-[calc(100vh-16rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-accent-700 text-white rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold">Administrator Portal</h1>
          <p className="mt-2">Manage doctors, leave requests, and system settings</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Navigation</h2>
            <nav className="space-y-2">
              <NavLink to="/admin-portal" exact icon={<Activity />} label="Dashboard" />
              <NavLink to="/admin-portal/doctors" icon={<Users />} label="Manage Doctors" />
              <NavLink to="/admin-portal/hospitals" icon={<Stethoscope className="w-6 h-6" />} label="Manage Hospitals" />
              <NavLink to="/admin-portal/leave-approval" icon={<Clock />} label="Leave Approvals" />
              <NavLink to="/admin-portal/settings" icon={<Settings />} label="System Settings" />
              <NavLink to="/admin-portal/profile" icon={<User />} label="My Profile" />
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/doctors" element={<DoctorManager />} />
              <Route path="/hospitals" element={<HospitalManager />} />
              <Route path="/appointments" element={<AppointmentManager />} />
              <Route path="/prescriptions" element={<PrescriptionManager />} />
              <Route path="/leave-approval" element={<LeaveApproval />} />
              <Route path="/profile" element={<ProfileManager />} />
              <Route path="/settings" element={
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">System Settings</h2>
                  <p className="text-gray-600">Placeholder for system settings.</p>
                </div>
              } />
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
      className="flex items-center px-4 py-2 text-gray-700 hover:bg-accent-50 hover:text-accent-700 rounded-md transition-colors"
    >
      <span className="mr-3 text-gray-500">{icon}</span>
      {label}
    </Link>
  );
};

export default AdminPortal;