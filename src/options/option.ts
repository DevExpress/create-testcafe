export default class Option<T> {
    private _value?: T;
    private readonly _defaultValue: T;

    get value (): T {
        return this._value ?? this._defaultValue;
    }

    set value (val) {
        this._value = val;
    }

    get hasSet (): boolean {
        return this._value !== void 0;
    }

    constructor (defaultValue: T) {
        this._defaultValue = defaultValue;
    }

    toString (): string {
        if (typeof this.value === 'boolean')
            return this.value ? 'Yes' : 'No';

        return `${ this.value }`;
    }
}
