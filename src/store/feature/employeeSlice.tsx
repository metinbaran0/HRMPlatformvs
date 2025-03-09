import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiService, { Employee, PartialEmployee, CreateEmployeeRequest, UpdateEmployeeRequest } from"../../services/ApiService";
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

export const updateEmployeeThunk = createAsyncThunk<
  void, // Bu işlem veri döndürmeyecek
  { id: number; employeeData: UpdateEmployeeRequest }, // Parametre tipi
  { rejectValue: string } // Hata mesajı tipi
>(
  'employee/updateEmployee',
  async ({ id, employeeData }, { rejectWithValue, dispatch }) => {
    try {
      // API'ye put isteği gönder
      await ApiService.updateEmployee(id, employeeData);

      // Çalışan başarıyla güncellendi, kullanıcıya bildirim
      await Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Çalışan başarıyla güncellendi',
        showConfirmButton: false,
        timer: 1500
      });

      // Çalışan güncellendikten sonra hemen listeyi güncellemek için fetchEmployees action'ını tetikleyebiliriz
      dispatch(fetchEmployees({ page: 0, size: 10 })); // Tüm çalışanları yeniden çekmek

    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.message || 'Çalışan güncellenirken bir hata oluştu'
      });

      return rejectWithValue(error.message);
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employee/deleteEmployee',
  async (id: number, { rejectWithValue, dispatch }) => {
    try {
      // Silme işlemi için onay iste
      const result = await Swal.fire({
        title: 'Emin misiniz?',
        text: "Bu çalışan kalıcı olarak silinecek!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet, sil!',
        cancelButtonText: 'İptal'
      });
      
      // Kullanıcı onaylamadıysa işlemi iptal et
      if (!result.isConfirmed) {
        return rejectWithValue('İşlem iptal edildi');
      }
      
      // API çağrısı yap
      await ApiService.deleteEmployee(id);
      
      // Başarılı bildirim göster
      await Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Çalışan başarıyla silindi',
        showConfirmButton: false,
        timer: 1500
      });
      
      // Listeyi güncelle
      dispatch(fetchEmployees({}));
      
      return id;
    } catch (error: any) {
      console.error("Delete employee error:", error);
      
      let errorMessage = "Çalışan silinirken bir hata oluştu";
      
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = "Bu işlemi yapmak için yetkiniz bulunmuyor";
        } else if (error.response.data) {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      await Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: errorMessage
      });
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const toggleEmployeeStatus = createAsyncThunk(
  'employee/toggleStatus',
  async (id: number, { rejectWithValue, dispatch }) => {
    try {
      // API çağrısı yapılıyor
      await ApiService.toggleEmployeeStatus(id);
      
      // Başarılı bildirim göster
      await Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Çalışan durumu değiştirildi',
        showConfirmButton: false,
        timer: 1500
      });
      
      // Listeyi yenile
      dispatch(fetchEmployees({}));
      
      return id;
    } catch (error: any) {
      console.error("Toggle status error:", error);
      
      let errorMessage = "Çalışan durumu değiştirilirken bir hata oluştu";
      
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = "Bu işlemi yapmak için yetkiniz bulunmuyor";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      await Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: errorMessage
      });
      
      return rejectWithValue(errorMessage);
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
    // Update Employee
    .addCase(updateEmployeeThunk.fulfilled, (state) => {
      // Çalışan güncellemek için herhangi bir şey yapmamıza gerek yok
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
