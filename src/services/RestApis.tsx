import axios from 'axios';

const BASE_URL = 'http://localhost:9090/api/auth';
const LEAVE_BASE_URL = 'http://localhost:9090/v1/api/leave';

// Axios instance oluştur
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - her istekte token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API fonksiyonları
export const RestApis = {
  login: async (userData: { email: string; password: string }) => {
    try {
      const response = await api.post('/dologin', userData);
      const token = response.data;
      if (token && typeof token === 'string') {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { token, isAuthenticated: true };
      } else {
        throw new Error('Geçersiz token formatı');
      }
    } catch (error: any) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      if (error.response?.data?.message === 'INVALID_EMAIL_OR_PASSWORD') {
        throw new Error('Email veya şifre hatalı');
      }
      throw error;
    }
  },

  register: async (userData: { email: string; password: string; rePassword: string }) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Yeni izin talebi oluşturma
  addLeaveRequest: async (leaveData: {
    startDate: string;  // ISO 8601 formatında tarih (yyyy-mm-dd)
    endDate: string;    // ISO 8601 formatında tarih (yyyy-mm-dd)
    leaveType: string;  // Örneğin: 'SICK', 'VACATION' vb.
    employeeId: number; // Çalışan ID'si
    reason : string; // İzin sebebi
  }) => {
    try {
      const response = await api.post(`${LEAVE_BASE_URL}/leaverequest`, leaveData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Diğer API fonksiyonları buraya eklenebilir
};

export default RestApis;
