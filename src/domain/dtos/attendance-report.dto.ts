export interface AttendanceReportData {
  employeeId: number;
  totalDaysWorked: number;
  totalHoursWorked: number;
  averageHoursPerDay: number;
  attendanceRecords: {
    date: Date;
    checkInTime: Date;
    checkOutTime: Date | null;
    hoursWorked: number | null;
  }[];
}

export interface AttendanceSummaryData {
  reportPeriod: {
    startDate: Date;
    endDate: Date;
  };
  totalEmployees: number;
  averageHoursPerEmployee: number;
  totalHoursAllEmployees: number;
  employeeReports: AttendanceReportData[];
}

export class AttendanceReportDto {
  constructor(
    public readonly data: AttendanceSummaryData,
    public readonly generatedAt: Date,
  ) {}

  static create(data: AttendanceSummaryData): AttendanceReportDto {
    return new AttendanceReportDto(data, new Date());
  }

  toJSON() {
    return {
      data: this.data,
      generatedAt: this.generatedAt,
    };
  }
}
