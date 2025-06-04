import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, FileText, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard = ({ appointments,prescriptions, loading, error }) => {
  // Get upcoming appointments (limited to 3)
  //const upcomingAppointments = appointments?.slice(0, 3) || [];
  //const prescriptions = prescriptions?.slice(0, 3) || [];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Patient Dashboard</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Upcoming Appointments" 
          value={appointments?.length || 0} 
          icon={<Calendar className="h-8 w-8 text-primary-600" />}
          link="/patient-portal/appointments"
        />
        <StatCard 
          title="Recent Prescriptions" 
          value={prescriptions?.length || 0} 
          icon={<FileText className="h-8 w-8 text-secondary-600" />}
          link="/patient-portal/prescriptions"
        />
        <StatCard 
          title="Last Checkup" 
          value="3 weeks ago" 
          icon={<Clock className="h-8 w-8 text-accent-600" />}
          link="/patient-portal/history"
        />
      </div>
      
      {/* Upcoming Appointments */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Upcoming Appointments</h3>
          <Link 
            to="/patient-portal/appointments" 
            className="text-sm text-primary-600 hover:text-primary-800"
          >
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="py-8 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">Dr. {appointment.doctor.user.username}</h4>
                        <p className="text-gray-600 text-sm">
                          {appointment.date} at {appointment.time}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Confirmed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-md">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">You have no upcoming appointments</p>
                <Link
                  to="/patient-portal/doctors"
                  className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                >
                  Book an Appointment
                </Link>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Health Reminders */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Health Reminders</h3>
        <div className="space-y-3">
          <ReminderCard 
            title="Annual Checkup Due" 
            description="Your annual physical examination is due in 2 weeks."
            priority="high"
          />
          <ReminderCard 
            title="Update Medical Records" 
            description="Please update your medical history with any recent changes."
            priority="medium"
          />
          <ReminderCard 
            title="Vaccination Reminder" 
            description="Flu season is approaching. Consider scheduling your flu shot."
            priority="low"
          />
        </div>
      </div>
    </div>
  );
};

// Helper components
const StatCard = ({ title, value, icon, link }) => {
  return (
    <Link to={link} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </Link>
  );
};

const ReminderCard = ({ title, description, priority }) => {
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-blue-100 text-blue-800"
  };
  
  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <div className="flex items-start">
        <div className="flex-1">
          <h4 className="font-medium text-gray-800">{title}</h4>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[priority]}`}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default Dashboard;