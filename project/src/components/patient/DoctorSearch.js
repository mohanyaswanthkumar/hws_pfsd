import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDoctors } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { Search, User, MapPin, Phone, Calendar, Star } from 'lucide-react';

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);
  
  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor => 
    doctor.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Find a Doctor</h2>
      
      {/* Search Box */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Search by doctor name, specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Doctor Listing */}
      {loading ? (
        <div className="py-10 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      ) : (
        <>
          {filteredDoctors.length > 0 ? (
            <div className="space-y-6">
              {filteredDoctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-800 mb-1">No doctors found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try a different search term' : 'No doctors are currently available'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Doctor Card Component
const DoctorCard = ({ doctor }) => {
  // Add some mock data for display purposes
  const mockData = {
    specialty: 'General Physician',
    location: 'Main Hospital, Floor 3',
    phone: '+1 (555) 123-4567',
    rating: 4.8,
    reviews: 124,
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300'
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img 
            className="h-24 w-24 rounded-full object-cover mx-auto md:mx-0" 
            src={mockData.image} 
            alt={`Dr. ${doctor.user.username}`} 
          />
        </div>
        <div className="mt-4 md:mt-0 md:ml-6 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Dr. {doctor.user.username}</h3>
              <p className="text-sm text-gray-600">{doctor.specialization}</p>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="ml-1 text-sm font-medium text-gray-700">{mockData.rating}</span>
              <span className="ml-1 text-xs text-gray-500">({mockData.reviews} reviews)</span>
            </div>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
              {doctor.hospital.name},{doctor.hospital.address}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-1 text-gray-500" />
              {doctor.user.phone}
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Link
              to={`/patient-portal/doctors/${doctor.id}`}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium mr-4"
            >
              View Profile
            </Link>
            <Link
              to={`/patient-portal/appointments`}
              state={{ doctorId: doctor.id }}
              className="flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSearch;