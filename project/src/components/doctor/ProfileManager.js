import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Award, Save, Edit } from 'lucide-react';
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
          username: data.user.username || '',
          email: data.user.email || '',
          phone: data.user.mobile || '',
          address: data.user.address || '',
          specialization: data.specialization || '',
          qualifications: data.qualifications || '',
          experience: data.experience || '',
          hospitalName: data.hospital?.name || 'N/A',
          hospitalAddress: data.hospital?.address || 'N/A',
          avatar: data.profile_photo || 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300',
        };
        setUserData(profileData);
        setEditData(profileData);
      } catch (err) {
        setError('Failed to load profile.');
        console.error('Error:', err);
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
    setEditData((prev) => ({ ...prev, [name]: value }));
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
          phone: editData.phone,
          address: editData.address,
        },
        specialization: editData.specialization,
        qualifications: editData.qualifications,
        experience: parseInt(editData.experience) || 0,
      };
      await updateUserProfile(updatePayload);
      setUserData({ ...editData, hospitalName: userData.hospitalName, hospitalAddress: userData.hospitalAddress });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile.');
      console.error('Error:', err);
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
            isEditing ? 'border-red-300 text-red-700 hover:bg-red-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
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
        <div className="bg-blue-600 text-white p-6">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="mb-4 sm:mb-0 sm:mr-6">
              <img
                src={userData.avatar}
                alt={userData.username}
                className="h-24 w-24 rounded-full object-cover border-4 border-white"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold">Dr. {userData.username}</h3>
              <p className="text-blue-200">{userData.specialization}</p>
              <p className="text-blue-200">{userData.hospitalName}</p>
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
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={editData.specialization}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-1">
                  Qualifications
                </label>
                <input
                  type="text"
                  id="qualifications"
                  name="qualifications"
                  value={editData.qualifications}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={editData.experience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="small" color="white" /> : (
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
              {userData.phone && <ProfileField icon={<Phone />} label="Phone Number" value={userData.phone} />}
              <ProfileField icon={<MapPin />} label="Address" value={userData.address || 'N/A'} spanFull />
              <ProfileField icon={<Award />} label="Specialization" value={userData.specialization} />
              <ProfileField label="Qualifications" value={userData.qualifications} />
              <ProfileField label="Experience" value={userData.experience ? `${userData.experience} years` : 'N/A'} />
              <ProfileField label="Hospital" value={userData.hospitalName} spanFull />
              <ProfileField label="Hospital Address" value={userData.hospitalAddress} spanFull />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileField = ({ icon, label, value, spanFull = false }) => (
  <div className={spanFull ? 'md:col-span-2' : ''}>
    <div className="flex items-center mb-1">
      {icon && <span className="text-gray-500 mr-2">{icon}</span>}
      <h4 className="text-sm font-medium text-gray-700">{label}</h4>
    </div>
    <p className="text-gray-800">{value}</p>
  </div>
);

export default ProfileManager;