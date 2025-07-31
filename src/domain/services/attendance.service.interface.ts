import { Attendance } from '../entities/attendance.entity';

export interface IAttendanceService {
  getAllAttendance(): Promise<Attendance[]>;
  getAttendanceById(id: number): Promise<Attendance | null>;
  getAttendanceByEmployeeId(employeeId: number): Promise<Attendance[]>;
  getAttendanceByDate(date: Date): Promise<Attendance[]>;
  getTodayAttendanceByEmployee(employeeId: number): Promise<Attendance | null>;
  checkIn(employeeId: number, checkInTime: Date): Promise<Attendance>;
  checkOut(id: number, checkOutTime: Date): Promise<Attendance | null>;
  createAttendance(attendance: Attendance): Promise<Attendance>;
  updateAttendance(id: number, attendance: Partial<Attendance>): Promise<Attendance | null>;
  deleteAttendance(id: number): Promise<boolean>;
}
