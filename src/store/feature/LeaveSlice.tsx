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


// Yönetici için bekleyen izin taleplerini çekme ve çalışan isimlerini alma
export const fetchPendingLeavesForManagerAsync = createAsyncThunk(
  "leave/fetchPendingLeavesForManager",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      if (!token) {
        throw new Error("Token bulunamadı.");
      }

      // İzin taleplerini al
      const response = await fetch(`http://localhost:9090/v1/api/leave/manager/{{managerId}}/pending-leaves`, {
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

      const responseData = await response.json();
      const leaveRequests = responseData.data;
      
      // Çalışan isimlerini ekle
      return leaveRequests;
    } catch (error: any) {
      return rejectWithValue(error.message || "Bekleyen izin talepleri getirilemedi.");
    }
  }
);



// Yönetici tarafından izin onaylama
export const approveLeaveByManagerAsync = createAsyncThunk(
  "leave/approveLeaveByManager",
  async (employeeId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const managerId = state.user.userId;
      const token = state.user.token;
      if (!managerId) throw new Error("Yönetici kimliği bulunamadı.");
      if (!token) throw new Error("Token bulunamadı.");

      const response = await fetch(`http://localhost:9090/v1/api/leave/manager/${managerId}/approve/${employeeId}`, {
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

// Kullanıcı izin talebi oluşturma
export const createLeaveRequestAsync = createAsyncThunk(
  "leave/createLeaveRequest",
  async (leaveData: { startDate: string; endDate: string; leaveType: string; reason: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;
      
      if (!token) {
        throw new Error("Token bulunamadı.");
      }

      const response = await fetch(`http://localhost:9090/v1/api/leave/leaverequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(leaveData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "İzin talebi oluşturulurken hata oluştu.");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "İzin talebi oluşturulamadı.");
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
      })

      .addCase(createLeaveRequestAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeaveRequestAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests.push(action.payload);
      })
      .addCase(createLeaveRequestAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default leaveSlice.reducer;

        