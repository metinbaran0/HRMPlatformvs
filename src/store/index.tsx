import { configureStore } from "@reduxjs/toolkit";
import userReducer from './feature/userSlice'
import employeeReducer from './feature/EmployeeSlice';
import leaveReducer from './feature/LeaveSlice';
<<<<<<< HEAD
import employeeReducer from './feature/employeeSlice';
=======
import shiftReducer from './feature/ShiftSlice';
import assetReducer from './feature/AssetSlice';
import expenseReducer from './feature/ExpenseSlice';
>>>>>>> main

export const store = configureStore({
  reducer: {
    user: userReducer,
    employee: employeeReducer,
    leave: leaveReducer,
<<<<<<< HEAD
    employee: employeeReducer,
=======
    shift: shiftReducer,
    asset: assetReducer,
    expense: expenseReducer,
>>>>>>> main
  },
});
 
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;