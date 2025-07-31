import { Attendance } from '../entities/attendance.entity';

export interface AttendanceRepositoryInterface {
  findAll(): Promise<Attendance[]>;
  findById(id: number): Promise<Attendance | null>;
  findByEmployeeId(employeeId: number): Promise<Attendance[]>;
  findByDate(date: Date): Promise<Attendance[]>;
  findByEmployeeIdAndDate(employeeId: number, date: Date): Promise<Attendance | null>;
  create(attendance: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>): Promise<Attendance>;
  update(id: number, attendance: Partial<Attendance>): Promise<Attendance | null>;
  delete(id: number): Promise<boolean>;
  checkOut(id: number, checkOutTime: Date): Promise<Attendance | null>;
}
