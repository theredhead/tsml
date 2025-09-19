export function Observable(alsoNotifyFor = []) {
    return function (proto, key) {
        const slot = Symbol(`__${key}`);
        Object.defineProperty(proto, key, {
            get() { return this[slot]; },
            set(v) {
                const old = this[slot];
                if (old === v)
                    return;
                this[slot] = v;
                this.notify(key, v);
                for (const extra of alsoNotifyFor)
                    this.notify(extra, this[extra]);
            },
            enumerable: true, configurable: true,
        });
    };
}
/** Bridges child notifications upward as `${key}.${childPath}`. */
export function ObservableChild(alsoNotifyFor = []) {
    return function (proto, key) {
        const slot = Symbol(`__${key}`);
        let token = null;
        Object.defineProperty(proto, key, {
            get() { return this[slot]; },
            set(v) {
                const old = this[slot];
                if (old === v)
                    return;
                // tear down previous bridge
                if (token && old && typeof old.unregisterObserver === 'function') {
                    old.unregisterObserver(token);
                    token = null;
                }
                this[slot] = v;
                if (v && typeof v.registerObserver === 'function' && typeof v.unregisterObserver === 'function') {
                    const handler = (childPath, childVal) => {
                        this.notify(`${key}.${childPath}`, childVal);
                    };
                    token = v.registerObserver('**', handler);
                }
                this.notify(key, v);
                for (const extra of alsoNotifyFor)
                    this.notify(extra, this[extra]);
            },
            enumerable: true, configurable: true,
        });
    };
}
export function Computed(...deps) {
    return function (proto, key, desc) {
        const initKey = Symbol(`__init_${String(key)}`);
        const prev = proto.__initComputed;
        proto.__initComputed = function () {
            if (this[initKey])
                return;
            this[initKey] = true;
            for (const d of deps) {
                this.registerObserver(d, () => this.notify(key, this[key]));
                this.registerObserver(d + '.**', () => this.notify(key, this[key]));
            }
            prev?.call(this);
        };
        return desc;
    };
}
