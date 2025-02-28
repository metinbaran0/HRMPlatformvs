import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  shifts: Shift[];
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

// Tüm vardiyaları çekme asenkron işlem
export const fetchShiftsAsync = createAsyncThunk("shifts/fetchShifts", async (_, { rejectWithValue }) => {
  try {
    return await fetchShifts();
  } catch (error) {
    return rejectWithValue("Vardiyalar getirilemedi.");
  }
});

// Vardiya güncelleme asenkron işlem
export const updateShiftAsync = createAsyncThunk(
  "shifts/updateShift",
  async ({ id, updatedShiftData }: { id: string; updatedShiftData: Partial<Shift> }, { rejectWithValue }) => {
    try {
      return await updateShift(id, updatedShiftData);
    } catch (error) {
      return rejectWithValue("Vardiya güncellenemedi.");
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

// Vardiya Redux Slice
const shiftSlice = createSlice({
  name: "shifts",
  initialState,
  reducers: {
    // Vardiya listesi güncelleme
    setShifts: (state, action: PayloadAction<Shift[]>) => {
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
      .addCase(updateShiftAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateShiftAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.shifts.findIndex((shift) => shift.id === action.payload.id);
        if (index !== -1) {
          state.shifts[index] = action.payload;
        }
      })
      .addCase(updateShiftAsync.rejected, (state, action) => {
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
      });
  },
});

export const { setShifts } = shiftSlice.actions;  

export default shiftSlice.reducer;
