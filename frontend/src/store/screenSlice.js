import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";


export const fetchScreens = createAsyncThunk("screen/fetchScreens", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/me/screens");
    return response.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to load screens");
  }
});

const screenSlice = createSlice({
  name: "screen",
  initialState: {
    screens: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScreens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScreens.fulfilled, (state, action) => {
        state.screens = action.payload;
        state.loading = false;
      })
      .addCase(fetchScreens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default screenSlice.reducer;
