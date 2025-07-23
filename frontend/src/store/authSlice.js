import { createSlice } from "@reduxjs/toolkit";

// Read from localStorage (if already logged in)
const token = localStorage.getItem("token");

let user = null;
const userFromStorage = localStorage.getItem("user");
try {
  if (userFromStorage !== "undefined") {
    user = JSON.parse(userFromStorage);
  }
} catch (error) {
  console.error("Failed to parse user from localStorage:", error);
  localStorage.removeItem("user"); // clean corrupted value
}


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: user || null,
    token: token || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
