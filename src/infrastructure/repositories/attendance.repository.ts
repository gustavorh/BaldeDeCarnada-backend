import { Injectable, Inject } from '@nestjs/common';
import { AttendanceRepositoryInterface } from '../../domain/repositories/attendance.repository.interface';
import { Attendance } from '../../domain/entities/attendance.entity';
import { attendance } from '../database/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class AttendanceRepository implements AttendanceRepositoryInterface {
  constructor(@Inject('DATABASE') private readonly db: any) {}

  async findAll(): Promise<Attendance[]> {
    const result = await this.db.select().from(attendance);

    return result.map((att) =>
      Attendance.create({
        id: att.id,
        employeeId: att.employeeId,
        checkInTime: att.checkInTime,
        checkOutTime: att.checkOutTime,
        date: att.date,
        createdAt: att.createdAt ?? new Date(),
        updatedAt: att.updatedAt ?? new Date(),
      }),
    );
  }

  async findById(id: number): Promise<Attendance | null> {
    const result = await this.db
      .select()
      .from(attendance)
      .where(eq(attendance.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const att = result[0];
    return Attendance.create({
      id: att.id,
      employeeId: att.employeeId,
      checkInTime: att.checkInTime,
      checkOutTime: att.checkOutTime,
      date: att.date,
      createdAt: att.createdAt ?? new Date(),
      updatedAt: att.updatedAt ?? new Date(),
    });
  }

  async findByEmployeeId(employeeId: number): Promise<Attendance[]> {
    const result = await this.db
      .select()
      .from(attendance)
      .where(eq(attendance.employeeId, employeeId));

    return result.map((att) =>
      Attendance.create({
        id: att.id,
        employeeId: att.employeeId,
        checkInTime: att.checkInTime,
        checkOutTime: att.checkOutTime,
        date: att.date,
        createdAt: att.createdAt ?? new Date(),
        updatedAt: att.updatedAt ?? new Date(),
      }),
    );
  }

  async findByDate(date: Date): Promise<Attendance[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await this.db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.date, startOfDay)
        )
      );

    return result.map((att) =>
      Attendance.create({
        id: att.id,
        employeeId: att.employeeId,
        checkInTime: att.checkInTime,
        checkOutTime: att.checkOutTime,
        date: att.date,
        createdAt: att.createdAt ?? new Date(),
        updatedAt: att.updatedAt ?? new Date(),
      }),
    );
  }

  async findByEmployeeIdAndDate(employeeId: number, date: Date): Promise<Attendance | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const result = await this.db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.employeeId, employeeId),
          eq(attendance.date, startOfDay)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const att = result[0];
    return Attendance.create({
      id: att.id,
      employeeId: att.employeeId,
      checkInTime: att.checkInTime,
      checkOutTime: att.checkOutTime,
      date: att.date,
      createdAt: att.createdAt ?? new Date(),
      updatedAt: att.updatedAt ?? new Date(),
    });
  }

  async create(attendanceData: {
    employeeId: number;
    checkInTime: Date;
    checkOutTime: Date | null;
    date: Date;
  }): Promise<Attendance> {
    const result = await this.db
      .insert(attendance)
      .values({
        employeeId: attendanceData.employeeId,
        checkInTime: attendanceData.checkInTime,
        checkOutTime: attendanceData.checkOutTime,
        date: attendanceData.date,
      });

    // Get the inserted record by finding the last inserted ID
    const insertId = result[0].insertId;
    const created = await this.findById(insertId);
    
    if (!created) {
      throw new Error('Failed to create attendance record');
    }

    return created;
  }

  async update(id: number, attendanceData: Partial<Attendance>): Promise<Attendance | null> {
    const updateData: any = {};
    
    if (attendanceData.checkInTime !== undefined) {
      updateData.checkInTime = attendanceData.checkInTime;
    }
    if (attendanceData.checkOutTime !== undefined) {
      updateData.checkOutTime = attendanceData.checkOutTime;
    }
    if (attendanceData.date !== undefined) {
      updateData.date = attendanceData.date;
    }

    await this.db
      .update(attendance)
      .set(updateData)
      .where(eq(attendance.id, id));

    // Return the updated record
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .delete(attendance)
      .where(eq(attendance.id, id));

    return result.affectedRows > 0;
  }

  async checkOut(id: number, checkOutTime: Date): Promise<Attendance | null> {
    await this.db
      .update(attendance)
      .set({ checkOutTime })
      .where(eq(attendance.id, id));

    // Return the updated record
    return await this.findById(id);
  }
}
