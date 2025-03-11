export class User {
  private _id: number;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
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

  public get firstName(): string {
    return this._firstName;
  }
  public set firstName(value: string) {
    this._firstName = value;
  }

  public get lastName(): string {
    return this._lastName;
  }
  public set lastName(value: string) {
    this._lastName = value;
  }

  public get password(): string {
    return this._password;
  }
  public set password(value: string) {
    this._password = value;
  }

  constructor(
    _id: number,
    _firstName: string,
    _lastName: string,
    _email: string,
    _password: string,
  ) {
    this._id = _id;
    this._firstName = _firstName;
    this._lastName = _lastName;
    this._email = _email;
    this._password = _password;
  }
}
