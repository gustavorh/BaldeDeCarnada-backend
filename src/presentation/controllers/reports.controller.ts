import { Controller, Get, Query, ParseDatePipe, ParseIntPipe } from '@nestjs/common';
import { GenerateSalesReportUseCase } from '../../application/use-cases/generate-sales-report.use-case';
import { GenerateAttendanceReportUseCase } from '../../application/use-cases/generate-attendance-report.use-case';
import { GenerateStockReportUseCase } from '../../application/use-cases/generate-stock-report.use-case';
import { SalesReportDto } from '../../domain/dtos/sales-report.dto';
import { AttendanceReportDto } from '../../domain/dtos/attendance-report.dto';
import { StockReportDto } from '../../domain/dtos/stock-report.dto';

@Controller('api/reports')
export class ReportsController {
  constructor(
    private readonly generateSalesReportUseCase: GenerateSalesReportUseCase,
    private readonly generateAttendanceReportUseCase: GenerateAttendanceReportUseCase,
    private readonly generateStockReportUseCase: GenerateStockReportUseCase,
  ) {}

  @Get('sales')
  async getSalesReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<SalesReportDto> {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format. Please use YYYY-MM-DD format.');
      }

      return await this.generateSalesReportUseCase.execute(start, end);
    } catch (error) {
      throw new Error(`Failed to generate sales report: ${error.message}`);
    }
  }

  @Get('attendance')
  async getAttendanceReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<AttendanceReportDto> {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format. Please use YYYY-MM-DD format.');
      }

      return await this.generateAttendanceReportUseCase.execute(start, end);
    } catch (error) {
      throw new Error(`Failed to generate attendance report: ${error.message}`);
    }
  }

  @Get('stock')
  async getStockReport(
    @Query('threshold') threshold?: string,
  ): Promise<StockReportDto> {
    try {
      const lowStockThreshold = threshold ? parseInt(threshold, 10) : 10;

      if (isNaN(lowStockThreshold) || lowStockThreshold < 0) {
        throw new Error('Threshold must be a non-negative number.');
      }

      return await this.generateStockReportUseCase.execute(lowStockThreshold);
    } catch (error) {
      throw new Error(`Failed to generate stock report: ${error.message}`);
    }
  }

  @Get('sales/summary')
  async getSalesSummary(
    @Query('days') days: string = '30',
  ): Promise<SalesReportDto> {
    try {
      const daysCount = parseInt(days, 10);
      
      if (isNaN(daysCount) || daysCount <= 0) {
        throw new Error('Days must be a positive number.');
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - daysCount);

      return await this.generateSalesReportUseCase.execute(startDate, endDate);
    } catch (error) {
      throw new Error(`Failed to generate sales summary: ${error.message}`);
    }
  }

  @Get('attendance/summary')
  async getAttendanceSummary(
    @Query('days') days: string = '30',
  ): Promise<AttendanceReportDto> {
    try {
      const daysCount = parseInt(days, 10);
      
      if (isNaN(daysCount) || daysCount <= 0) {
        throw new Error('Days must be a positive number.');
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - daysCount);

      return await this.generateAttendanceReportUseCase.execute(startDate, endDate);
    } catch (error) {
      throw new Error(`Failed to generate attendance summary: ${error.message}`);
    }
  }
}
