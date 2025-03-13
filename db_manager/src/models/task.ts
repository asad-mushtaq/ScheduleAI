export class Task {
  private _id: number;
  private _name: string;
  private _description: string;
  private _completed: boolean;
  private _eventId: number;


  public get id(): number {
    return this._id;
  }

  public get name(): string {
    return this._name;
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


  public get completed(): boolean {
    return this._completed;
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
    _name: string,
    _description: string,
    _completed: boolean,
    _eventId: number,
  ) {
    this._id = id;
    this._name = _name;
    this._description = _description;
    this._completed = _completed;
    this._eventId = _eventId;
  }
}
