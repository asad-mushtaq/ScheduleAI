export class User {
    private _id: number;
    private _firstName: string;
    private _lastName: string;
    private _email: string;
    private _password: string;
    private _admin: boolean;

    public get id(): number {
        return this._id;
    }

    public get firstName(): string {
        return this._firstName;
    }
    public set firstName(value: string) {
        this._firstName = value;
    }

    public get lastName(): string {
        return this._lastName;
    }
    public set lastName(value: string) {
        this._lastName = value;
    }

    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }

    public get admin(): boolean {
        return this._admin;
    }
    public set admin(value: boolean) {
        this._admin = value;
    }

    public get password(): string {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
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
        _id: number,
        _firstName: string,
        _lastName: string,
        _email: string,
        _password: string,
        _admin: boolean
    ) {
        this._id = _id;
        this._firstName = _firstName;
        this._lastName = _lastName;
        this._email = _email;
        this._password = _password;
        this._admin = _admin;
    }
}
