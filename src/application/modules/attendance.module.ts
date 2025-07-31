import { Module } from '@nestjs/common';
import { AttendanceRepository } from 'src/infrastructure/repositories/attendance.repository';
import { AttendanceController } from 'src/presentation/controllers/attendance.controller';
import { RegisterAttendanceUseCase } from '../use-cases/register-attendance.use-case';
import { AttendanceService } from '../services/attendance.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [AttendanceController],
  providers: [
    RegisterAttendanceUseCase,
    AttendanceService,
    AttendanceRepository,
    {
      provide: 'AttendanceRepositoryInterface',
      useClass: AttendanceRepository,
    },
    {
      provide: 'AttendanceService',
      useClass: AttendanceService,
    },
  ],
  exports: [RegisterAttendanceUseCase, AttendanceService, AttendanceRepository, 'AttendanceRepositoryInterface'],
})
export class AttendanceModule {}
