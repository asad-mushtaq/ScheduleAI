export class Event {
  private _id: number;
  private _userId: number;
  private _name: string;
  private _description: string;
  private _startDate: Date;
  private _length: number;
  private _completed: boolean;

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

  public get length(): number {
    return this._length;
  }
  public set length(value: number) {
    this._length = value;
  }

  public get completed(): boolean {
    return this._completed
  }
  public set completed(value: boolean) {
    this._completed = value;
  }

  toJSON() {
    const proto = Object.getPrototypeOf(this);
    const jsonObj: any = {};
    Object.entries(this).forEach(([key, value]) => {
      if (key[0] !== '_') {
        jsonObj[key] = value;
      }
    });
    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function' && key[0] !== '_')
      .forEach(([key, descriptor]) => {
        try {
          const val = (this as any)[key];
          jsonObj[key] = val;
        } catch (error) {
          console.error(`Error calling getter ${key}`, error);
        }
      });
  
    return jsonObj;
  }

  constructor(
    id: number,
    _userId: number,
    _name: string,
    _description: string,
    _startDate: Date,
    _length: number,
    _completed: boolean
  ) {
    this._id = id;
    this._userId = _userId;
    this._name = _name;
    this._description = _description;
    this._startDate = _startDate;
    this._length = _length;
    this._completed = _completed;
  }
}
