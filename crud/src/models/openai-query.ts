export class OpenaiQuery {
    private _id: number;
    private _userId: number;
    private _date: Date;
    private _query: string;
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
  
    public get query(): string {
      return this._query;
    }
  
    public get response(): string {
      return this._response;
    }
  
    constructor(
      id: number,
      _userId: number,
      _date: Date,
      _query: string,
      _response: string,
    ) {
      this._id = id;
      this._userId = _userId;
      this._date = _date;
      this._query = _query;
      this._response = _response;
    }
  }
  