// src/store/myTicketsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance.js";

export const fetchMyTickets = createAsyncThunk(
  "tickets/fetchMyTickets",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/tickets/my-tickets");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch your tickets");
    }
  }
);

const myTicketsSlice = createSlice({
  name: "myTickets",
  initialState: {
    myTickets: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.myTickets = action.payload;
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default myTicketsSlice.reducer;
