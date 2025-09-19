import type { ObserverToken } from './observable-core.js';
import { ObservableHost } from './observable-core.js';

export function Observable(alsoNotifyFor: string[] = []) {
  return function(proto: any, key: string) {
    const slot = Symbol(`__${key}`);
    Object.defineProperty(proto, key, {
      get() { return this[slot]; },
      set(v) {
        const old = this[slot]; if (old === v) return;
        this[slot] = v;
        this.notify(key, v);
        for (const extra of alsoNotifyFor) this.notify(extra, this[extra]);
      },
      enumerable: true, configurable: true,
    });
  };
}

/** Bridges child notifications upward as `${key}.${childPath}`. */
export function ObservableChild(alsoNotifyFor: string[] = []) {
  return function(proto: any, key: string) {
    const slot = Symbol(`__${key}`);
    let token: ObserverToken | null = null;

    Object.defineProperty(proto, key, {
      get() { return this[slot]; },
      set(v) {
        const old = this[slot]; if (old === v) return;

        // tear down previous bridge
        if (token && old && typeof old.unregisterObserver === 'function') {
          old.unregisterObserver(token);
          token = null;
        }

        this[slot] = v;

        if (v && typeof v.registerObserver === 'function' && typeof v.unregisterObserver === 'function') {
          const handler = (childPath: string, childVal: any) => {
            this.notify(`${key}.${childPath}`, childVal);
          };
          token = v.registerObserver('**', handler);
        }

        this.notify(key, v);
        for (const extra of alsoNotifyFor) this.notify(extra, this[extra]);
      },
      enumerable: true, configurable: true,
    });
  };
}

export function Computed(...deps: string[]) {
  return function(proto: any, key: string, desc: PropertyDescriptor) {
    const initKey = Symbol(`__init_${String(key)}`);
    const prev = proto.__initComputed as (() => void) | undefined;
    proto.__initComputed = function () {
      if (this[initKey]) return; this[initKey] = true;
      for (const d of deps) {
        this.registerObserver(d, () => this.notify(key, this[key]));
        this.registerObserver(d + '.**', () => this.notify(key, this[key]));
      }
      prev?.call(this);
    };
    return desc;
  };
}
