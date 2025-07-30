export class User {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly name: string,
    public readonly password: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: {
    id: number;
    email: string;
    name: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      props.id,
      props.email,
      props.name,
      props.password,
      props.isActive,
      props.createdAt,
      props.updatedAt,
    );
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
