import { configureStore } from "@reduxjs/toolkit";
import userReducer from './feature/userSlice'
import employeeReducer from './feature/employeeSlice';
import leaveReducer from './feature/LeaveSlice';
import shiftReducer from './feature/ShiftSlice';
import assetReducer from './feature/AssetSlice';
import expenseReducer from './feature/ExpenseSlice';
import companyReducer from "./feature/companySlice";
import commentReducer from "./feature/CommentSlice";
import dashboardReducer from "./feature/DashboardSlice";
import breakReducer from './feature/breakSlice';
import employeeShiftReducer from './feature/employeeShiftSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    employee: employeeReducer,
    leave: leaveReducer,
    shift: shiftReducer,
    asset: assetReducer,
    expense: expenseReducer,
    companies: companyReducer,
    comment: commentReducer,
    dashboard: dashboardReducer,
    break: breakReducer,
    employeeShift: employeeShiftReducer,
  },
});
 
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;