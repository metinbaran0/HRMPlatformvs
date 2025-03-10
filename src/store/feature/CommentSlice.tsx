import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { RootState } from "..";

// Yorumlar tipi
interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

// Yorum durumunu temsil eden arayüz
interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

// Yorumları getiren async thunk
export const fetchComments = createAsyncThunk<
  Comment[], // Döndürülen veri tipi
  { page?: number; size?: number }, // Parametreler
  { rejectValue: string } // Hata mesajı tipi
>(
  "comment/fetchComments",
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:9090/v1/api/comment/getall-comment?page=${page}&size=${size}`,
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      // API'nin başarılı olup olmadığını kontrol edelim
      if (!response.ok) {
        console.error(`API Hatası: ${response.status} ${response.statusText}`);
        return rejectWithValue(`API Hatası: ${response.statusText}`);
      }

      const textData = await response.text();
      console.log("API Yanıtı:", textData); // Ham yanıtı kontrol et

      if (!textData) {
        return rejectWithValue("Boş yanıt alındı.");
      }

      const data = JSON.parse(textData); // JSON'a dönüştür

      if (data.success) {
        return data.data; // Yorum verisini döndürüyoruz
      } else {
        console.error(`API Error: ${data.message}`);
        return rejectWithValue(data.message); // API'den gelen hata mesajını döndürüyoruz
      }
    } catch (error) {
      console.error("API Hatası:", error); // Detaylı hata loglama
      return rejectWithValue("Yorumlar yüklenirken bir hata oluştu");
    }
  }
);

// Redux state
const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default commentSlice.reducer;
