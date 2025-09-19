export const Content = (prop: string) =>
  <T extends new (...args: any[]) => any>(Ctor: T) => {
    (Ctor as any).__tsx = { ...(Ctor as any).__tsx, contentProp: prop };
    return Ctor;
  };
