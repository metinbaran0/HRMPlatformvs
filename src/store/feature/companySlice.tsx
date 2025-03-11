import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { createSelector } from 'reselect';
import { Company } from '../../types/Company';
import Swal from 'sweetalert2';

// Define the CompanyState type
interface CompanyState {
  companies: Company[];
  expiringSoonCompanies: Company[];
  companyDetails: any | null;
  loading: boolean;
  detailsLoading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  expiringSoonCompanies: [],
  companyDetails: null,
  loading: false,
  detailsLoading: false,
  error: null,
};

export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Tüm şirketleri getirme isteği gönderiliyor...");
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token bulunamadı");
      }
      
      const response = await fetch("http://localhost:9090/v1/api/company/find-all-company", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Tüm şirketler API yanıtı:", data);
      
      if (data.success) {
        return data.data;
      } else {
        return rejectWithValue(data.message || "Şirketleri getirme başarısız");
      }
    } catch (error: any) {
      console.error("Şirketleri getirme hatası:", error);
      return rejectWithValue(error.message || "Şirketleri çekerken hata oluştu.");
    }
  }
);

export const fetchPendingCompanies = createAsyncThunk(
  "companies/fetchPendingCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token bulunamadı");
      }
      
      const response = await fetch("http://localhost:9090/v1/api/company/pending-company", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Onay bekleyen şirketleri çekerken hata oluştu.");
    }
  }
);

export const fetchApprovedCompanies = createAsyncThunk(
  "companies/fetchApprovedCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token bulunamadı");
      }
      
      const response = await fetch("http://localhost:9090/v1/api/company/approved", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Onaylanmış şirketleri çekerken hata oluştu.");
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

// Şirket detaylarını getirme thunk'ını düzenleyelim
export const fetchCompanyDetailsAsync = createAsyncThunk(
  "companies/fetchCompanyDetails",
  async (companyId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token bulunamadı');
      }

      console.log("Detayları getirilen şirket ID:", companyId);
      
      // Backend'in doğru endpoint'ini kullanıyoruz
      const response = await fetch(`http://localhost:9090/v1/api/company/${companyId}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Hata Yanıtı:", errorText);
        throw new Error(errorText || 'Şirket detayları getirilemedi');
      }

      // Backend doğrudan Company nesnesini döndürüyor, BaseResponse formatında değil
      const data = await response.json();
      console.log("Şirket detayları yanıtı:", data);
      
      // Yanıt formatını kontrol et
      if (data) {
        return data; // Doğrudan Company nesnesini döndür
      } else {
        throw new Error("Geçersiz yanıt formatı");
      }
    } catch (error: any) {
      console.error("Şirket detayları getirme hatası:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Redux state
const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setCompanyDetails: (state, action) => {
      state.companyDetails = action.payload;
    },
    setDetailsLoading: (state, action) => {
      state.detailsLoading = action.payload;
    }
  },
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
      })
      
      // Şirket detayları
      .addCase(fetchCompanyDetailsAsync.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchCompanyDetailsAsync.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.companyDetails = action.payload;
      })
      .addCase(fetchCompanyDetailsAsync.rejected, (state, action) => {
        state.detailsLoading = false;
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

// Şirket onaylama işlemi için SweetAlert2 ile onay kutusu
export const approveCompanyWithConfirmation = (companyId: number) => async (dispatch: any) => {
  try {
    const result = await Swal.fire({
      title: 'Şirketi onaylamak istediğinize emin misiniz?',
      text: "Bu işlem şirketin aktif olmasını sağlayacaktır.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, Onayla',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      await dispatch(approveCompany(companyId));
      
      Swal.fire(
        'Onaylandı!',
        'Şirket başarıyla onaylandı.',
        'success'
      );
    }
  } catch (error) {
    console.error('Onaylama işlemi sırasında hata oluştu:', error);
  }
};

// Şirket reddetme işlemi için SweetAlert2 ile onay kutusu
export const rejectCompanyWithConfirmation = (companyId: number) => async (dispatch: any) => {
  try {
    const { value: rejectReason, isConfirmed } = await Swal.fire({
      title: 'Şirketi reddetmek istediğinize emin misiniz?',
      text: "Lütfen red sebebini belirtin:",
      input: 'textarea',
      inputPlaceholder: 'Red sebebi...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Evet, Reddet',
      cancelButtonText: 'İptal',
      inputValidator: (value) => {
        if (!value) {
          return 'Red sebebi belirtmelisiniz!';
        }
        return null;
      }
    });

    if (isConfirmed) {
      await dispatch(rejectCompany(companyId));
      
      Swal.fire(
        'Reddedildi!',
        'Şirket başarıyla reddedildi.',
        'success'
      );
    }
  } catch (error) {
    console.error('Reddetme işlemi sırasında hata oluştu:', error);
  }
};

export default companySlice.reducer;