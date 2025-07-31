export class Attendance {
  constructor(
    public readonly id: number,
    public readonly employeeId: number,
    public readonly checkInTime: Date,
    public readonly checkOutTime: Date | null,
    public readonly date: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: {
    id: number;
    employeeId: number;
    checkInTime: Date;
    checkOutTime: Date | null;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
  }): Attendance {
    return new Attendance(
      props.id,
      props.employeeId,
      props.checkInTime,
      props.checkOutTime,
      props.date,
      props.createdAt,
      props.updatedAt,
    );
  }

  toJSON() {
    return {
      id: this.id,
      employeeId: this.employeeId,
      checkInTime: this.checkInTime,
      checkOutTime: this.checkOutTime,
      date: this.date,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
