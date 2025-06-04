import React, { useState, useEffect } from 'react';
import { getAppointments, deleteAppointment } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { AlertCircle, Trash2, Filter } from 'lucide-react';

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    status: '',
    date: '',
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        if (!Array.isArray(data)) throw new Error('Invalid API response: Expected array');
        setAppointments(data);
        console.log(data);
        setError('');
      } catch (err) {
        setError(`Failed to load appointments: ${err.message}`);
        console.error('Appointments Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await deleteAppointment(id);
        setAppointments(appointments.filter(apt => apt.id !== id));
        setError('');
      } catch (err) {
        setError(`Failed to cancel appointment: ${err.message}`);
      }
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = filter.status ? apt.status === filter.status : true;
    const matchesDate = filter.date ? new Date(apt.appointment_date).toISOString().split('T')[0] === filter.date : true;
    return matchesStatus && matchesDate;
  });

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6 text-blue-700">Appointment Management</h2>
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center mb-6">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-800">Filter Appointments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
            className="p-2 border rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
          <input
            type="date"
            name="date"
            value={filter.date}
            onChange={handleFilterChange}
            className="p-2 border rounded-md"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-10 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 text-blue-700">Appointments List</h3>
          <div className="space-y-4">
            {filteredAppointments.map(apt => (
              <div key={apt.id} className="bg-white p-4 rounded-md shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-blue-800">ID: {apt.id}</h4>
                  <p className="text-gray-600 text-sm">Patient: {apt.patient?.username || 'N/A'}</p>
                  <p className="text-gray-600 text-sm">Doctor: {apt.doctor?.user?.username || 'N/A'}</p>
                  <p className="text-gray-600 text-sm">Hospital: {apt.hospital?.name || 'N/A'}</p>
                  <p className="text-gray-600 text-sm">Date: {new Date(apt.appointment_date).toLocaleString()}</p>
                  <p className="text-gray-600 text-sm">Status: {apt.status}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(apt.id)}
                    className="text-red-600 hover:text-red-800"
                    disabled={apt.status !== 'scheduled'}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No appointments found.</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentManager;