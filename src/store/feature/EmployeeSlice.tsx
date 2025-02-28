import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// API URL'si
const BASE_URL = "http://localhost:9090/v1/api/employee";

// Çalışan verilerini temsil eden arayüz
export interface Employee {
  companyId: number;
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  position: string;
  status: boolean;
  createdAt: string;  // ISO 8601 formatında tarih
  updatedAt: string;  // ISO 8601 formatında tarih
  hireDate?: string;  // İşe başlama tarihi
  department?: string;
  address?: string;
  avatar?: string; // Avatar bilgisini ekledik
}

// Belirli bir çalışanın verilerini getirir
export const fetchEmployeeData = async (employeeId: number): Promise<Employee> => {
  try {
    const url = `${BASE_URL}/${employeeId}`;
    console.log("Fetching from URL:", url); // URL'yi loglayın
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Çalışan verileri alınırken hata oluştu: ${errorMessage}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchEmployeeData Error:", error);
    // Hata hakkında daha fazla bilgi vermek için
    if (error instanceof Error) {
      console.error("Hata Detayı:", error.message);
    }
    throw error;
  }
};


// Çalışan verilerini günceller (sadece belirli alanlar gönderilebilir)
export const updateEmployeeData = async (employeeId: number, data: Partial<Employee>): Promise<Employee> => {
  try {
    const response = await fetch(`${BASE_URL}/${employeeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Çalışan verileri güncellenirken hata oluştu: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error("updateEmployeeData Error:", error);
    throw error;
  }
};

// Redux state tipi
interface EmployeeState {
  employee: Employee | null;
  loading: boolean;
  error: string | null;
}

// Başlangıç durumu
const initialState: EmployeeState = {
  employee: null,
  loading: false,
  error: null,
};

// Çalışan verilerini API'den çekme
export const fetchEmployeeAsync = createAsyncThunk(
  "employee/fetchEmployee",
  async (employeeId: number, { rejectWithValue }) => {
    try {
      return await fetchEmployeeData(employeeId);
    } catch (error) {
      return rejectWithValue("Çalışan verileri alınırken hata oluştu.");
    }
  }
);

// Çalışan verilerini güncelleme
export const updateEmployeeAsync = createAsyncThunk(
  "employee/updateEmployee",
  async ({ employeeId, data }: { employeeId: number; data: Partial<Employee> }, { rejectWithValue }) => {
    try {
      return await updateEmployeeData(employeeId, data);
    } catch (error) {
      return rejectWithValue("Çalışan verileri güncellenirken hata oluştu.");
    }
  }
);

// Redux Slice
const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    // Çalışan verisini set etme
    setEmployee: (state, action: PayloadAction<Employee>) => {
      state.employee = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Çalışan verisini çekme işlemi
      .addCase(fetchEmployeeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeAsync.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(fetchEmployeeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Çalışan verisini güncelleme işlemi
      .addCase(updateEmployeeAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmployeeAsync.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(updateEmployeeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;
