import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '..';

// Tipler
export interface Break {
  id: number;
  shiftId: number;
  companyId: number;
  breakName: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface BreakRequestDto {
  shiftId: number;
  breakName: string;
  startTime: string;
  endTime: string;
}

interface BreakState {
  breaks: Break[];
  loading: boolean;
  error: string | null;
}

const initialState: BreakState = {
  breaks: [],
  loading: false,
  error: null
};

// Mola oluşturma thunk'ı
export const createBreakAsync = createAsyncThunk(
  'break/createBreak',
  async (breakData: BreakRequestDto, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token bulunamadı');
      }

      const response = await fetch('http://localhost:9090/v1/api/break/create-break', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(breakData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Mola oluşturulurken bir hata oluştu');
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

// Fetch thunk'ı
export const fetchBreaksAsync = createAsyncThunk(
  'break/fetchBreaks',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token bulunamadı');
      }

      const response = await fetch('http://localhost:9090/v1/api/break/all-active-breaks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Molalar getirilemedi');
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

// Update thunk'ı
export const updateBreakAsync = createAsyncThunk(
  'break/updateBreak',
  async ({ breakId, breakData }: { breakId: number, breakData: BreakRequestDto }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token bulunamadı');
      }

      const response = await fetch(`http://localhost:9090/v1/api/break/update-break/${breakId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(breakData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Mola güncellenirken bir hata oluştu');
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

// Delete thunk'ı
export const deleteBreakAsync = createAsyncThunk(
  'break/deleteBreak',
  async (breakId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token bulunamadı');
      }

      const response = await fetch(`http://localhost:9090/v1/api/break/delete-break/${breakId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Mola silinirken bir hata oluştu');
      }

      const data = await response.json();
      
      if (data.success) {
        return breakId; // Silinen molanın ID'sini döndür
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Break slice
const breakSlice = createSlice({
  name: 'break',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBreakAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBreakAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.breaks.push(action.payload);
      })
      .addCase(createBreakAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBreaksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBreaksAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.breaks = action.payload;
      })
      .addCase(fetchBreaksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBreakAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBreakAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.breaks.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.breaks[index] = action.payload;
        }
      })
      .addCase(updateBreakAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBreakAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBreakAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.breaks = state.breaks.filter(b => b.id !== action.payload);
      })
      .addCase(deleteBreakAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// Selector'lar
export const selectAllBreaks = (state: RootState) => state.break.breaks;
export const selectBreakLoading = (state: RootState) => state.break.loading;
export const selectBreakError = (state: RootState) => state.break.error;

export default breakSlice.reducer; 