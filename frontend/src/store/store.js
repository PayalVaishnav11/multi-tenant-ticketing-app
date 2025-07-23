import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import screenReducer from "./screenSlice.js";
import myTicketsReducer from './myTicketsSlice.js'
import adminReducer from "./adminSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    screen:screenReducer,
    myTickets:myTicketsReducer,
    admin:adminReducer

  },
});

export default store;
