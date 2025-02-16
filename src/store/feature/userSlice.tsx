// state tanımlama

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apis from "../../config/RestApis";
import { IRegisterRequest } from "../../model/IRegisterRequest";
import { ILoginRequest } from "../../model/ILoginRequest";
import swal from "sweetalert";
import { IBaseResponse } from "../../model/IBaseResponse";
import { error } from "console";


// Kullanıcı state'inin tipini tanımlıyoruz
interface UserState {
  isAuth: boolean;
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
  user: { password: string; email: string; repassword: string } | null;
  token: string | null;
  error: string | null;
}

// API'den dönecek cevabın tipi
interface AuthResponse {
  user: {  password: string; email: string ; repassword:string};
  token: string;
}

// Login/register için gönderilecek verinin tipi
interface AuthRequest {
  email: string;
  password: string;
}

// Başlangıç state'ini belirle
const initialUserState: UserState = {
  isAuth: false,
  isLoginLoading: false,
  isRegisterLoading: false,
  user: null,
  token: null,
  error: null,
};

// Login işlemi için async thunk
// export const fetchRegister = createAsyncThunk(
//   'auth/fetchRegister',
//  async (payload: IRegisterRequest)=>{
//       const response = await fetch(
//           apis.userService+'/register',{
//               method: 'POST',
//               headers:{
//                   'Content-Type': 'application/json'
//               },
//               body: JSON.stringify(payload)
//           }).then(data=>data.json())
//       return response;
//  }
// )
export const fetchRegister = createAsyncThunk(
  'auth/fetchRegister',
  async (payload: IRegisterRequest, { rejectWithValue }) => {
    try {
      const response = await fetch(apis.userService + '/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
       
      });
     

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const responseData = await response.json();

      // API yanıtındaki `data` alanını döndürüyoruz.
      return responseData.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchLogin = createAsyncThunk(
  'auth/fetchLogin',
  async(payload: ILoginRequest)=>{
      const response = await fetch(
          apis.userService+'/login',{
              method: 'POST',
              headers:{
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
          }).then(data=>data.json())
      return response;
  }
)

// Slice oluştur
const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.isAuth = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.isLoginLoading = true;
        state.error = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action: PayloadAction<IBaseResponse>) => {
        state.isLoginLoading = false;
        console.log("Gelen API Yanıtı:", action.payload);
        if (action.payload.code === 200) {
          localStorage.setItem('token', action.payload.data);
          state.isAuth = true;
        } else {
          swal('Hata!', action.payload.message, 'error');
        }
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.isLoginLoading = false;
        state.error = action.payload as string;
        swal('Hata!', action.payload as string, 'error');
      })
      .addCase(fetchRegister.pending, (state) => {
        state.isRegisterLoading = true;
        state.error = null;
      })
      .addCase(fetchRegister.fulfilled, (state, action: PayloadAction<IBaseResponse>) => {
        state.isRegisterLoading = false;
        if (action.payload.code === 200) {
          swal('Başarılı', 'Üyelik işlemi başarı ile tamamlanmıştır', 'success');
        } else {
          swal('Hata!', action.payload.message, 'error');
        }
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.isRegisterLoading = false;
        state.error = action.payload as string;
        swal('Hata!', action.payload as string, 'error');
      });
  }
});  
export const { logout } = userSlice.actions;
export default userSlice;
