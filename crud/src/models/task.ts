export class Task {
  private _id: number;
  private _eventId: number;
  private _name: string;
  private _completed: boolean;


  public get id(): number {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  public get completed(): boolean {
    return this._completed;
  }
  public set completed(value: boolean) {
    this._completed = value;
  }

  constructor(
    id: number,
    _eventId: number,
    _name: string,
    _completed: boolean,
  ) {
    this._id = id;
    this._eventId = _eventId;
    this._name = _name;
    this._completed = _completed;
  }
}
