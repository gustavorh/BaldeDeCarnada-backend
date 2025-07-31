import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import databaseConfig from './infrastructure/config/database.config';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './application/modules/user.module';
import { AuthModule } from './application/modules/auth.module';
import { AttendanceModule } from './application/modules/attendance.module';
import { ProductModule } from './application/modules/product.module';
import { StockModule } from './application/modules/stock.module';
import { OrderModule } from './application/modules/order.module';
import { ReportsModule } from './application/modules/reports.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    AttendanceModule,
    ProductModule,
    StockModule,
    OrderModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
