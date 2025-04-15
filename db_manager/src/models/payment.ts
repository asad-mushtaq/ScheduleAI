// Payment.ts
export class Payment {
    private _id: number;
    private _date: Date;
    private _amount: number;
    private _subscriptionId: number;
    private _userId: number;

    public get id(): number {
        return this._id;
    }

    public get date(): Date {
        return this._date;
    }
    public set date(value: Date) {
        this._date = value;
    }

    public get amount(): number {
        return this._amount;
    }
    public set amount(value: number) {
        this._amount = value;
    }

    public get subscriptionId(): number {
        return this._subscriptionId;
    }
    public set subscriptionId(value: number) {
        this._subscriptionId = value;
    }

    public get userId(): number {
        return this._userId;
    }
    public set userId(value: number) {
        this._userId = value;
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
            .forEach(([key]) => {
                try {
                    jsonObj[key] = (this as any)[key];
                } catch (error) {
                    console.error(`Error calling getter ${key}`, error);
                }
            });
        return jsonObj;
    }

    constructor(
        id: number,
        _date: Date,
        _amount: number,
        _subscriptionId: number,
        _userId: number
    ) {
        this._id = id;
        this._date = _date;
        this._amount = _amount;
        this._subscriptionId = _subscriptionId;
        this._userId = _userId;
    }
}
