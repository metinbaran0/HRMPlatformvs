// state tanımlama

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Swal from 'sweetalert2';
import ApiService from '../../services/ApiService';

// Kullanıcı state'inin tipini güncelle
interface UserState {
  token: string | null;
  userId: number | null;
  role: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Başlangıç state'ini güncelle login olduktan sonra bilgiler burada kaydedeilecek
const initialState: UserState = {
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
  role: localStorage.getItem('role'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Login işlemi
export const fetchLogin = createAsyncThunk(
  "user/fetchLogin",
  async (userData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await ApiService.login(userData);
      
      if (response.token && response.role) {
        // Token ve role bilgilerini localStorage'a kaydet
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('userId', response.userId.toString());
        
        await Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: response.message || 'Giriş işlemi başarılı',
          showConfirmButton: false,
          timer: 1500
        });
        
        return response;
      }
      
      throw new Error('Geçersiz yanıt formatı');
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.message || 'Giriş işlemi başarısız',
        confirmButtonText: 'Tamam'
      });
      return rejectWithValue(error.message);
    }
  }
);

// Register işlemi
export const fetchRegister = createAsyncThunk(
  'user/fetchRegister',
  async (userData: { email: string; password: string; rePassword: string }, { rejectWithValue }) => {
    try {


      const response = await ApiService.register(userData);


      if (response) {
        await Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Kayıt işlemi başarıyla tamamlandı.',
          showConfirmButton: false,
          timer: 1500
        });

        return response;
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kayıt işlemi başarısız oldu.';
      
      await Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: message,
        confirmButtonText: 'Tamam'
      });

      return rejectWithValue(message);
    }
  }
);

// Slice'ı güncelle
const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.role = null;
      state.isAuthenticated = false;
      // localStorage'dan temizle
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register işlemleri
      .addCase(fetchRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegister.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});  
export const { logout } = UserSlice.actions;
export default UserSlice.reducer;
