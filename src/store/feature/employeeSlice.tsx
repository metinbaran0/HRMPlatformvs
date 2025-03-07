import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiService, { Employee, PartialEmployee, CreateEmployeeRequest } from"../../services/ApiService";
import Swal from 'sweetalert2';
//deneme 
// Interfaces


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

export const createEmployeeThunk = createAsyncThunk<
  void, // Bu işlem veri döndürmeyecek
  CreateEmployeeRequest, // Parametre tipi
  { rejectValue: string } // Hata mesajı tipi
>(
  'employee/createEmployee',
  async (employeeData, { rejectWithValue, dispatch }) => {
    try {
      // API'ye post isteği gönder
      await ApiService.createEmployee(employeeData);

      // Çalışan başarıyla eklendi, kullanıcıya bildirim
      await Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Çalışan başarıyla eklendi',
        showConfirmButton: false,
        timer: 1500
      });

      // Çalışan eklendikten sonra hemen listeyi güncellemek için fetchEmployees action'ını tetikleyebiliriz
      dispatch(fetchEmployees({ page: 0, size: 10 })); // Tüm çalışanları yeniden çekmek

    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.message || 'Çalışan eklenirken bir hata oluştu'
      });

      return rejectWithValue(error.message);
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

     // Create Employee
     .addCase(createEmployeeThunk.fulfilled, (state) => {
      // Yeni çalışan eklemek için herhangi bir şey yapmamıza gerek yok
      // Çünkü fetchEmployees çağrıldığında liste zaten güncelleniyor
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
