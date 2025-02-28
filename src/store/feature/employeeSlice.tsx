import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Swal from 'sweetalert2';
import ApiService from '../../services/ApiService';

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
  page: number;
  size: number;
  hasMore: boolean;
}

interface GetEmployeesResponse {
  success: boolean;
  message: string;
  code: number;
  data: Employee[];
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
  page: 0,
  size: 10,
  hasMore: true
};

// Fetch all employees
export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async ({ page = 0, size = 10 }: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await ApiService.getAllEmployees(page, size);

      if (response.success) {
        return {
          employees: response.data,
          message: response.message,
          hasMore: response.data.length === size
        };
      } else {
        if (response.code === 404) {
          return {
            employees: [],
            message: response.message,
            hasMore: false
          };
        }
        throw new Error(response.message);
      }
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.message || 'Çalışanlar yüklenirken bir hata oluştu',
        confirmButtonText: 'Tamam'
      });
      return rejectWithValue(error.message || 'Bir hata oluştu');
    }
  }
);

// Add new employee
export const addEmployee = createAsyncThunk(
  'employee/addEmployee',
  async (employeeData: Omit<Employee, 'id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/employees', employeeData);
      await Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Çalışan başarıyla eklendi.',
      });
      return response.data;
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.response.data.message || 'Çalışan eklenirken bir hata oluştu.',
      });
      return rejectWithValue(error.response.data);
    }
  }
);

// Update employee
export const updateEmployee = createAsyncThunk(
  'employee/updateEmployee',
  async (employeeData: Employee, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/employees/${employeeData.id}`, employeeData);
      await Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Çalışan bilgileri güncellendi.',
      });
      return response.data;
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.response.data.message || 'Güncelleme sırasında bir hata oluştu.',
      });
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete employee
export const deleteEmployee = createAsyncThunk(
  'employee/deleteEmployee',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/employees/${id}`);
      await Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Çalışan silindi.',
      });
      return id;
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.response.data.message || 'Silme işlemi sırasında bir hata oluştu.',
      });
      return rejectWithValue(error.response.data);
    }
  }
);

// Toggle employee status
export const toggleEmployeeStatus = createAsyncThunk(
  'employee/toggleStatus',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/employees/${id}/toggle-status`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    resetEmployees: (state) => {
      state.employees = [];
      state.page = 0;
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        if (state.page === 0) {
          state.employees = action.payload.employees;
        } else {
          state.employees = [...state.employees, ...action.payload.employees];
        }
        state.hasMore = action.payload.hasMore;
        state.page += 1;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Employee
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
      // Update Employee
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      // Delete Employee
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(emp => emp.id !== action.payload);
      })
      // Toggle Status
      .addCase(toggleEmployeeStatus.fulfilled, (state, action) => {
        const employee = state.employees.find(emp => emp.id === action.payload.id);
        if (employee) {
          employee.isActive = action.payload.isActive;
        }
      });
  }
});

export const { resetEmployees } = employeeSlice.actions;
export default employeeSlice.reducer; 