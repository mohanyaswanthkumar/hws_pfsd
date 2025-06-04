import React, { useState, useEffect } from 'react';
import { getUserProfile, updateAdminProfile } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { AlertCircle } from 'lucide-react';

const ProfileManager = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    role: 'admin',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile({
          username: data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          role: data.role || 'admin',
        });
        setError('');
      } catch (err) {
        setError(`Failed to load profile: ${err.message}`);
        console.error('Profile Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAdminProfile(profile);
      setSuccess('Profile updated successfully!');
      setError('');
    } catch (err) {
      setError(`Failed to update profile: ${err.message}`);
      setSuccess('');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6 text-blue-700">Admin Profile</h2>
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-100 text-green-800 rounded-md mb-6">
          {success}
        </div>
      )}
      {loading ? (
        <div className="py-10 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Update Profile
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileManager;