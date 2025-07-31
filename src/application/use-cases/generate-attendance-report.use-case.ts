import { Inject, Injectable } from '@nestjs/common';
import { AttendanceReportDto, AttendanceSummaryData, AttendanceReportData } from '../../domain/dtos/attendance-report.dto';
import { AttendanceRepositoryInterface } from '../../domain/repositories/attendance.repository.interface';
import { Attendance } from '../../domain/entities/attendance.entity';

@Injectable()
export class GenerateAttendanceReportUseCase {
  constructor(
    @Inject('AttendanceRepositoryInterface')
    private readonly attendanceRepository: AttendanceRepositoryInterface,
  ) {}

  async execute(startDate: Date, endDate: Date): Promise<AttendanceReportDto> {
    if (startDate > endDate) {
      throw new Error('Start date cannot be after end date');
    }

    // Get all attendance records within the date range
    const allAttendances = await this.attendanceRepository.findAll();
    const filteredAttendances = allAttendances.filter(attendance => 
      attendance.date >= startDate && attendance.date <= endDate
    );

    // Group by employee
    const employeeAttendanceMap = new Map<number, Attendance[]>();
    
    for (const attendance of filteredAttendances) {
      if (!employeeAttendanceMap.has(attendance.employeeId)) {
        employeeAttendanceMap.set(attendance.employeeId, []);
      }
      employeeAttendanceMap.get(attendance.employeeId)!.push(attendance);
    }

    // Calculate metrics for each employee
    const employeeReports: AttendanceReportData[] = [];
    let totalHoursAllEmployees = 0;

    for (const [employeeId, attendances] of employeeAttendanceMap) {
      const attendanceRecords = attendances.map(attendance => {
        const hoursWorked = this.calculateHoursWorked(attendance.checkInTime, attendance.checkOutTime);
        return {
          date: attendance.date,
          checkInTime: attendance.checkInTime,
          checkOutTime: attendance.checkOutTime,
          hoursWorked,
        };
      });

      const totalHoursWorked = attendanceRecords
        .filter(record => record.hoursWorked !== null)
        .reduce((sum, record) => sum + (record.hoursWorked || 0), 0);

      const totalDaysWorked = attendances.length;
      const averageHoursPerDay = totalDaysWorked > 0 ? totalHoursWorked / totalDaysWorked : 0;

      totalHoursAllEmployees += totalHoursWorked;

      employeeReports.push({
        employeeId,
        totalDaysWorked,
        totalHoursWorked,
        averageHoursPerDay,
        attendanceRecords,
      });
    }

    // Calculate overall metrics
    const totalEmployees = employeeAttendanceMap.size;
    const averageHoursPerEmployee = totalEmployees > 0 ? totalHoursAllEmployees / totalEmployees : 0;

    const summaryData: AttendanceSummaryData = {
      reportPeriod: {
        startDate,
        endDate,
      },
      totalEmployees,
      averageHoursPerEmployee,
      totalHoursAllEmployees,
      employeeReports: employeeReports.sort((a, b) => b.totalHoursWorked - a.totalHoursWorked),
    };

    return AttendanceReportDto.create(summaryData);
  }

  private calculateHoursWorked(checkIn: Date, checkOut: Date | null): number | null {
    if (!checkOut) {
      return null;
    }

    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.round((timeDiff / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimal places
  }
}
