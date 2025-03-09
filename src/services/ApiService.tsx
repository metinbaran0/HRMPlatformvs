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

export interface Employee {
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

export interface CreateEmployeeRequest {
  companyId: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  position: string;
}

export interface PartialEmployee {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  position: string;
  active: boolean;
}

// Yorumlar için Comment arayüzü eklendi
export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  postId: number;
}

// Çalışanlar için API yanıt formatı
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
});

api.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

  createEmployee: async (employeeData: CreateEmployeeRequest): Promise<void> => {
    try {
      await api.post<PartialEmployee>(apis.createEmployee, employeeData);
    } catch (error) {
      throw error;
    }
  },

  // Yorumları çekme API çağrısı
  getAllComments: async (page: number = 1, size: number = 10): Promise<Comment[]> => {
    try {
      const response = await api.get<BaseResponse<{ content: Comment[] }>>(
        `${apis.getAllComments}?page=${page}&size=${size}`
      );
      return response.data.data.content;
    } catch (error) {
      throw error;
    }
  },

  // Yeni yorum ekleme API çağrısı
  createComment: async (commentContent: string): Promise<Comment> => {
    try {
      const response = await api.post<BaseResponse<Comment>>(apis.createComment, {
        content: commentContent,
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ApiService;
