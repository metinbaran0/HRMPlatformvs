// state tanımlama

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Swal from 'sweetalert2';
import RestApis from '../../services/RestApis';

// Kullanıcı state'inin tipini güncelle
interface UserState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Başlangıç state'ini güncelle
const initialState: UserState = {
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Login işlemi
export const fetchLogin = createAsyncThunk(
  'user/fetchLogin',
  async (userData: { email: string; password: string }, { rejectWithValue }) => {
    try {

      const response = await RestApis.login(userData);

      
      if (response && response.token) {
        await Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Giriş işlemi başarıyla tamamlandı.',
          showConfirmButton: false,
          timer: 1500
        });

        return response;
      }
    } catch (error: any) {
      console.error('Login error in slice:', error);
      const message = error.message || 'Giriş işlemi başarısız oldu.';
      
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

// Register işlemi
export const fetchRegister = createAsyncThunk(
  'user/fetchRegister',
  async (userData: { email: string; password: string; rePassword: string }, { rejectWithValue }) => {
    try {


      const response = await RestApis.register(userData);


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

// Action payload tipi tanımla
interface LoginPayload {
  token: string;
  isAuthenticated: boolean;
}

// Slice'ı güncelle
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        if (action.payload) {
          state.loading = false;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.error = null;
        }
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
export const { logout } = userSlice.actions;
export default userSlice.reducer;
