import type { Token } from './di.js';

export function Injectable(opts: { deps?: Token[], props?: Record<string,Token> } = {}) {
  return function (Ctor: any) {
    Ctor.__di = { ...(Ctor.__di || {}), ...opts };
  };
}

export function InjectProps(map: Record<string, Token>) {
  return function (Ctor: any) {
    Ctor.__di = { ...(Ctor.__di || {}), props: { ...(Ctor.__di?.props || {}), ...map } };
  };
}
