export class Event {
  private _id: number;
  private _userId: number;
  private _name: string;
  private _description: string;
  private _startDate: Date;
  private _lengthMin: number;

  public get id(): number {
    return this._id;
  }

  public get userId(): number {
    return this._userId
  }

  public get name(): string {
    return this._name
  }
  public set name(value: string) {
    this._name = value;
  }

  public get description(): string {
    return this._description
  }
  public set description(value: string) {
    this._description = value;
  }

  public get startDate(): Date {
    return this._startDate;
  }
  public set startDate(value: Date) {
    this._startDate = value;
  }

  public get lengthMin(): number {
    return this._lengthMin;
  }
  public set lengthMin(value: number) {
    this._lengthMin = value;
  }


  constructor(
    id: number,
    _userId: number,
    _name: string,
    _description: string,
    _startDate: Date,
    _lengthMin: number,
  ) {
    this._id = id;
    this._userId = _userId;
    this._name = _name;
    this._description = _description;
    this._startDate = _startDate;
    this._lengthMin = _lengthMin;
  }
}
