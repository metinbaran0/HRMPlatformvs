import axios, { AxiosInstance } from 'axios';
import apis from '../config/RestApis';
import TokenService from './TokenService';

interface LoginResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    role: {
      id: number;
      userId: number;
      role: string;
    };
    token: string;
  };
}

interface BaseResponse<T> {
  success: boolean;
  message: string;
  code: number;
  data: T;
}

interface EmployeeResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  isActive: boolean;
  startDate: string;
}

interface GetEmployeesResponse extends BaseResponse<EmployeeResponse[]> {}

// Axios instance oluştur
const api: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  // withCredentials: true  // Bunu kaldırıyoruz
});

// Request interceptor - Token ekleme
api.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      TokenService.clearUserData();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const ApiService = {
  login: async (userData: { email: string; password: string }) => {
    try {
      const response = await api.post<LoginResponse>(apis.login, userData);
      
      if (response.data.success) {
        const { token, role } = response.data.data;
        const userId = response.data.data.role.userId;
        
        TokenService.setUserData(token, userId, role.role);
        
        return {
          token,
          userId,
          role: role.role,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      TokenService.clearUserData();
      throw error;
    }
  },

  register: async (userData: { email: string; password: string; rePassword: string }) => {
    try {
      const response = await api.post<BaseResponse<any>>(apis.register, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllEmployees: async (page: number = 0, size: number = 10) => {
    try {
      const response = await api.get<GetEmployeesResponse>(
        `${apis.getAllEmployees}?page=${page}&size=${size}`
      );

      if (!response.data.success && response.data.code === 404) {
        return {
          success: false,
          message: "Çalışan bulunamadı",
          code: 404,
          data: []
        };
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Diğer API çağrıları buraya eklenebilir
};

export default ApiService; 