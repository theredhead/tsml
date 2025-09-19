export const Content = (prop) => (Ctor) => {
    Ctor.__tsx = { ...Ctor.__tsx, contentProp: prop };
    return Ctor;
};
