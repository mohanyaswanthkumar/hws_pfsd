import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDoctorDetail } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { Calendar, MapPin, Phone, Mail, Clock, Award, Bookmark } from 'lucide-react';

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await getDoctorDetail(id);
        setDoctor({
          id: data.id || '',
          username: data.user.username || 'Unknown Doctor',
          email: data.user.email || 'N/A',
          phone: data.user.phone || 'N/A',
          specialization: data.specialization || 'N/A',
          qualifications: data.qualifications || 'N/A',
          experience: data.experience ? `${data.experience} years` : 'N/A',
          hospitalName: data.hospital.name || 'N/A',
          location: data.hospital.address || 'N/A',
          bio: 'No bio available.', // Fallback as bio is not in API
          availability: data.availability || {},
          image: data.user.profile_photo || 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300',
        });
      } catch (err) {
        setError('Failed to load doctor profile.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link to="/patient-portal/doctors" className="text-blue-600 hover:text-blue-800 mr-4">
          ← Back to Doctors
        </Link>
        <h2 className="text-xl font-semibold text-gray-800">Doctor Profile</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <div className="md:flex items-center">
            <div className="md:flex-shrink-0">
              <img
                className="h-32 w-32 rounded-full object-cover border-4 border-white mx-auto md:mx-0"
                src={doctor.image}
                alt={`Dr. ${doctor.username}`}
              />
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
              <h3 className="text-2xl font-bold">Dr. {doctor.username}</h3>
              <p className="text-blue-200">{doctor.specialization}</p>
              <p className="text-blue-200">{doctor.hospitalName}</p>
            </div>
            <div className="md:ml-auto mt-6 md:mt-0 text-center md:text-right">
              <Link
                to="/patient-portal/appointments"
                state={{ doctorId: doctor.id }}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md hover:bg-gray-100"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Link>
              <button className="ml-2 inline-flex items-center px-3 py-2 bg-transparent border border-white text-white text-sm font-medium rounded-md hover:bg-white hover:text-blue-600">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h4 className="text-lg font-medium text-gray-800 mb-3">About</h4>
              <p className="text-gray-600 mb-6">{doctor.bio}</p>

              <h4 className="text-lg font-medium text-gray-800 mb-3">Specialization</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {doctor.specialization}
                </span>
              </div>

              <h4 className="text-lg font-medium text-gray-800 mb-3">Education & Experience</h4>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">{doctor.qualifications}</p>
                    <p className="text-sm text-gray-600">Specialized training</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">{doctor.experience} of Experience</p>
                    <p className="text-sm text-gray-600">Practiced at {doctor.hospitalName}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-800 mb-3">Contact Information</h4>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <span className="text-gray-600">{doctor.location}</span>
                </div>
                {doctor.phone && (
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <span className="text-gray-600">{doctor.phone}</span>
                  </div>
                )}
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <span className="text-gray-600">{doctor.email}</span>
                </div>
              </div>

              <h4 className="text-lg font-medium text-gray-800 mb-3">Availability</h4>
              <div className="space-y-2">
                {Object.keys(doctor.availability).length > 0 ? (
                  Object.entries(doctor.availability).map(([date, times]) => (
                    <div key={date} className="text-sm text-gray-600">
                      <span className="font-medium">{date}</span>: {times.join(', ')}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No availability provided.</p>
                )}
              </div>

              <div className="mt-6">
                <Link
                  to="/patient-portal/appointments"
                  state={{ doctorId: doctor.id }}
                  className="w-full block text-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                >
                  Book an Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;