import React, { useState, useEffect } from 'react';
import { createPrescription, getAppointments, getPrescriptions } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { FileText, Check, AlertCircle } from 'lucide-react';

const PrescriptionUpload = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    appointment_id: '',
    medication: '',
    dosage: '',
    instructions: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptData, prescData] = await Promise.all([
          getAppointments(),
          getPrescriptions(),
        ]);
        // Filter appointments that are booked and have no prescriptions
        const prescApptIds = new Set(prescData.map((presc) => presc.appointment?.id));
        setAppointments(
          apptData.filter((appt) => appt.status === 'booked' && !prescApptIds.has(appt.id))
        );
        setPrescriptions(
          prescData.map((presc) => ({
            id: presc.id || '',
            patient: presc.appointment?.patient?.username || presc.appointment?.patient?.user?.username || 'N/A',
            medication: presc.medication || 'N/A',
            dosage: presc.dosage || 'N/A',
            instructions: presc.instructions || 'No instructions',
            date: presc.created_at ? new Date(presc.created_at).toLocaleDateString() : 'N/A',
          }))
        );
      } catch (err) {
        setError(`Failed to load data: ${err.response?.data?.detail || err.message}`);
        console.error('Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    if (!formData.appointment_id || !formData.medication || !formData.dosage) {
      setError('Please fill out all required fields.');
      setSubmitting(false);
      return;
    }
    // Double-check if appointment already has a prescription
    try {
      const prescData = await getPrescriptions();
      if (prescData.some((presc) => presc.appointment?.id === parseInt(formData.appointment_id))) {
        setError('This appointment already has a prescription.');
        setSubmitting(false);
        return;
      }
      const response = await createPrescription(formData);
      setPrescriptions((prev) => [
        {
          id: response.id,
          patient: appointments.find((appt) => appt.id === parseInt(formData.appointment_id))?.patient?.username || 'N/A',
          medication: response.medication,
          dosage: response.dosage,
          instructions: response.instructions || 'No instructions',
          date: response.created_at ? new Date(response.created_at).toLocaleDateString() : 'N/A',
        },
        ...prev,
      ]);
      // Remove the appointment from the dropdown
      setAppointments((prev) => prev.filter((appt) => appt.id !== parseInt(formData.appointment_id)));
      setSuccess('Prescription uploaded successfully!');
      setFormData({ appointment_id: '', medication: '', dosage: '', instructions: '' });
    } catch (err) {
      setError(`Failed to upload prescription: ${err.response?.data?.detail || err.message}`);
      console.error('Error:', err.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Prescription Manager</h2>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Upload New Prescription</h3>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-md flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5" />
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="appointment_id" className="block text-gray-700 font-medium mb-2">
              Select Appointment
            </label>
            <select
              id="appointment_id"
              name="appointment_id"
              value={formData.appointment_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
              required
            >
              <option value="">-- Select an Appointment --</option>
              {appointments.map((appt) => (
                <option key={appt.id} value={appt.id}>
                  {appt.patient?.username || appt.patient?.user?.username || 'Unknown'} ({appt.date} at {appt.time})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="medication" className="block text-gray-700 font-medium mb-2">
              Medication
            </label>
            <input
              id="medication"
              name="medication"
              type="text"
              value={formData.medication}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dosage" className="block text-gray-700 font-medium mb-2">
              Dosage
            </label>
            <input
              id="dosage"
              name="dosage"
              type="text"
              value={formData.dosage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="instructions" className="block text-gray-700 font-medium mb-2">
              Instructions
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={submitting}
          >
            {submitting ? (
              <LoadingSpinner size="small" color="white" />
            ) : (
              <>
                <FileText className="h-5 w-5 mr-2 inline" />
                Upload Prescription
              </>
            )}
          </button>
        </form>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <h3 className="text-lg font-medium text-gray-800 p-6">Previous Prescriptions</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medication
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dosage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prescriptions.map((presc) => (
              <tr key={presc.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {presc.patient}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {presc.medication}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {presc.dosage}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {presc.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {prescriptions.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-800 mb-1">No prescriptions found</h3>
            <p className="text-gray-600">You have no previous prescriptions.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PrescriptionUpload;