import type { ObserverToken } from './observable-core.js';

export type ConverterFn = (v: any, ...args: string[]) => any;
export interface Converters { [name: string]: ConverterFn }
export type BindMode = 'oneWay' | 'twoWay' | 'oneTime';

export interface BindingSpec {
  path: string;
  mode: BindMode;
  pipes: Array<{ name: string; args: string[] }>;
}

export class BindingEngine {
  constructor(private converters: Converters = {}) {}

  parse(expr: string): BindingSpec | null {
    const m = expr.match(/^\{\s*bind\s+(.+?)\s*\}$/i);
    if (!m) return null;
    const body = m[1].trim();
    let mode: BindMode = 'oneWay';
    let rest = body;
    const modeM = body.match(/\b(oneWay|twoWay|oneTime)\b/i);
    if (modeM) { mode = modeM[1] as BindMode; rest = body.replace(modeM[0], '').trim(); }
    const segments = rest.split('|').map(s => s.trim()).filter(Boolean);
    const path = segments.shift()!;
    const pipes = segments.map(seg => {
      const name = seg.replace(/\(.*\)$/, '').trim();
      const argM = seg.match(/\((.*)\)$/);
      const args = argM ? argM[1].split(',').map(s => s.trim()) : [];
      return { name, args };
    });
    return { path, mode, pipes };
  }

  getPath(obj: any, path: string) {
    return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
  }

  setPath(obj: any, path: string, value: any) {
    const parts = path.split('.');
    const last = parts.pop()!;
    const tgt = parts.reduce((acc, k) => (acc[k] ??= {}), obj);
    tgt[last] = value;
  }

  applyConverters(v: any, pipes: BindingSpec['pipes']) {
    return pipes.reduce((acc, p) => {
      const fn = this.converters[p.name];
      return fn ? fn(acc, ...p.args) : acc;
    }, v);
  }

  bind(spec: BindingSpec, source: any, targetObj: any, targetProp: string, updateHook?: () => any) {
    const push = () => {
      const val = this.applyConverters(this.getPath(source, spec.path), spec.pipes);
      targetObj[targetProp] = val;
    };

    push();

    let t1: ObserverToken | null = null;
    let t2: ObserverToken | null = null;

    if (spec.mode !== 'oneTime' && typeof source.registerObserver === 'function') {
      const onChange = (_p: string) => push();
      t1 = source.registerObserver(spec.path, onChange as any);
      t2 = source.registerObserver(spec.path + '.**', onChange as any);
    }

    if (spec.mode === 'twoWay' && updateHook) {
      (targetObj as any).__writeBack ??= {};
      (targetObj as any).__writeBack[targetProp] = () => {
        const v = updateHook!();
        this.setPath(source, spec.path, v);
      };
    }

    return () => {
      if (t1 && typeof source.unregisterObserver === 'function') source.unregisterObserver(t1);
      if (t2 && typeof source.unregisterObserver === 'function') source.unregisterObserver(t2);
    };
  }
}
