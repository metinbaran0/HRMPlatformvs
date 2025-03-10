export interface EmployeeShift {
  id: number;
  employeeId: number;
  employeeName: string;
  shiftId: number;
  shiftName: string;
  date: string;
}

export interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  employeeCount: number;
}

export interface ShiftListItem {
  id: number;
  shiftName: string;
  startTime: string;
  endTime: string;
  employeeCount: number;
}

export interface ShiftAssignment {
  employeeId: number;
  shiftId: number;
  date: string;
} 