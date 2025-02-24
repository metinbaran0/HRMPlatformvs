import axios from 'axios';

const BASE_URL = 'http://localhost:9090/api/auth';

// API endpoint'leri
const ENDPOINTS = {
  LOGIN: '/dologin',
  REGISTER: '/register',
  // Diğer endpoint'ler buraya eklenebilir
};

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
      // Kullanıcıyı login sayfasına yönlendir
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API fonksiyonları
export const RestApis = {
  login: async (userData: { email: string; password: string }) => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN, userData);
      
      console.log('Login Response:', response);
      console.log('Response Data:', response.data);
      
      // Backend direkt JWT string dönüyor
      const token = response.data;

      if (token && typeof token === 'string') {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Token'ı ve auth durumunu dön
        return {
          token: token,
          isAuthenticated: true
        };
      } else {
        console.log('Geçersiz token formatı:', response.data);
        throw new Error('Geçersiz token formatı');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      // Backend'den gelen özel hata mesajını kontrol et
      if (error.response?.data?.message === 'INVALID_EMAIL_OR_PASSWORD') {
        throw new Error('Email veya şifre hatalı');
      }
      throw error;
    }
  },

  register: async (userData: { email: string; password: string; rePassword: string }) => {
    try {
      const response = await api.post(ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Diğer API fonksiyonları buraya eklenebilir
};

export default RestApis; 