import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService";
import Swal from 'sweetalert2';
//deneme 
// Interfaces
interface Employee {
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

interface EmployeeResponse {
  content: Employee[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
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
export const fetchEmployees = createAsyncThunk<
  Employee[], // Thunk'ın döneceği veri tipi
  { page?: number; size?: number },
  { rejectValue: string }
>(
  'employee/fetchEmployees',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await ApiService.getAllEmployees(page, size);
      return response.data.content; // Direkt content'i dönüyoruz
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
        state.employees = action.payload; // Artık direkt payload'ı kullanabiliriz
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
          employee.active = !employee.active;
        }
      });
  }
});

export default employeeSlice.reducer;
