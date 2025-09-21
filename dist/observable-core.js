"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableHost = void 0;
exports.ObservableClass = ObservableClass;
/**
 * Class decorator to mix ObservableHost methods into a class prototype.
 */
function ObservableClass(Ctor) {
    const hostProto = ObservableHost.prototype;
    Object.getOwnPropertyNames(hostProto).forEach((key) => {
        if (key === "constructor")
            return;
        if (!Ctor.prototype[key]) {
            Object.defineProperty(Ctor.prototype, key, Object.getOwnPropertyDescriptor(hostProto, key));
        }
    });
    // Patch constructor to initialize private fields
    const OBS_SYM = Object.getOwnPropertySymbols(hostProto).find((s) => s.description === "obs.map");
    const TOK_SYM = Object.getOwnPropertySymbols(hostProto).find((s) => s.description === "obs.tokens");
    return class extends Ctor {
        constructor(...args) {
            super(...args);
            this["__ObservableHost_OBS"] = new Map();
            this["__ObservableHost_TOK"] = new Map();
        }
    };
}
class ObservableHost {
    constructor() {
        this.__ObservableHost_OBS = new Map();
        this.__ObservableHost_TOK = new Map();
    }
    registerObserver(keyPath, observer) {
        const parts = split(keyPath);
        let entry = this.__ObservableHost_OBS.get(keyPath);
        if (!entry) {
            entry = { parts, observers: new Map() };
            this.__ObservableHost_OBS.set(keyPath, entry);
        }
        const token = Symbol(`obs:${keyPath}`);
        entry.observers.set(token, observer);
        this.__ObservableHost_TOK.set(token, { keyPath });
        return token;
    }
    unregisterObserver(token) {
        const meta = this.__ObservableHost_TOK.get(token);
        if (!meta)
            return;
        const entry = this.__ObservableHost_OBS.get(meta.keyPath);
        if (entry) {
            entry.observers.delete(token);
            if (entry.observers.size === 0)
                this.__ObservableHost_OBS.delete(meta.keyPath);
        }
        this.__ObservableHost_TOK.delete(token);
    }
    /** propertyPath is the concrete path that changed, e.g. "address.city". */
    notify(propertyPath, value) {
        const pathParts = split(propertyPath);
        const called = new Set();
        for (const { parts: pat, observers, } of this.__ObservableHost_OBS.values()) {
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
exports.ObservableHost = ObservableHost;
// helpers
function split(k) {
    return k ? k.split(".").filter(Boolean) : [];
}
/** Glob matcher over dot segments: '*' (one segment), '**' (zero+ segments). */
function match(pat, path) {
    if (!pat.includes("*") && !pat.includes("**")) {
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
        if (t === "**") {
            if (i === pat.length - 1)
                return true;
            for (let k = j; k <= path.length; k++)
                if (match(pat.slice(i + 1), path.slice(k)))
                    return true;
            return false;
        }
        else if (t === "*") {
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
    while (i < pat.length && pat[i] === "**")
        i++;
    return i === pat.length && j === path.length;
}
