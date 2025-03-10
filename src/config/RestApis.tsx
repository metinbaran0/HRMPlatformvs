import axios from 'axios';

const prodUrl = '';
const testUrl = '';

const devUrl = ' http://localhost:9090/v1/api';



const server = devUrl;
const employee = server + '/employee';
// API endpoint'leri

const apis = {
  login: server + '/auth/dologin',
  register: server + '/auth/register',

  getAllEmployees: employee + '/get-all-employees',
  createEmployee: employee + '/create-employee', // Eksik olan createEmployee endpoint'ini ekledim.

  // Diğer endpoint'ler
  userService: server + '/user',
  leaveService: server + '/leave',
  employeeService: employee, // Tekrar eden server yerine employee değişkenini kullandım.

  getAllComments: server + '/comment/get-all-comments',
  createComment: server + '/comment/create-comment',

  shiftService: server + '/shift',
};

  
    

    
   



// Axios instance oluştur
const api = axios.create({
  baseURL: server,
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
      const response = await api.post(apis.login, userData);

      console.log('Login Yanıtı:', response.data);
      
      console.log('Login Response:', response);
      console.log('Response Data:', response.data);
      
      // Backend'den gelen token, userId ve role bilgilerini al
      const { token, userId, role } = response.data;

      if (token && userId && role) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId.toString());
        localStorage.setItem('userRole', role);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return {
          token,
          userId,
          role,
          isAuthenticated: true
        };
      } else {
        console.log('Geçersiz response formatı:', response.data);
        throw new Error('Geçersiz response formatı');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
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
      const response = await api.post(apis.register, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },



};

export default apis; 