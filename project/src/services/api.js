import axios from 'axios';

const API_URL = "http://localhost:8000";

// Create axios instance with authorization header
const createAuthInstance = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

// --- Authentication Endpoints ---

// Register a new user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register/`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Login user and return JWT tokens
export const login = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login/`, loginData);
    // Store tokens in localStorage
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
    }
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.get('/api/auth/profile/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// --- User Endpoints ---

// Get list of users (admin-only)
export const getUsers = async () => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.get('/api/users/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get specific user details
export const getUserDetail = async (userId) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.get(`/api/users/${userId}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.put(`/api/users/${userId}/update_profile/`, profileData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateAdminProfile = async (userId, profileData) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.put(`/api/auth/profile/`, profileData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// --- Hospital Endpoints ---

// Get list of hospitals (with optional latitude/longitude for filtering)
export const getHospitals = async (latitude, longitude) => {
  try {
    const authInstance = createAuthInstance();
    const params = latitude && longitude ? { latitude, longitude } : {};
    const response = await authInstance.get('/api/hospitals/', { params });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new hospital (admin-only)
export const createHospital = async (hospitalData) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.post('/api/hospitals/create/', hospitalData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get specific hospital details (admin-only)
export const getHospitalDetail = async (hospitalId) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.get(`/api/hospitals/${hospitalId}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update a hospital (admin-only)
export const updateHospital = async (hospitalId, hospitalData) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.put(`/api/hospitals/${hospitalId}/`, hospitalData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a hospital (admin-only)
export const deleteHospital = async (hospitalId) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.delete(`/api/hospitals/${hospitalId}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// --- Doctor Endpoints ---

// Get list of doctors
export const getDoctors = async () => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.get('/api/doctors/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new doctor (admin-only)
export const createDoctor = async (doctorData) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.post('/api/doctors/create/', doctorData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get specific doctor details
export const getDoctorDetail = async (doctorId) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.get(`/api/doctors/${doctorId}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update a doctor (admin-only)
export const updateDoctor = async (doctorId, doctorData) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.put(`/api/doctors/${doctorId}/`, doctorData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a doctor (admin-only)
export const deleteDoctor = async (doctorId) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.delete(`/api/doctors/${doctorId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// --- Appointment Endpoints ---

// Get list of appointments
export const getAppointments = async () => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.get('/api/appointments/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


// Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.post('/api/appointments/create/', appointmentData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get specific appointment details
export const getAppointmentDetail = async (appointmentId) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.get(`/api/appointments/${appointmentId}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


// Update an appointment
export const updateAppointment = async (appointmentId, appointmentData) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.put(`/api/appointments/${appointmentId}/`, appointmentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete an appointment
export const deleteAppointment = async (appointmentId) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.delete(`/api/appointments/${appointmentId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// --- Prescription Endpoints ---

// Get list of prescriptions
export const getPrescriptions = async () => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.get('/api/prescriptions/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new prescription (doctor-only)
export const createPrescription = async (prescriptionData) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.post('/api/prescriptions/create/', prescriptionData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get specific prescription details
export const getPrescriptionDetail = async (prescriptionId) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.get(`/api/prescriptions/${prescriptionId}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


// Update a prescription (doctor-only)
export const updatePrescription = async (prescriptionId, prescriptionData) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.put(`/api/prescriptions/${prescriptionId}/`, prescriptionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a prescription (doctor-only)
export const deletePrescription = async (prescriptionId) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.delete(`/api/prescriptions/${prescriptionId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// --- Health Record Endpoints ---

// Get list of health records
export const getHealthRecords = async () => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.get('/api/health-records/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new health record (doctor-only)
export const createHealthRecord = async (healthRecordData) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.post('/api/health-records/create/', healthRecordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get specific health record details
export const getHealthRecordDetail = async (recordId) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.get(`/api/health-records/${recordId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update a health record (doctor-only)
export const updateHealthRecord = async (recordId, healthRecordData) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.put(`/api/health-records/${recordId}/`, healthRecordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a health record (doctor-only)
export const deleteHealthRecord = async (recordId) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.delete(`/api/health-records/${recordId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// --- Leave Endpoints ---

// Get list of leaves (doctor or admin)
export const getLeaves = async () => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.get('/api/leaves/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new leave request (doctor-only)
export const createLeave = async (leaveData) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.post('/api/leaves/create/', leaveData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get specific leave details
export const getLeaveDetail = async (leaveId) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.get(`/api/leaves/${leaveId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update a leave (admin-only)
export const updateLeave = async (leaveId, leaveData) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.put(`/api/leaves/${leaveId}/`, leaveData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a leave (admin-only)
export const deleteLeave = async (leaveId) => {
  try {
    const authInstance = createAuthInstance();
    const response = await authInstance.delete(`/api/leaves/${leaveId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


