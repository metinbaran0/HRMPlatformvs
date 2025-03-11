import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { createSelector } from 'reselect';
import { Company } from '../../types/Company';

// Define the CompanyState type
interface CompanyState {
  companies: Company[];
  expiringSoonCompanies: Company[];
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  expiringSoonCompanies: [],
  loading: false,
  error: null,
};

export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:9090/v1/api/company/find-all-company", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue("Şirketleri çekerken hata oluştu.");
    }
  }
);
export const fetchPendingCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:9090/v1/api/company/pending-company", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue("Şirketleri çekerken hata oluştu.");
    }
  }
);
export const fetchAprovedCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:9090/v1/api/company/approved", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue("Şirketleri çekerken hata oluştu.");
    }
  }
);

// Şirket onaylama işlemi
export const approveCompany = createAsyncThunk(
  "companies/approveCompany",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:9090/v1/api/company/approve-company/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue("Şirket onaylanırken hata oluştu.");
    }
  }
);

// Şirket reddetme işlemi
export const rejectCompany = createAsyncThunk(
  "companies/rejectCompany",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:9090/v1/api/company/reject-company/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue("Şirket reddedilirken hata oluştu.");
    }
  }
);

// Yaklaşan üyelik sonlandırmaları için thunk
export const fetchExpiringSoonCompanies = createAsyncThunk(
  "companies/fetchExpiringSoonCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:9090/v1/api/company/subscriptions/expiring-soon", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue("Yaklaşan üyelik sonlandırmaları alınırken hata oluştu.");
    }
  }
);

// Redux state
const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Şirket onaylama
      .addCase(approveCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveCompany.fulfilled, (state, action) => {
        state.loading = false;
        // Onaylanan şirketi güncelle
        const index = state.companies.findIndex(company => company.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      .addCase(approveCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Şirket reddetme
      .addCase(rejectCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectCompany.fulfilled, (state, action) => {
        state.loading = false;
        // Reddedilen şirketi güncelle
        const index = state.companies.findIndex(company => company.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      .addCase(rejectCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Yaklaşan üyelik sonlandırmaları
      .addCase(fetchExpiringSoonCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpiringSoonCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.expiringSoonCompanies = action.payload;
      })
      .addCase(fetchExpiringSoonCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
const selectCompanies = (state: RootState) => state.companies.companies;

export const selectCompanyOptions = createSelector(
  [selectCompanies],
  (companies) => {
    return companies.map(company => ({
      value: company.id,
      label: company.name,
    }));
  }
);

export default companySlice.reducer;