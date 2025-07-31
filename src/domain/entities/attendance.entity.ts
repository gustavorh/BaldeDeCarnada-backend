export class Attendance {
  constructor(
    public id: number,
    public employeeId: number,
    public checkInTime: Date,
    public checkOutTime: Date | null,
    public date: Date,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
