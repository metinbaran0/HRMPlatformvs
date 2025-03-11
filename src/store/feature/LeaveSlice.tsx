import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { RootState } from "..";

// İzin durumu tipi
interface LeaveRequest {
  id: string;
  employeeName: string; // Burada employeeName ekleniyor
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  status: string;
  responseMessage: string;
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

// 1. **POST İstek: `leaverequest` (İzin Talebi Gönderme)**
export const submitLeaveRequestAsync = createAsyncThunk(
  "leave/submitLeaveRequest",
  async ({ startDate, endDate, leaveType, reason }: { startDate: string, endDate: string, leaveType: string, reason: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      if (!token) {
        throw new Error("Token bulunamadı.");
      }

      const response = await fetch("http://localhost:9090/v1/api/leave/leaverequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ startDate, endDate, leaveType, reason }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "İzin talebi gönderilirken hata oluştu.");
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "İzin talebi gönderilemedi.");
    }
  }
);

// 2. **GET İstek: `leavebyuserid` (Çalışanın İzin Talepleri)**
export const fetchLeaveRequestsByUserIdAsync = createAsyncThunk(
  "leave/fetchLeaveRequestsByUserId",
  async (employeeId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      if (!token) {
        throw new Error("Token bulunamadı.");
      }

      const response = await fetch(`http://localhost:9090/v1/api/leave/leavebyuserid/${employeeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

// 3. **GET İstek: `pending` (Bekleyen İzin Talepleri)**
export const fetchPendingLeavesForManagerAsync = createAsyncThunk(
  "leave/fetchPendingLeavesForManager",
  async (managerId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      if (!token) {
        throw new Error("Token bulunamadı.");
      }

      const response = await fetch(`http://localhost:9090/v1/api/leave/pending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

// 4. **POST İstek: `accept` (İzin Onaylama)**
export const approveLeaveByManagerAsync = createAsyncThunk(
  "leave/approveLeaveByManager",
  async (employeeId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      if (!token) {
        throw new Error("Token bulunamadı.");
      }

      const response = await fetch(`http://localhost:9090/v1/api/leave/accept/${employeeId}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

// 5. **POST İstek: `reject` (İzin Reddetme)**
export const rejectLeaveByManagerAsync = createAsyncThunk(
  "leave/rejectLeaveByManager",
  async (employeeId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      if (!token) {
        throw new Error("Token bulunamadı.");
      }

      const response = await fetch(`http://localhost:9090/v1/api/leave/reject/${employeeId}`, {
        method: "POST",
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

// Redux slice
const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // **Yorum Talebi**
      .addCase(submitLeaveRequestAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitLeaveRequestAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests.push(action.payload);
        Swal.fire("Başarı", "İzin talebiniz başarıyla gönderildi.", "success");
      })
      .addCase(submitLeaveRequestAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        Swal.fire("Hata", action.payload as string, "error");
      })

      // **İzin Talepleri Çekme**
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

      // **Bekleyen Talepleri Çekme**
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

      // **İzin Onaylama**
      .addCase(approveLeaveByManagerAsync.fulfilled, (state, action) => {
        state.loading = false;
        const leaveRequest = state.pendingLeaveRequests.find((req) => req.id === action.payload.id);
        if (leaveRequest) {
          leaveRequest.status = "approved";
          leaveRequest.responseMessage = action.payload.responseMessage;
        }
        Swal.fire("Başarı", "İzin talebi onaylandı.", "success");
      })
      // **İzin Reddetme**
      .addCase(rejectLeaveByManagerAsync.fulfilled, (state, action) => {
        state.loading = false;
        const leaveRequest = state.pendingLeaveRequests.find((req) => req.id === action.payload.id);
        if (leaveRequest) {
          leaveRequest.status = "rejected";
          leaveRequest.responseMessage = action.payload.responseMessage;
        }
        Swal.fire("Başarı", "İzin talebi reddedildi.", "error");
      });
  },
});

export default leaveSlice.reducer;
