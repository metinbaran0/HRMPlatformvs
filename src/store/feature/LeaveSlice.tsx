import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const BASE_URL = "http://localhost:9090/v1/dev/leave";

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
  "leave/addLeaveRequest",
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
        throw new Error("İzin talebi oluşturulurken hata oluştu.");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue("İzin talebi oluşturulamadı.");
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
        throw new Error("İzin talepleri alınırken hata oluştu.");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue("İzin talepleri getirilemedi.");
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
      const response = await fetch(`${BASE_URL}/leaverequest/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, responseMessage }),
      });

      if (!response.ok) {
        throw new Error("İzin durumu güncellenirken hata oluştu.");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue("İzin durumu güncellenemedi.");
    }
  }
);

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    // İzin taleplerini set etme
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

