import React, { useState, useEffect } from 'react';
import { getHealthRecords } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  Activity,
  TrendingUp,
  Heart,
  Droplet,
  Calendar,
} from 'lucide-react';

const HealthHistory = () => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [vitalStats, setVitalStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const data = await getHealthRecords();
        // Process health records
        const records = data.map((record) => ({
          date: record.date,
          doctor: `Dr. ${record.doctor.user.first_name} ${record.doctor.user.last_name}`,
          type: record.record_type || 'Checkup',
          diagnosis: record.diagnosis || 'N/A',
          notes: record.notes || 'No additional notes.',
        }));

        // Aggregate vitals (assuming vitals are part of health records)
        const vitals = [
          {
            title: 'Blood Pressure',
            icon: <Heart className="h-6 w-6 text-red-500" />,
            value: '120/80 mmHg', // Latest value (mocked or derived)
            status: 'normal',
            history: data
              .filter((r) => r.vitals?.blood_pressure)
              .map((r) => ({
                date: r.date,
                value: r.vitals.blood_pressure,
              }))
              .slice(0, 3),
          },
          {
            title: 'Blood Sugar',
            icon: <Droplet className="h-6 w-6 text-blue-500" />,
            value: '95 mg/dL',
            status: 'normal',
            history: data
              .filter((r) => r.vitals?.blood_sugar)
              .map((r) => ({
                date: r.date,
                value: r.vitals.blood_sugar,
              }))
              .slice(0, 3),
          },
          {
            title: 'Weight',
            icon: <TrendingUp className="h-6 w-6 text-green-500" />,
            value: '68 kg',
            status: 'normal',
            history: data
              .filter((r) => r.vitals?.weight)
              .map((r) => ({
                date: r.date,
                value: r.vitals.weight,
              }))
              .slice(0, 3),
          },
          {
            title: 'Cholesterol',
            icon: <Activity className="h-6 w-6 text-purple-500" />,
            value: '190 mg/dL',
            status: 'normal',
            history: data
              .filter((r) => r.vitals?.cholesterol)
              .map((r) => ({
                date: r.date,
                value: r.vitals.cholesterol,
              }))
              .slice(0, 3),
          },
        ];

        setHealthRecords(records);
        setVitalStats(vitals);
      } catch (err) {
        setError('Failed to load health history. Please try again.');
        console.error('Error fetching health records:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHealthRecords();
  }, []);

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">Health History</h2>

      {/* Vital Statistics */}
      <div className="mb-10">
        <h3 className="text-xl font-medium text-gray-800 mb-6">Vital Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vitalStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  {stat.icon}
                  <span className="ml-3 font-medium text-gray-800 text-lg">{stat.title}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    stat.status === 'normal'
                      ? 'bg-green-100 text-green-800'
                      : stat.status === 'high'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {stat.status}
                </span>
              </div>

              <div className="text-2xl font-bold text-gray-800 mb-4">{stat.value}</div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Recent History</h4>
                <div className="space-y-2">
                  {stat.history.length > 0 ? (
                    stat.history.map((record, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">{record.date}</span>
                        <span className="font-medium text-gray-800">{record.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No recent data available.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Records */}
      <div>
        <h3 className="text-xl font-medium text-gray-800 mb-6">Medical Records</h3>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosis
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {healthRecords.map((record, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {record.doctor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {record.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {record.diagnosis}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {healthRecords.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No medical records found</h3>
            <p className="text-gray-600">Your medical history will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthHistory;