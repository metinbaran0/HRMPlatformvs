// state tanımlama

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import Swal from 'sweetalert2';
import { IRegisterRequest } from "../../model/IRegisterRequest";
import { ILoginRequest } from "../../model/ILoginRequest";
import { IBaseResponse } from "../../model/IBaseResponse";

// Kullanıcı state'inin tipini tanımlıyoruz
interface UserState {
  user: any;
  loading: boolean;
  error: string | null;
}

// Başlangıç state'ini belirle
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Login işlemi
export const fetchLogin = createAsyncThunk(
  'user/fetchLogin',
  async (userData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:9090/v1/dev/user/dologin', userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        await Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Giriş işlemi başarıyla tamamlandı.',
          showConfirmButton: false,
          timer: 1500
        });

        return response.data;
      }
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.response?.data?.message || 'Giriş işlemi başarısız oldu.',
        confirmButtonText: 'Tamam'
      });

      return rejectWithValue(error.response?.data?.message || 'Giriş işlemi başarısız oldu.');
    }
  }
);

// Register işlemi
export const fetchRegister = createAsyncThunk(
  'user/fetchRegister',
  async (userData: { email: string; password: string; rePassword: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:9090/v1/dev/user/register', userData);

      if (response.data) {
        await Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Kayıt işlemi başarıyla tamamlandı.',
          showConfirmButton: false,
          timer: 1500
        });

        return response.data;
      }
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.response?.data?.message || 'Kayıt işlemi başarısız oldu.',
        confirmButtonText: 'Tamam'
      });

      return rejectWithValue(error.response?.data?.message || 'Kayıt işlemi başarısız oldu.');
    }
  }
);

// Slice oluştur
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login işlemleri
      .addCase(fetchLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
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
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
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
