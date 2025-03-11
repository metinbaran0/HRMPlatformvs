import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface CompanySummary {
  totalCompanies: number;
  totalAdmins: number;
  totalEmployees: number;
}

interface DashboardState {
  summary: CompanySummary | null;
  monthlyStats: Record<string, number> | null;
  loading: boolean;
  statsLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  summary: null,
  monthlyStats: null,
  loading: false,
  statsLoading: false,
  error: null,
};

// Dashboard özet bilgilerini getirme
export const fetchDashboardSummaryAsync = createAsyncThunk(
  "dashboard/fetchSummary",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      if (!token) {
        throw new Error("Token bulunamadı.");
      }

      const response = await fetch(`http://localhost:9090/v1/api/company/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Dashboard bilgileri alınırken hata oluştu.");
      }

      const responseData = await response.json();
      return responseData.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Dashboard bilgileri getirilemedi.");
    }
  }
);

// Aylık şirket istatistiklerini getirme
export const fetchMonthlyStatsAsync = createAsyncThunk(
  "dashboard/fetchMonthlyStats",
  async (year: number = new Date().getFullYear(), { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      if (!token) {
        throw new Error("Token bulunamadı.");
      }

      const response = await fetch(`http://localhost:9090/v1/api/company/statistics?year=${year}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Aylık istatistikler alınırken hata oluştu.");
      }

      const responseData = await response.json();
      return responseData.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Aylık istatistikler getirilemedi.");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummaryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummaryAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummaryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMonthlyStatsAsync.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyStatsAsync.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.monthlyStats = action.payload;
      })
      .addCase(fetchMonthlyStatsAsync.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer; 