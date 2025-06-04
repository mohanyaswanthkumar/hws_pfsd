import React, { useState, useEffect } from 'react';
import { getAppointments } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { Users, AlertCircle } from 'lucide-react';

const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const apptData = await getAppointments();
        // Deduplicate patients by id
        const patientMap = new Map();
        apptData.forEach((appt) => {
          const patient = appt.patient;
          if (patient?.id) {
            if (!patientMap.has(patient.id)) {
              patientMap.set(patient.id, {
                id: patient.id,
                username: patient.username || patient.user?.username || 'Unknown',
                email: patient.email || patient.user?.email || 'N/A',
                last_appointment: appt.date ? `${appt.date} at ${appt.time}` : 'N/A',
              });
            }
          }
        });
        setPatients(Array.from(patientMap.values()));
      } catch (err) {
        setError(`Failed to load patients: ${err.response?.data?.detail || err.message}`);
        console.error('Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">My Patients</h2>
      {error && (
        <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          {error}
        </div>
      )}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Appointment
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {patient.username}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {patient.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {patient.last_appointment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {patients.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-800 mb-1">No patients found</h3>
            <p className="text-gray-600">You have no patients assigned.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MyPatients;