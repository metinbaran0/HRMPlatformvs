export interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  employeeCount: number;
}

export interface EmployeeShift {
  id: number;
  shiftName: string;
  startTime: string;
  endTime: string;
  employeeCount: number; // Bunu ekledik
}
