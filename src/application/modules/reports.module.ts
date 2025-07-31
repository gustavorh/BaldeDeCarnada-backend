import { Module } from '@nestjs/common';
import { ReportsController } from '../../presentation/controllers/reports.controller';
import { GenerateSalesReportUseCase } from '../use-cases/generate-sales-report.use-case';
import { GenerateAttendanceReportUseCase } from '../use-cases/generate-attendance-report.use-case';
import { GenerateStockReportUseCase } from '../use-cases/generate-stock-report.use-case';
import { OrderModule } from './order.module';
import { ProductModule } from './product.module';
import { AttendanceModule } from './attendance.module';
import { StockModule } from './stock.module';

@Module({
  imports: [OrderModule, ProductModule, AttendanceModule, StockModule],
  controllers: [ReportsController],
  providers: [
    GenerateSalesReportUseCase,
    GenerateAttendanceReportUseCase,
    GenerateStockReportUseCase,
  ],
  exports: [
    GenerateSalesReportUseCase,
    GenerateAttendanceReportUseCase,
    GenerateStockReportUseCase,
  ],
})
export class ReportsModule {}
