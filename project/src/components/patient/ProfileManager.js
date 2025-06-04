import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Save, Edit } from 'lucide-react';
import { getUserProfile, updateUserProfile } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const ProfileManager = () => {
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        const profileData = {
          id:data.id || 'N/A',
          username: data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          date_of_birth: data.date_of_birth || '',
          address: data.address || '',
          emergency_contact: data.emergency_contact || '',
          blood_type: data.blood_type || '',
          allergies: data.allergies || '',
          chronic_conditions: data.chronic_conditions || '',
          patient_id: data.patient_id || 'N/A',
          member_since: data.member_since || 'N/A',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300', // No avatar in serializer
        };
        setUserData(profileData);
        setEditData(profileData);
      } catch (err) {
        setError('Failed to load profile. Please try again.');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData(userData);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updatePayload = {
        user: {
          username: editData.username,
          email: editData.email,
        },
        phone: editData.phone,
        date_of_birth: editData.date_of_birth,
        address: editData.address,
        emergency_contact: editData.emergency_contact,
        blood_type: editData.blood_type,
        allergies: editData.allergies,
        chronic_conditions: editData.chronic_conditions,
      };
      await updateUserProfile(updatePayload);
      setUserData(editData);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData) {
    return (
      <div className="py-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">My Profile</h2>
        <button
          onClick={handleEditToggle}
          className={`flex items-center px-3 py-2 border rounded-md ${
            isEditing
              ? 'border-red-300 text-red-700 hover:bg-red-50'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isEditing ? 'Cancel' : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-primary-700 text-white p-6">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="mb-4 sm:mb-0 sm:mr-6">
              <img
                src={userData.avatar}
                alt={userData.username}
                className="h-24 w-24 rounded-full object-cover border-4 border-white"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold">{userData.username}</h3>
              <p className="text-primary-200">Patient ID: {userData.id}</p>
              <p className="text-primary-200">Member since: {userData.member_since}</p>
            </div>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={editData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={editData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={editData.date_of_birth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={editData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  id="emergency_contact"
                  name="emergency_contact"
                  value={editData.emergency_contact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="blood_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type
                </label>
                <select
                  id="blood_type"
                  name="blood_type"
                  value={editData.blood_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                <input
                  type="text"
                  id="allergies"
                  name="allergies"
                  value={editData.allergies}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="chronic_conditions" className="block text-sm font-medium text-gray-700 mb-1">
                  Chronic Conditions
                </label>
                <input
                  type="text"
                  id="chronic_conditions"
                  name="chronic_conditions"
                  value={editData.chronic_conditions}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <ProfileField icon={<User />} label="Username" value={userData.username} />
              <ProfileField icon={<Mail />} label="Email Address" value={userData.email} />
              <ProfileField icon={<Phone />} label="Phone Number" value={userData.phone || 'N/A'} />
              <ProfileField icon={<Calendar />} label="Date of Birth" value={userData.date_of_birth || 'N/A'} />
              <ProfileField icon={<MapPin />} label="Address" value={userData.address || 'N/A'} spanFull />
              <ProfileField label="Emergency Contact" value={userData.emergency_contact || 'N/A'} spanFull />
              <ProfileField label="Blood Type" value={userData.blood_type || 'N/A'} />
              <ProfileField label="Allergies" value={userData.allergies || 'None'} />
              <ProfileField label="Chronic Conditions" value={userData.chronic_conditions || 'None'} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileField = ({ icon, label, value, spanFull = false }) => {
  return (
    <div className={spanFull ? 'md:col-span-2' : ''}>
      <div className="flex items-center mb-1">
        {icon && <span className="text-gray-500 mr-2">{icon}</span>}
        <h4 className="text-sm font-medium text-gray-700">{label}</h4>
      </div>
      <p className="text-gray-800">{value}</p>
    </div>
  );
};

export default ProfileManager;