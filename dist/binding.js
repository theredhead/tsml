export class BindingEngine {
    constructor(converters = {}) {
        this.converters = converters;
    }
    parse(expr) {
        const m = expr.match(/^\{\s*bind\s+(.+?)\s*\}$/i);
        if (!m)
            return null;
        const body = m[1].trim();
        let mode = 'oneWay';
        let rest = body;
        const modeM = body.match(/\b(oneWay|twoWay|oneTime)\b/i);
        if (modeM) {
            mode = modeM[1];
            rest = body.replace(modeM[0], '').trim();
        }
        const segments = rest.split('|').map(s => s.trim()).filter(Boolean);
        const path = segments.shift();
        const pipes = segments.map(seg => {
            const name = seg.replace(/\(.*\)$/, '').trim();
            const argM = seg.match(/\((.*)\)$/);
            const args = argM ? argM[1].split(',').map(s => s.trim()) : [];
            return { name, args };
        });
        return { path, mode, pipes };
    }
    getPath(obj, path) {
        return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
    }
    setPath(obj, path, value) {
        const parts = path.split('.');
        const last = parts.pop();
        const tgt = parts.reduce((acc, k) => (acc[k] ?? (acc[k] = {})), obj);
        tgt[last] = value;
    }
    applyConverters(v, pipes) {
        return pipes.reduce((acc, p) => {
            const fn = this.converters[p.name];
            return fn ? fn(acc, ...p.args) : acc;
        }, v);
    }
    bind(spec, source, targetObj, targetProp, updateHook) {
        var _a;
        const push = () => {
            const val = this.applyConverters(this.getPath(source, spec.path), spec.pipes);
            targetObj[targetProp] = val;
        };
        push();
        let t1 = null;
        let t2 = null;
        if (spec.mode !== 'oneTime' && typeof source.registerObserver === 'function') {
            const onChange = (_p) => push();
            t1 = source.registerObserver(spec.path, onChange);
            t2 = source.registerObserver(spec.path + '.**', onChange);
        }
        if (spec.mode === 'twoWay' && updateHook) {
            (_a = targetObj).__writeBack ?? (_a.__writeBack = {});
            targetObj.__writeBack[targetProp] = () => {
                const v = updateHook();
                this.setPath(source, spec.path, v);
            };
        }
        return () => {
            if (t1 && typeof source.unregisterObserver === 'function')
                source.unregisterObserver(t1);
            if (t2 && typeof source.unregisterObserver === 'function')
                source.unregisterObserver(t2);
        };
    }
}
