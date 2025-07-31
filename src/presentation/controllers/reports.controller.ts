import { Controller, Get, Query, ParseDatePipe, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GenerateSalesReportUseCase } from '../../application/use-cases/generate-sales-report.use-case';
import { GenerateAttendanceReportUseCase } from '../../application/use-cases/generate-attendance-report.use-case';
import { GenerateStockReportUseCase } from '../../application/use-cases/generate-stock-report.use-case';
import { SalesReportDto } from '../../domain/dtos/sales-report.dto';
import { AttendanceReportDto } from '../../domain/dtos/attendance-report.dto';
import { StockReportDto } from '../../domain/dtos/stock-report.dto';
import { ErrorResponseDto } from '../dtos/common.dto';

@ApiTags('reports')
@Controller('api/reports')
export class ReportsController {
  constructor(
    private readonly generateSalesReportUseCase: GenerateSalesReportUseCase,
    private readonly generateAttendanceReportUseCase: GenerateAttendanceReportUseCase,
    private readonly generateStockReportUseCase: GenerateStockReportUseCase,
  ) {}

  private parseDate(dateString: string): Date {
    // Handle different date formats
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      // Try parsing with ISO format YYYY-MM-DD
      const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (isoMatch) {
        const [, year, month, day] = isoMatch;
        const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      }
      throw new BadRequestException(`Invalid date format: ${dateString}. Please use YYYY-MM-DD format.`);
    }
    
    return date;
  }

  @Get('sales')
  @ApiOperation({ summary: 'Generate sales report for a date range' })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)', example: '2023-01-01' })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)', example: '2023-12-31' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sales report generated successfully',
    type: SalesReportDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid date format or missing parameters',
    type: ErrorResponseDto
  })
  async getSalesReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<SalesReportDto> {
    try {
      // Validate that both dates are provided
      if (!startDate || !endDate) {
        throw new BadRequestException('Both startDate and endDate are required');
      }

      // Parse dates with proper validation
      const start = this.parseDate(startDate);
      const end = this.parseDate(endDate);

      // Validate date range
      if (start > end) {
        throw new BadRequestException('startDate cannot be after endDate');
      }

      return await this.generateSalesReportUseCase.execute(start, end);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to generate sales report: ${error.message}`);
    }
  }

  @Get('attendance')
  async getAttendanceReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<AttendanceReportDto> {
    try {
      // Validate that both dates are provided
      if (!startDate || !endDate) {
        throw new BadRequestException('Both startDate and endDate are required');
      }

      // Parse dates with proper validation
      const start = this.parseDate(startDate);
      const end = this.parseDate(endDate);

      // Validate date range
      if (start > end) {
        throw new BadRequestException('startDate cannot be after endDate');
      }

      return await this.generateAttendanceReportUseCase.execute(start, end);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to generate attendance report: ${error.message}`);
    }
  }

  @Get('stock')
  async getStockReport(
    @Query('threshold') threshold?: string,
  ): Promise<StockReportDto> {
    try {
      const lowStockThreshold = threshold ? parseInt(threshold, 10) : 10;

      if (isNaN(lowStockThreshold) || lowStockThreshold < 0) {
        throw new BadRequestException('Threshold must be a non-negative number.');
      }

      return await this.generateStockReportUseCase.execute(lowStockThreshold);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to generate stock report: ${error.message}`);
    }
  }

  @Get('sales/summary')
  async getSalesSummary(
    @Query('days') days: string = '30',
  ): Promise<SalesReportDto> {
    try {
      const daysCount = parseInt(days, 10);
      
      if (isNaN(daysCount) || daysCount <= 0) {
        throw new BadRequestException('Days must be a positive number.');
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - daysCount);

      return await this.generateSalesReportUseCase.execute(startDate, endDate);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to generate sales summary: ${error.message}`);
    }
  }

  @Get('attendance/summary')
  async getAttendanceSummary(
    @Query('days') days: string = '30',
  ): Promise<AttendanceReportDto> {
    try {
      const daysCount = parseInt(days, 10);
      
      if (isNaN(daysCount) || daysCount <= 0) {
        throw new BadRequestException('Days must be a positive number.');
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - daysCount);

      return await this.generateAttendanceReportUseCase.execute(startDate, endDate);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to generate attendance summary: ${error.message}`);
    }
  }
}
