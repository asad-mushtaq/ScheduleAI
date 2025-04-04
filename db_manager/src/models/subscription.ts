export class Subscription {
    private _id: number;
    private _name: string;
    private _priceUsd: number;
    private _queryLimit: number
  
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

    public get queryLimit(): number {
      return this._queryLimit;
    }
    public set queryLimit(value: number) {
      this._queryLimit = value;
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
      _priceUsd: number,
      _queryLimit: number
    ) {
      this._id = id;
      this._name = _name;
      this._priceUsd = _priceUsd;
      this._queryLimit = _queryLimit;
    }
  }
  
