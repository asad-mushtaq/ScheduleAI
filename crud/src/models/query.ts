export class Query {
    private _id: number;
    private _userId: number;
    private _date: Date;
    private _prompt: string;
    private _response: string;
  
    public get id(): number {
      return this._id;
    }

    public get userId(): number {
        return this._userId;
    }

    public get date(): Date {
        return this._date;
    }
  
    public get prompt(): string {
      return this._prompt;
    }
  
    public get response(): string {
      return this._response;
    }
  
    constructor(
      id: number,
      _userId: number,
      _date: Date,
      _prompt: string,
      _response: string,
    ) {
      this._id = id;
      this._userId = _userId;
      this._date = _date;
      this._prompt = _prompt;
      this._response = _response;
    }
  }
  
