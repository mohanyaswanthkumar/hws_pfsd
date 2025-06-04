import React, { useState, useEffect } from 'react';
import { getHospitals, createHospital, updateHospital, deleteHospital } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { AlertCircle, Trash2, Edit, Plus } from 'lucide-react';

const HospitalManager = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    contact: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await getHospitals();
        if (!Array.isArray(data)) throw new Error('Invalid API response: Expected array');
        setHospitals(data);
        setError('');
      } catch (err) {
        setError(`Failed to load hospitals: ${err.message}`);
        console.error('Hospitals Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        contact: formData.contact,
      };

      if (isEditing) {
        await updateHospital(formData.id, payload);
      } else {
        await createHospital(payload);
      }

      setFormData({
        id: null,
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        contact: '',
      });
      setIsEditing(false);
      setError('');
      const data = await getHospitals();
      setHospitals(data);
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} hospital: ${err.message}`);
    }
  };

  const handleEdit = (hospital) => {
    setFormData({
      id: hospital.id,
      name: hospital.name || '',
      address: hospital.address || '',
      latitude: hospital.latitude || '',
      longitude: hospital.longitude || '',
      contact: hospital.contact || '',
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hospital?')) {
      try {
        await deleteHospital(id);
        setHospitals(hospitals.filter(hospital => hospital.id !== id));
        setError('');
      } catch (err) {
        setError(`Failed to delete hospital: ${err.message}`);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6 text-blue-700">Hospital Management</h2>
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center mb-6">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-800">{isEditing ? 'Edit Hospital' : 'Add Hospital'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Hospital Name"
            className="p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="p-2 border rounded-md"
            required
          />
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleInputChange}
            placeholder="Latitude"
            className="p-2 border rounded-md"
            step="any"
          />
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleInputChange}
            placeholder="Longitude"
            className="p-2 border rounded-md"
            step="any"
          />
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            placeholder="Contact Number"
            className="p-2 border rounded-md"
          />
          <button
            type="submit"
            className="col-span-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            {isEditing ? 'Update Hospital' : 'Add Hospital'}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="py-10 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : hospitals.length > 0 ? (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 text-blue-700">Hospitals List</h3>
          <div className="space-y-4">
            {hospitals.map(hospital => (
              <div key={hospital.id} className="bg-white p-4 rounded-md shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-blue-800">{hospital.name}</h4>
                  <p className="text-gray-600 text-sm">Address: {hospital.address}</p>
                  <p className="text-gray-600 text-sm">Contact: {hospital.contact || 'N/A'}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(hospital)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(hospital.id)}
                    className="text-red-600 hover:text-red-800"
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
          <p className="text-gray-600">No hospitals found.</p>
        </div>
      )}
    </div>
  );
};

export default HospitalManager;