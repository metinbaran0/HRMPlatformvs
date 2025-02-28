import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// ExpenseApi.tsx
const BASE_URL = "http://localhost:9090/v1/dev/expense";  // API base URL

// Yeni harcama ekler
export const createExpense = async (expenseData: {
  description: string;
  amount: number;
  date: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    });

    if (!response.ok) {
      throw new Error("Harcama eklenirken hata oluştu.");
    }

    return await response.json();
  } catch (error) {
    console.error("createExpense Error:", error);
    throw error;
  }
};

// Tüm harcamaları getirir
export const fetchExpenses = async () => {
  try {
    const response = await fetch(`${BASE_URL}/all`);
    if (!response.ok) {
      throw new Error("Harcamalar alınırken hata oluştu.");
    }

    return await response.json();
  } catch (error) {
    console.error("fetchExpenses Error:", error);
    return [];
  }
};

// Harcama siler
export const deleteExpense = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/delete/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Harcama silinirken hata oluştu.");
    }

    return { success: true, id };
  } catch (error) {
    console.error("deleteExpense Error:", error);
    throw error;
  }
};

// Redux State için Expense tipi
interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

interface ExpenseState {
  expenses: Expense[];  // Harcama listesini tutar
  loading: boolean;  // Verilerin yüklenme durumu
  error: string | null;  // Hata mesajı
}

// Başlangıç durumu
const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  error: null,
};

// Yeni harcama ekleme asenkron işlem
export const addExpenseAsync = createAsyncThunk(
  "expenses/addExpense",
  async (expenseData: Omit<Expense, "id">, { rejectWithValue }) => {
    try {
      return await createExpense(expenseData);  // API'ye harcama ekler
    } catch (error) {
      return rejectWithValue("Harcama eklenemedi.");  // Hata durumunda mesaj döner
    }
  }
);

// Tüm harcamaları çekme asenkron işlem
export const fetchExpensesAsync = createAsyncThunk(
  "expenses/fetchExpenses",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchExpenses();  // API'den tüm harcamaları çeker
    } catch (error) {
      return rejectWithValue("Harcamalar getirilemedi.");  // Hata durumunda mesaj döner
    }
  }
);

// Harcama silme asenkron işlem
export const deleteExpenseAsync = createAsyncThunk(
  "expenses/deleteExpense",
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteExpense(id);  // API'den harcamayı siler
    } catch (error) {
      return rejectWithValue("Harcama silinemedi.");  // Hata durumunda mesaj döner
    }
  }
);

// Redux Slice
const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    // Harcamaları set etme
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Tüm harcamaları çekme işlemi
      .addCase(fetchExpensesAsync.pending, (state) => {
        state.loading = true;  // Yükleme başladığında loading true yapılır
        state.error = null;  // Hata null yapılır
      })
      .addCase(fetchExpensesAsync.fulfilled, (state, action: PayloadAction<Expense[]>) => {
        state.loading = false;  // Yükleme tamamlanır
        state.expenses = action.payload;  // Çekilen harcamalar listeye eklenir
      })
      .addCase(fetchExpensesAsync.rejected, (state, action) => {
        state.loading = false;  // Yükleme tamamlanmaz, hata durumu işlenir
        state.error = action.payload as string;  // Hata mesajı eklenir
      })

      // Yeni harcama ekleme işlemi
      .addCase(addExpenseAsync.pending, (state) => {
        state.loading = true;  // Yükleme başladığında loading true yapılır
      })
      .addCase(addExpenseAsync.fulfilled, (state, action: PayloadAction<Expense>) => {
        state.loading = false;  // Yükleme tamamlanır
        state.expenses.push(action.payload);  // Yeni harcama listeye eklenir
      })
      .addCase(addExpenseAsync.rejected, (state, action) => {
        state.loading = false;  // Yükleme tamamlanmaz, hata durumu işlenir
        state.error = action.payload as string;  // Hata mesajı eklenir
      })

      // Harcama silme işlemi
      .addCase(deleteExpenseAsync.pending, (state) => {
        state.loading = true;  // Yükleme başladığında loading true yapılır
      })
      .addCase(deleteExpenseAsync.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.loading = false;  // Yükleme tamamlanır
        state.expenses = state.expenses.filter((expense) => expense.id !== action.payload.id);  // Silinen harcama listeden çıkarılır
      })
      .addCase(deleteExpenseAsync.rejected, (state, action) => {
        state.loading = false;  // Yükleme tamamlanmaz, hata durumu işlenir
        state.error = action.payload as string;  // Hata mesajı eklenir
      });
  },
});

export const { setExpenses } = expenseSlice.actions;

export default expenseSlice.reducer;
