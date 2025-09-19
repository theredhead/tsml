var _a, _b;
const OBS = Symbol('obs.map'); // Map<KeyPath, Entry>
const TOK = Symbol('obs.tokens'); // Map<ObserverToken, { keyPath: KeyPath }>
export class ObservableHost {
    constructor() {
        this[_a] = new Map();
        this[_b] = new Map();
    }
    registerObserver(keyPath, observer) {
        const parts = split(keyPath);
        let entry = this[OBS].get(keyPath);
        if (!entry) {
            entry = { parts, observers: new Map() };
            this[OBS].set(keyPath, entry);
        }
        const token = Symbol(`obs:${keyPath}`);
        entry.observers.set(token, observer);
        this[TOK].set(token, { keyPath });
        return token;
    }
    unregisterObserver(token) {
        const meta = this[TOK].get(token);
        if (!meta)
            return;
        const entry = this[OBS].get(meta.keyPath);
        if (entry) {
            entry.observers.delete(token);
            if (entry.observers.size === 0)
                this[OBS].delete(meta.keyPath);
        }
        this[TOK].delete(token);
    }
    /** propertyPath is the concrete path that changed, e.g. "address.city". */
    notify(propertyPath, value) {
        const pathParts = split(propertyPath);
        const called = new Set();
        for (const { parts: pat, observers } of this[OBS].values()) {
            if (match(pat, pathParts)) {
                for (const obs of observers.values()) {
                    if (!called.has(obs)) {
                        called.add(obs);
                        obs(propertyPath, value);
                    }
                }
            }
        }
    }
}
_a = OBS, _b = TOK;
// helpers
function split(k) { return k ? k.split('.').filter(Boolean) : []; }
/** Glob matcher over dot segments: '*' (one segment), '**' (zero+ segments). */
function match(pat, path) {
    if (!pat.includes('*') && !pat.includes('**')) {
        if (pat.length !== path.length)
            return false;
        for (let i = 0; i < pat.length; i++)
            if (pat[i] !== path[i])
                return false;
        return true;
    }
    let i = 0, j = 0;
    while (i < pat.length && j < path.length) {
        const t = pat[i];
        if (t === '**') {
            if (i === pat.length - 1)
                return true;
            for (let k = j; k <= path.length; k++)
                if (match(pat.slice(i + 1), path.slice(k)))
                    return true;
            return false;
        }
        else if (t === '*') {
            i++;
            j++;
        }
        else {
            if (t !== path[j])
                return false;
            i++;
            j++;
        }
    }
    while (i < pat.length && pat[i] === '**')
        i++;
    return i === pat.length && j === path.length;
}
