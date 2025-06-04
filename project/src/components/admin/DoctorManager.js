import React, { useState, useEffect } from 'react';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { AlertCircle, Trash2, Edit, Plus } from 'lucide-react';

const DoctorManager = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    id: null,
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    specialization: '',
    hospital_id: '',
    qualifications: '',
    experience: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        if (!Array.isArray(data)) throw new Error('Invalid API response: Expected array');
        setDoctors(data);
        setError('');
      } catch (err) {
        setError(`Failed to load doctors: ${err.message}`);
        console.error('Doctors Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user: {
          username: formData.username,
          email: formData.email,
          password: formData.password || undefined,
          phone: formData.phone,
          address: formData.address,
          role: 'doctor',
        },
        specialization: formData.specialization,
        hospital_id: parseInt(formData.hospital_id) || undefined,
        qualifications: formData.qualifications,
        experience: parseInt(formData.experience) || 0,
      };

      if (isEditing) {
        await updateDoctor(formData.id, payload);
      } else {
        await createDoctor(payload);
      }

      setFormData({
        id: null,
        username: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        specialization: '',
        hospital_id: '',
        qualifications: '',
        experience: '',
      });
      setIsEditing(false);
      setError('');
      const data = await getDoctors();
      setDoctors(data);
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} doctor: ${err.message}`);
    }
  };

  const handleEdit = (doctor) => {
    setFormData({
      id: doctor.id,
      username: doctor.user?.username || '',
      email: doctor.user?.email || '',
      phone: doctor.user?.phone || '',
      address: doctor.user?.address || '',
      specialization: doctor.specialization || '',
      hospital_id: doctor.hospital?.id || '',
      qualifications: doctor.qualifications || '',
      experience: doctor.experience || '',
      password: '',
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(id);
        setDoctors(doctors.filter(doc => doc.id !== id));
        setError('');
      } catch (err) {
        setError(`Failed to delete doctor: ${err.message}`);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6 text-blue-700">Doctor Management</h2>
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center mb-6">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-800">{isEditing ? 'Edit Doctor' : 'Add Doctor'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Username"
            className="p-2 border rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="p-2 border rounded-md"
            required
          />
          {!isEditing && (
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="p-2 border rounded-md"
              required
            />
          )}
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone"
            className="p-2 border rounded-md"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="p-2 border rounded-md"
          />
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            placeholder="Specialization"
            className="p-2 border rounded-md"
            required
          />
          <input
            type="number"
            name="hospital_id"
            value={formData.hospital_id}
            onChange={handleInputChange}
            placeholder="Hospital ID"
            className="p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleInputChange}
            placeholder="Qualifications"
            className="p-2 border rounded-md"
          />
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            placeholder="Experience (years)"
            className="p-2 border rounded-md"
          />
          <button
            type="submit"
            className="col-span-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            {isEditing ? 'Update Doctor' : 'Add Doctor'}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="py-10 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : doctors.length > 0 ? (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 text-blue-700">Doctors List</h3>
          <div className="space-y-4">
            {doctors.map(doc => (
              <div key={doc.id} className="bg-white p-4 rounded-md shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-blue-800">{doc.user?.username}</h4>
                  <p className="text-gray-600 text-sm">Specialization: {doc.specialization}</p>
                  <p className="text-gray-600 text-sm">Hospital: {doc.hospital?.name || 'N/A'}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(doc)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
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
          <p className="text-gray-600">No doctors found.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorManager;