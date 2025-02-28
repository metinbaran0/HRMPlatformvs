import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// API Logic within AssetSlice
const BASE_URL = "http://localhost:9090/v1/dev/asset";

/**
 * Yeni bir zimmet ekler.
 */
const createAsset = async (assetData: {
  employeeId: number;
  assetName: string;
  assetType: string;
  serialNumber: string;
  assignedDate: string;
  returnDate?: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assetData),
    });

    if (!response.ok) {
      throw new Error("Zimmet eklenirken hata oluştu.");
    }

    return await response.json();
  } catch (error) {
    console.error("createAsset Error:", error);
    throw error;
  }
};

/**
 * Tüm zimmetleri getirir.
 */
const fetchAssets = async () => {
  try {
    const response = await fetch(`${BASE_URL}/all`);
    if (!response.ok) {
      throw new Error("Zimmetler alınırken hata oluştu.");
    }

    return await response.json();
  } catch (error) {
    console.error("fetchAssets Error:", error);
    return [];
  }
};

/**
 * Belirli bir zimmeti günceller.
 */
const updateAsset = async (assetId: string, updatedAssetData: Partial<{ assetName: string; assetType: string; returnDate: string }>) => {
  try {
    const response = await fetch(`${BASE_URL}/update/${assetId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAssetData),
    });

    if (!response.ok) {
      throw new Error("Zimmet güncellenirken hata oluştu.");
    }

    return await response.json();
  } catch (error) {
    console.error("updateAsset Error:", error);
    throw error;
  }
};

/**
 * Bir zimmeti siler.
 */
const deleteAsset = async (assetId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/delete/${assetId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Zimmet silinirken hata oluştu.");
    }

    return { success: true, id: assetId };
  } catch (error) {
    console.error("deleteAsset Error:", error);
    throw error;
  }
};

interface Asset {
  id: string;
  employeeId: number;
  assetName: string;
  assetType: string;
  serialNumber: string;
  assignedDate: string;
  returnDate?: string;
}

interface AssetState {
  assets: Asset[];
  loading: boolean;
  error: string | null;
}

const initialState: AssetState = {
  assets: [],
  loading: false,
  error: null,
};

// Redux Thunks

// Yeni zimmet ekleme
export const addAssetAsync = createAsyncThunk(
  "assets/addAsset",
  async (assetData: Omit<Asset, "id">, { rejectWithValue }) => {
    try {
      return await createAsset(assetData);
    } catch (error) {
      return rejectWithValue("Zimmet eklenemedi.");
    }
  }
);

// Tüm zimmetleri çekme
export const fetchAssetsAsync = createAsyncThunk("assets/fetchAssets", async (_, { rejectWithValue }) => {
  try {
    return await fetchAssets();
  } catch (error) {
    return rejectWithValue("Zimmetler getirilemedi.");
  }
});

// Zimmet güncelleme
export const updateAssetAsync = createAsyncThunk(
  "assets/updateAsset",
  async ({ id, updatedAssetData }: { id: string; updatedAssetData: Partial<Asset> }, { rejectWithValue }) => {
    try {
      return await updateAsset(id, updatedAssetData);
    } catch (error) {
      return rejectWithValue("Zimmet güncellenemedi.");
    }
  }
);

// Zimmet silme
export const deleteAssetAsync = createAsyncThunk("assets/deleteAsset", async (id: string, { rejectWithValue }) => {
  try {
    return await deleteAsset(id);
  } catch (error) {
    return rejectWithValue("Zimmet silinemedi.");
  }
});

// Asset slice

const assetSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    setAssets(state, action: PayloadAction<Asset[]>) {
      state.assets = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssetsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssetsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.assets = action.payload;
      })
      .addCase(fetchAssetsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addAssetAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAssetAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.assets.push(action.payload);
      })
      .addCase(addAssetAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateAssetAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAssetAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assets.findIndex((asset) => asset.id === action.payload.id);
        if (index !== -1) {
          state.assets[index] = action.payload;
        }
      })
      .addCase(updateAssetAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteAssetAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAssetAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.assets = state.assets.filter((asset) => asset.id !== action.payload.id);
      })
      .addCase(deleteAssetAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAssets } = assetSlice.actions;  // setAssets dışa aktarılıyor

export default assetSlice.reducer;
