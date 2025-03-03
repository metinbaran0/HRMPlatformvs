import axios, { AxiosInstance } from 'axios';
import apis from '../config/RestApis';
import TokenService from './TokenService';

interface LoginResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    role: string;
    userId: number;
    token: string;
  };
}

interface BaseResponse<T> {
  success: boolean;
  message: string;
  code: number;
  data: T;
}

interface Employee {
  id: number;
  companyId: number;
  avatar: string | null;
  name: string;
  surname: string;
  email: string;
  phone: string;
  position: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

interface GetEmployeesResponse extends BaseResponse<{
  content: Employee[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}> {}

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
  login: async (userData: { email: string; password: string }): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>(apis.login, userData);
      
      if (response.data.success) {
        const { token, role, userId } = response.data.data;
        
        TokenService.setUserData(token, userId, role);
        
        return response.data;
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

  getAllEmployees: async (page: number = 0, size: number = 10): Promise<GetEmployeesResponse> => {
    try {
      const response = await api.get<GetEmployeesResponse>(
        `${apis.getAllEmployees}?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Diğer API çağrıları buraya eklenebilir
};

export default ApiService; 