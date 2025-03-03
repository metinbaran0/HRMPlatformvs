import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService";
import Swal from 'sweetalert2';

// Interfaces
interface Employee {
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

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null
};

// Async Thunks
export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async ({ page = 0, size = 10 }: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await ApiService.getAllEmployees(page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Çalışanlar yüklenirken bir hata oluştu');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employee/deleteEmployee',
  async (id: number, { rejectWithValue }) => {
    try {
      // API çağrısı eklenecek
      await Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Çalışan silindi',
        showConfirmButton: false,
        timer: 1500
      });
      return id;
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.message || 'Çalışan silinirken bir hata oluştu'
      });
      return rejectWithValue(error.message);
    }
  }
);

export const toggleEmployeeStatus = createAsyncThunk(
  'employee/toggleStatus',
  async (id: number, { rejectWithValue, getState }) => {
    try {
      // API çağrısı eklenecek
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Employee
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(emp => emp.id !== action.payload);
      })
      // Toggle Status
      .addCase(toggleEmployeeStatus.fulfilled, (state, action) => {
        const employee = state.employees.find(emp => emp.id === action.payload);
        if (employee) {
          employee.isActive = !employee.isActive;
        }
      });
  }
});

export default employeeSlice.reducer;
