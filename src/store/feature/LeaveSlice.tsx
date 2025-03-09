import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from 'sweetalert2';
import { RootState } from "../../store";

interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName?: string; 
  type: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  description: string;
  responseMessage?: string;
}

interface LeaveState {
  leaveRequests: LeaveRequest[];
  pendingLeaveRequests: LeaveRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: LeaveState = {
  leaveRequests: [],
  pendingLeaveRequests: [],
  loading: false,
  error: null,
};

// Kullanıcıya ait izin taleplerini çekme
export const fetchLeaveRequestsByUserIdAsync = createAsyncThunk(
  "leave/fetchLeaveRequestsByUserId",
  async (employeeId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token; // Redux store'dan token alıyoruz

      if (!token) {
        throw new Error("Token bulunamadı.");
      }

      const response = await fetch(`http://localhost:9090/v1/api/leave/leavebyuserid/${employeeId}`, {
        method: 'GET', // GET metodu belirtiliyor
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Token ile doğrulama yapıyoruz
        },
      });

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


// Yönetici için bekleyen izin taleplerini çekme
export const fetchPendingLeavesForManagerAsync = createAsyncThunk(
  "leave/fetchPendingLeavesForManager",
  async (managerId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token; // Redux store'dan token alıyoruz

      if (!token) {
        throw new Error("Token bulunamadı.");
      }

      const response = await fetch(`http://localhost:9090/v1/api/leave/manager/${managerId}/pending-leaves`, {
        method: 'GET', // GET metodu belirtiliyor
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Token ile doğrulama yapıyoruz
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Bekleyen izin talepleri alınırken hata oluştu.");
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Bekleyen izin talepleri getirilemedi.");
    }
  }
);



// Yönetici tarafından bir çalışan için izin onaylama
export const approveLeaveByManagerAsync = createAsyncThunk(
  "leave/approveLeaveByManager",
  async (employeeId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const managerId = state.user.userId;
      const token = state.user.token; // Redux store'dan token alıyoruz
      if (!managerId) throw new Error("Yönetici kimliği bulunamadı.");
      if (!token) throw new Error("Token bulunamadı.");

      const response = await fetch(`http://localhost:9090/v1/api/leave/manager/${managerId}/approve/${employeeId}`, {
        method: "PUT", // PUT metodu belirtiliyor
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Token ile doğrulama yapıyoruz
        },
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "İzin onaylanırken hata oluştu.");
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "İzin onaylanamadı.");
    }
  }
);


// Yönetici tarafından bir çalışan için izin reddetme
export const rejectLeaveByManagerAsync = createAsyncThunk(
  "leave/rejectLeaveByManager",
  async (employeeId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const managerId = state.user.userId;
      const token = state.user.token; // Redux store'dan token alıyoruz
      if (!managerId) throw new Error("Yönetici kimliği bulunamadı.");
      if (!token) throw new Error("Token bulunamadı.");

      const response = await fetch(`http://localhost:9090/v1/api/leave/manager/${managerId}/reject/${employeeId}`, {
        method: "PUT", 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "İzin reddedilirken hata oluştu.");
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "İzin reddedilemedi.");
    }
  }
);



const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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

      .addCase(fetchPendingLeavesForManagerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingLeavesForManagerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingLeaveRequests = action.payload;
      })
      .addCase(fetchPendingLeavesForManagerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(approveLeaveByManagerAsync.fulfilled, (state, action) => {
        state.loading = false;
        const leaveRequest = state.leaveRequests.find((req) => req.id === action.payload.id);
        if (leaveRequest) {
          leaveRequest.status = "approved";
          leaveRequest.responseMessage = action.payload.responseMessage;
        }
        Swal.fire("Başarı", "İzin talebi onaylandı!", "success");
      })
      .addCase(rejectLeaveByManagerAsync.fulfilled, (state, action) => {
        state.loading = false;
        const leaveRequest = state.leaveRequests.find((req) => req.id === action.payload.id);
        if (leaveRequest) {
          leaveRequest.status = "rejected";
          leaveRequest.responseMessage = action.payload.responseMessage;
        }
        Swal.fire("Başarı", "İzin talebi reddedildi.", "error");
      });
  },
});

export default leaveSlice.reducer;
