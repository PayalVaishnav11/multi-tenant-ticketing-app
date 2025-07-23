import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

// Fetch all tickets (admin only)
export const fetchAllTickets = createAsyncThunk(
  "admin/fetchAllTickets",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/tickets/get-all-tickets");
      return response.data.data; // assuming { data: [tickets] }
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to fetch tickets");
    }
  }
);

// Delete ticket by ID
export const deleteTicketById = createAsyncThunk(
  "admin/deleteTicketById",
  async (ticketId, thunkAPI) => {
    try {
      await axiosInstance.delete(`/tickets/delete-ticket/${ticketId}`);
     
      return ticketId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to delete ticket");
    }
  }
);

export const updateTicketStatus = createAsyncThunk("admin/updateTicketStatus", async ({ ticketId, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/tickets/${ticketId}/status`,{status});
      if(!res){
        console.log("Unable to get res in updateTicketStatus.")
      }
      return res.data.data; // Updated ticket
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update ticket");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    tickets: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchAllTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteTicketById.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter((t) => t._id !== action.payload);
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.tickets.findIndex((t) => t._id === updated._id);
        if (index !== -1) state.tickets[index] = updated;
      })
  },
});

export default adminSlice.reducer;
