import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Calendar, 
  Users, 
  FileText, 
  Stethoscope, 
  ShieldCheck 
} from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl font-bold mb-4">
                Healthcare & Well-Being System
              </h1>
              <p className="text-xl mb-8">
                A comprehensive platform for patients, doctors, and administrators to manage healthcare services efficiently.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="px-6 py-3 bg-white text-primary-700 font-medium rounded-md shadow-md hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white hover:text-primary-700 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Activity className="h-64 w-64 text-white opacity-75" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Our Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Calendar className="h-10 w-10 text-primary-600" />}
            title="Appointment Booking"
            description="Book appointments with your preferred doctors at your convenience."
          />
          <FeatureCard 
            icon={<Users className="h-10 w-10 text-primary-600" />}
            title="Doctor Search"
            description="Find qualified healthcare professionals based on specialty and availability."
          />
          <FeatureCard 
            icon={<FileText className="h-10 w-10 text-primary-600" />}
            title="Medical Records"
            description="Access your complete medical history and prescriptions securely."
          />
          <FeatureCard 
            icon={<Stethoscope className="h-10 w-10 text-primary-600" />}
            title="Telemedicine"
            description="Virtual consultations with doctors from the comfort of your home."
          />
          <FeatureCard 
            icon={<ShieldCheck className="h-10 w-10 text-primary-600" />}
            title="Secure Platform"
            description="Your health information is protected with the highest security standards."
          />
          <FeatureCard 
            icon={<Activity className="h-10 w-10 text-primary-600" />}
            title="Health Monitoring"
            description="Track your health metrics and receive personalized insights."
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our healthcare platform today and experience seamless healthcare management.
          </p>
          <Link
            to="/register"
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-md shadow-md hover:bg-primary-700 transition-colors inline-block"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Home;