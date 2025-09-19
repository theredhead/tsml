export function Injectable(opts = {}) {
    return function (Ctor) {
        Ctor.__di = { ...(Ctor.__di || {}), ...opts };
    };
}
export function InjectProps(map) {
    return function (Ctor) {
        Ctor.__di = { ...(Ctor.__di || {}), props: { ...(Ctor.__di?.props || {}), ...map } };
    };
}
