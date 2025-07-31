import { Inject, Injectable } from '@nestjs/common';
import { IAttendanceService } from '../../domain/services/attendance.service.interface';
import { Attendance } from '../../domain/entities/attendance.entity';
import { AttendanceRepositoryInterface } from '../../domain/repositories/attendance.repository.interface';

@Injectable()
export class AttendanceService implements IAttendanceService {
  constructor(
    @Inject('AttendanceRepositoryInterface')
    private readonly attendanceRepository: AttendanceRepositoryInterface,
  ) {}

  async getAllAttendance(): Promise<Attendance[]> {
    return await this.attendanceRepository.findAll();
  }

  async getAttendanceById(id: number): Promise<Attendance | null> {
    return await this.attendanceRepository.findById(id);
  }

  async getAttendanceByEmployeeId(employeeId: number): Promise<Attendance[]> {
    return await this.attendanceRepository.findByEmployeeId(employeeId);
  }

  async getAttendanceByDate(date: Date): Promise<Attendance[]> {
    return await this.attendanceRepository.findByDate(date);
  }

  async getTodayAttendanceByEmployee(employeeId: number): Promise<Attendance | null> {
    const today = new Date();
    return await this.attendanceRepository.findByEmployeeIdAndDate(employeeId, today);
  }

  async checkIn(employeeId: number, checkInTime: Date): Promise<Attendance> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if employee already checked in today
    const existingAttendance = await this.attendanceRepository.findByEmployeeIdAndDate(employeeId, today);
    if (existingAttendance) {
      throw new Error('Employee has already checked in today');
    }

    const attendanceData = {
      employeeId,
      checkInTime,
      checkOutTime: null,
      date: today,
    };

    return await this.attendanceRepository.create(attendanceData);
  }

  async checkOut(id: number, checkOutTime: Date): Promise<Attendance | null> {
    const existingAttendance = await this.attendanceRepository.findById(id);
    if (!existingAttendance) {
      throw new Error('Attendance record not found');
    }

    if (existingAttendance.checkOutTime) {
      throw new Error('Employee has already checked out');
    }

    return await this.attendanceRepository.checkOut(id, checkOutTime);
  }

  async createAttendance(attendance: Attendance): Promise<Attendance> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if employee already has attendance for this date
    const existingAttendance = await this.attendanceRepository.findByEmployeeIdAndDate(
      attendance.employeeId,
      attendance.date,
    );

    if (existingAttendance) {
      throw new Error('Attendance record already exists for this employee on this date');
    }

    const attendanceData = {
      employeeId: attendance.employeeId,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      date: attendance.date,
    };

    return await this.attendanceRepository.create(attendanceData);
  }

  async updateAttendance(id: number, attendance: Partial<Attendance>): Promise<Attendance | null> {
    const existingAttendance = await this.attendanceRepository.findById(id);
    if (!existingAttendance) {
      throw new Error('Attendance record not found');
    }

    return await this.attendanceRepository.update(id, attendance);
  }

  async deleteAttendance(id: number): Promise<boolean> {
    const existingAttendance = await this.attendanceRepository.findById(id);
    if (!existingAttendance) {
      throw new Error('Attendance record not found');
    }

    return await this.attendanceRepository.delete(id);
  }
}
