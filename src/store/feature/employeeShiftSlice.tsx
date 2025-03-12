import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '..';

// Tipler
export interface EmployeeShift {
  id: number;
  employeeId: number;
  shiftId: number;
  employeeName: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeShiftRequest {
  employeeId: number;
  shiftId: number;
}

interface EmployeeShiftState {
  employeeShifts: EmployeeShift[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeShiftState = {
  employeeShifts: [],
  loading: false,
  error: null
};

// Vardiya atama thunk'ı
export const createEmployeeShiftAsync = createAsyncThunk(
  'employeeShift/createEmployeeShift',
  async (request: CreateEmployeeShiftRequest, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token bulunamadı');
      }

      const response = await fetch('http://localhost:9090/v1/api/employee-shift/create-employee-shift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Vardiya ataması oluşturulurken bir hata oluştu');
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Tüm vardiya atamalarını getirme thunk'ı
export const fetchEmployeeShiftsAsync = createAsyncThunk(
  'employeeShift/fetchEmployeeShifts',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token bulunamadı');
      }

      const response = await fetch('http://localhost:9090/v1/api/employee-shift/get-all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Vardiya atamaları getirilemedi');
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const employeeShiftSlice = createSlice({
  name: 'employeeShift',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEmployeeShiftAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployeeShiftAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeShifts.push(action.payload);
      })
      .addCase(createEmployeeShiftAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchEmployeeShiftsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeShiftsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeShifts = action.payload;
      })
      .addCase(fetchEmployeeShiftsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// Selector'lar
export const selectAllEmployeeShifts = (state: RootState) => state.employeeShift.employeeShifts;
export const selectEmployeeShiftLoading = (state: RootState) => state.employeeShift.loading;
export const selectEmployeeShiftError = (state: RootState) => state.employeeShift.error;

export default employeeShiftSlice.reducer; 