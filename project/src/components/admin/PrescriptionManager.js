import React, { useState, useEffect } from 'react';
import { getPrescriptions } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { AlertCircle } from 'lucide-react';

const PrescriptionManager = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await getPrescriptions();
        if (!Array.isArray(data)) throw new Error('Invalid API response: Expected array');
        console.log(data);
        setPrescriptions(data);
        setError('');
      } catch (err) {
        setError(`Failed to load prescriptions: ${err.message}`);
        console.error('Prescriptions Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6 text-blue-700">Prescription Management</h2>
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
      ) : prescriptions.length > 0 ? (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 text-blue-700">Prescriptions List</h3>
          <div className="space-y-4">
            {prescriptions.map(pres => (
              <div key={pres.id} className="bg-white p-4 rounded-md shadow-sm">
                <h4 className="font-medium text-blue-800">ID: {pres.id}</h4>
                <p className="text-gray-600 text-sm">Patient: {pres.appointment.patient?.username || 'N/A'}</p>
                <p className="text-gray-600 text-sm">Doctor: {pres.appointment.doctor?.user?.username || 'N/A'}</p>
                <p className="text-gray-600 text-sm">Medication: {pres.medication}</p>
                <p className="text-gray-600 text-sm">Dosage: {pres.dosage}</p>
                <p className="text-gray-600 text-sm">Instructions: {pres.instructions}</p>
                <p className="text-gray-600 text-sm">Created: {new Date(pres.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No prescriptions found.</p>
        </div>
      )}
    </div>
  );
};

export default PrescriptionManager;