import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import ApiService, { ShiftDto, ShiftType } from "../../services/ApiService";
import { RootState } from "..";
import Swal from 'sweetalert2';

// API İşlevleri
const BASE_URL = "http://localhost:9090/v1/dev/shift";

// Yeni bir vardiya ekler
export const createShift = async (shiftData: {
  employeeId: number;
  date: string;
  type: string;
  startTime: string;
  endTime: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shiftData),
    });

    if (!response.ok) {
      throw new Error("Vardiya eklenirken hata oluştu.");
    }

    return await response.json();
  } catch (error) {
    console.error("createShift Error:", error);
    throw error;
  }
};

// Tüm vardiyaları getirir
export const fetchShifts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/all`);
    if (!response.ok) {
      throw new Error("Vardiyalar alınırken hata oluştu.");
    }

    return await response.json();
  } catch (error) {
    console.error("fetchShifts Error:", error);
    return [];
  }
};

// Vardiya günceller
export const updateShift = async (shiftId: string, updatedShiftData: Partial<{ type: string; startTime: string; endTime: string }>) => {
  try {
    const response = await fetch(`${BASE_URL}/update/${shiftId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedShiftData),
    });

    if (!response.ok) {
      throw new Error("Vardiya güncellenirken hata oluştu.");
    }

    return await response.json();
  } catch (error) {
    console.error("updateShift Error:", error);
    throw error;
  }
};

// Vardiya siler
export const deleteShift = async (shiftId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/delete/${shiftId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Vardiya silinirken hata oluştu.");
    }

    return { success: true, id: shiftId };
  } catch (error) {
    console.error("deleteShift Error:", error);
    throw error;
  }
};

// Redux State için Shift tipi
interface Shift {
  id: string;
  employeeId: number;
  date: string;
  type: string;
  startTime: string;
  endTime: string;
}

interface ShiftState {
  shifts: ShiftDto[];
  loading: boolean;
  error: string | null;
}

const initialState: ShiftState = {
  shifts: [],
  loading: false,
  error: null,
};

// Yeni vardiya ekleme asenkron işlem
export const addShiftAsync = createAsyncThunk(
  "shifts/addShift",
  async (shiftData: Omit<Shift, "id">, { rejectWithValue }) => {
    try {
      return await createShift(shiftData);
    } catch (error) {
      return rejectWithValue("Vardiya eklenemedi.");
    }
  }
);

// Vardiyaları getirme thunk'ı
export const fetchShiftsAsync = createAsyncThunk<
  ShiftDto[],
  void,
  { rejectValue: string }
>(
  'shifts/fetchShifts',
  async (_, { rejectWithValue }) => {
    try {
      // ApiService üzerinden vardiyaları getir
      const shifts = await ApiService.getAllShifts();
      return shifts;
    } catch (error: any) {
      // Hata durumunda SweetAlert ile bildirim göster
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.message || "Vardiyalar yüklenirken bir hata oluştu",
      });
      return rejectWithValue(error.message || "Vardiyalar yüklenirken bir hata oluştu");
    }
  }
);

// Vardiya güncelleme thunk'ı
export const updateShiftThunk = createAsyncThunk<
  ShiftDto,
  { id: string; shiftData: Partial<ShiftDto> },
  { rejectValue: string }
>(
  'shifts/updateShift',
  async ({ id, shiftData }, { rejectWithValue, dispatch }) => {
    try {
      const updatedShift = await ApiService.updateShift(id, shiftData);
      
      // Başarılı bildirim göster
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Vardiya başarıyla güncellendi',
        timer: 2000,
        showConfirmButton: false
      });
      
      // Vardiyaları yeniden yükle
      dispatch(fetchShiftsAsync());
      
      return updatedShift;
    } catch (error: any) {
      // Hata bildirim göster
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.message || 'Vardiya güncellenirken bir hata oluştu',
      });
      
      return rejectWithValue(error.message || "Vardiya güncellenirken bir hata oluştu");
    }
  }
);

// Vardiya silme asenkron işlem
export const deleteShiftAsync = createAsyncThunk("shifts/deleteShift", async (id: string, { rejectWithValue }) => {
  try {
    return await deleteShift(id);
  } catch (error) {
    return rejectWithValue("Vardiya silinemedi.");
  }
});

// Vardiya ekleme thunk'ı
export const createShiftThunk = createAsyncThunk<
  ShiftDto,
  { shiftName: string; startTime: string; endTime: string; shiftType: ShiftType },
  { rejectValue: string }
>(
  'shifts/createShift',
  async (shiftData, { rejectWithValue, dispatch }) => {
    try {
      const newShift = await ApiService.createShift(shiftData);
      
      // Başarılı bildirim göster
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Vardiya başarıyla oluşturuldu',
        timer: 2000,
        showConfirmButton: false
      });
      
      // Vardiyaları yeniden yükle
      dispatch(fetchShiftsAsync());
      
      return newShift;
    } catch (error: any) {
      // Hata bildirim göster
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.message || 'Vardiya oluşturulurken bir hata oluştu',
      });
      
      return rejectWithValue(error.message || "Vardiya oluşturulurken bir hata oluştu");
    }
  }
);

// Vardiya Redux Slice
const shiftSlice = createSlice({
  name: "shifts",
  initialState,
  reducers: {
    // Vardiya listesi güncelleme
    setShifts: (state, action: PayloadAction<ShiftDto[]>) => {
      state.shifts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Tüm vardiyaları çekme işlemi
      .addCase(fetchShiftsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShiftsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = action.payload;
      })
      .addCase(fetchShiftsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Yeni vardiya ekleme işlemi
      .addCase(addShiftAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addShiftAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts.push(action.payload);
      })
      .addCase(addShiftAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Vardiya güncelleme işlemi
      .addCase(updateShiftThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShiftThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.shifts.findIndex((shift) => shift.id === action.payload.id);
        if (index !== -1) {
          state.shifts[index] = action.payload;
        }
      })
      .addCase(updateShiftThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Vardiya silme işlemi
      .addCase(deleteShiftAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteShiftAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = state.shifts.filter((shift) => shift.id !== action.payload.id);
      })
      .addCase(deleteShiftAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Vardiya ekleme
      .addCase(createShiftThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShiftThunk.fulfilled, (state) => {
        state.loading = false;
        // Vardiyalar fetchShifts ile yeniden yüklenecek
      })
      .addCase(createShiftThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setShifts } = shiftSlice.actions;  

export default shiftSlice.reducer;
