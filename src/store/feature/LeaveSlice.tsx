import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import Swal from 'sweetalert2';
import RestApis from '../../services/RestApis';


const BASE_URL = "http://localhost:9090/v1/api/leave/leaverequest";

interface LeaveRequest {
  id: string;
  employeeId: number;
  type: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  description: string;
  responseMessage?: string;
}

interface LeaveState {
  leaveRequests: LeaveRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: LeaveState = {
  leaveRequests: [],
  loading: false,
  error: null,
};

// Yeni izin talebi oluşturma
export const addLeaveRequestAsync = createAsyncThunk(
  "leave/LeaveRequest",
  async (leaveData: Omit<LeaveRequest, "id" | "status">, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/leaverequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaveData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "İzin talebi oluşturulurken hata oluştu.");
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "İzin talebi oluşturulamadı.");
    }
  }
);

// Belirli bir kullanıcıya ait izin taleplerini çekme
export const fetchLeaveRequestsByUserIdAsync = createAsyncThunk(
  "leave/fetchLeaveRequestsByUserId",
  async (employeeId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/leavebyuserid/${employeeId}`);
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Kullanıcı izin talepleri alınırken hata oluştu.");
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Kullanıcı izin talepleri getirilemedi.");
    }
  }
);

// Tüm izin taleplerini çekme
export const fetchLeaveRequestsAsync = createAsyncThunk(
  "leave/fetchLeaveRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/leaverequests`);
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "İzin talepleri alınırken hata oluştu.");
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "İzin talepleri getirilemedi.");
    }
  }
);

// İzin talebi durumunu güncelleme
export const updateLeaveStatusAsync = createAsyncThunk(
  "leave/updateLeaveStatus",
  async (
    { id, status, responseMessage }: { id: string; status: "approved" | "rejected"; responseMessage?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, responseMessage }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "İzin durumu güncellenirken hata oluştu.");
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "İzin durumu güncellenemedi.");
    }
  }
);

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    setLeaveRequests: (state, action: PayloadAction<LeaveRequest[]>) => {
      state.leaveRequests = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveRequestsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequestsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = action.payload;
      })
      .addCase(fetchLeaveRequestsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchLeaveRequestsByUserIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequestsByUserIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = action.payload;
      })
      .addCase(fetchLeaveRequestsByUserIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addLeaveRequestAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addLeaveRequestAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests.push(action.payload);
      })
      .addCase(addLeaveRequestAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateLeaveStatusAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLeaveStatusAsync.fulfilled, (state, action) => {
        state.loading = false;
        const leaveRequest = state.leaveRequests.find((req) => req.id === action.payload.id);
        if (leaveRequest) {
          leaveRequest.status = action.payload.status;
          leaveRequest.responseMessage = action.payload.responseMessage;
        }
      })
      .addCase(updateLeaveStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLeaveRequests } = leaveSlice.actions;

export default leaveSlice.reducer;
