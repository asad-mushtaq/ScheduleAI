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

