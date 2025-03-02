export class SubTier {
    private _id: number;
    private _name: string;
    private _priceUsd: number;
  
    public get id(): number {
      return this._id;
    }
  
  
    public get name(): string {
      return this._name;
    }
  
    public set name(value: string) {
      this._name = value;
    }
  
    public get priceUsd(): number {
      return this._priceUsd;
    }
    public set priceUsd(value: number) {
      this._priceUsd = value;
    }
  
    constructor(
      id: number,
      _name: string,
      _priceUsd: number,
    ) {
      this._id = id;
      this._name = _name;
      this._priceUsd = _priceUsd;
    }
  }
  