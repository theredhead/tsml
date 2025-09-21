"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injectable = Injectable;
exports.InjectProps = InjectProps;
function Injectable(opts = {}) {
    return function (Ctor) {
        Ctor.__di = { ...(Ctor.__di || {}), ...opts };
    };
}
function InjectProps(map) {
    return function (Ctor) {
        Ctor.__di = { ...(Ctor.__di || {}), props: { ...(Ctor.__di?.props || {}), ...map } };
    };
}
