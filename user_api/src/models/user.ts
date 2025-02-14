export class User {
  private _id: number;
  private _email: string;
  private _username: string;
  private _password: string;

  public get id(): number {
    return this._id;
  }

  public get email(): string {
    return this._email;
  }
  public set email(value: string) {
    this._email = value;
  }

  public get username(): string {
    return this._username;
  }
  public set username(value: string) {
    this._username = value;
  }

  public get password(): string {
    return this._password;
  }
  public set password(value: string) {
    this._password = value;
  }

  constructor(
    id: number,
    email: string,
    username: string,
    password: string,
  ) {
    this._id = id;
    this._email = email;
    this._username = username;
    this._password = password;
  }
}
