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

export interface UpdateEmployeeRequest {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  position?: string;
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

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  postId: number;
}

interface GetEmployeesResponse extends BaseResponse<{
  content: Employee[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}> {}

// Vardiya tipi için enum
export enum ShiftType {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  NIGHT = "NIGHT",
  CUSTOM = "CUSTOM"
}

// Vardiya DTO tipi
export interface ShiftDto {
  id?: string;
  shiftName: string;
  startTime: string; // LocalDate formatında string olarak
  endTime: string; // LocalDate formatında string olarak
  shiftType: ShiftType;
}

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

  updateEmployee: async (id: number, employeeData: UpdateEmployeeRequest): Promise<void> => {
    try {
      await api.put<BaseResponse<PartialEmployee>>(`${apis.employeeService}/update-employee/${id}`, employeeData);
    } catch (error) {
      throw error;
    }
  },

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

  toggleEmployeeStatus: async (id: number): Promise<void> => {
    try {
      const token = TokenService.getToken();
      if (!token) {
        throw new Error("Oturum açmanız gerekiyor");
      }
      
      await api.put<void>(`${apis.employeeService}/change-/${id}/status`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Status change error:", error);
      throw error;
    }
  },
  
  deleteEmployee: async (id: number): Promise<void> => {
    try {
      const token = TokenService.getToken();
      if (!token) {
        throw new Error("Oturum açmanız gerekiyor");
      }
      
      await api.delete<string>(`${apis.employeeService}/delete-employee/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Delete employee error:", error);
      throw error;
    }
  },

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

  createShift: async (shiftData: ShiftDto): Promise<ShiftDto> => {
    try {
      const token = TokenService.getToken();
      if (!token) {
        throw new Error("Oturum açmanız gerekiyor");
      }
      
      console.log("Token:", token);
      console.log("Gönderilen veri:", shiftData);
      
      const response = await api.post<BaseResponse<ShiftDto>>(
        `${apis.shiftService}/create-shift`,
        shiftData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error("Vardiya oluşturma hatası:", error);
      console.error("Hata detayı:", error.response?.data);
      throw error;
    }
  },

  getAllShifts: async (): Promise<ShiftDto[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token bulunamadı');
      }
      
      const response = await api.get<BaseResponse<ShiftDto[]>>(
        `${apis.shiftService}/active-shift`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Vardiyalar başarıyla alındı:", response.data.data);
      return response.data.data;
    } catch (error: any) {
      console.error("Vardiyaları getirme hatası:", error);
      console.error("Hata detayı:", error.response?.data);
      throw error;
    }
  },

  updateShift: async (id: string, shiftData: Partial<ShiftDto>): Promise<ShiftDto> => {
    try {
      const token = TokenService.getToken();
      if (!token) {
        throw new Error("Oturum açmanız gerekiyor");
      }
      
      console.log("Güncellenen vardiya ID:", id);
      console.log("Güncellenen veri:", shiftData);
      
      // Backend'in beklediği formatta veri gönder
      const requestData: ShiftDto = {
        shiftName: shiftData.shiftName || '',
        startTime: shiftData.startTime || '',
        endTime: shiftData.endTime || '',
        shiftType: shiftData.shiftType || ShiftType.MORNING
      };
      
      const response = await api.put<BaseResponse<ShiftDto>>(
        `${apis.shiftService}/update-shift/${id}`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error("Vardiya güncelleme hatası:", error);
      console.error("Hata detayı:", error.response?.data);
      throw error;
    }
  },

  deleteShift: async (id: string): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token bulunamadı');
      }

      console.log(`Vardiya silme isteği gönderiliyor: ID=${id}`);
      
      const response = await fetch(`http://localhost:9090/v1/api/shift/delete-shift/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`Vardiya silme yanıtı: Status=${response.status}`);

      // 204 No Content yanıtı için
      if (response.status === 204) {
        return { success: true, id };
      }

      // Diğer yanıtlar için
      try {
        const data = await response.json();
        return data;
      } catch (error) {
        // JSON parse hatası (muhtemelen boş yanıt)
        if (response.ok) {
          return { success: true, id };
        }
        throw new Error('Sunucudan geçersiz yanıt alındı');
      }
    } catch (error) {
      console.error('Vardiya silme hatası:', error);
      throw error;
    }
  },
};

export default ApiService;