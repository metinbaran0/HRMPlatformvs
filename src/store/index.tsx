import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./feature/userSlice";
import leaveReducer from './feature/LeaveSlice';
import employeeReducer from './feature/employeeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    leave: leaveReducer,
    employee: employeeReducer,
  },
});
 
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;