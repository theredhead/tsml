"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = void 0;
const Content = (prop) => (Ctor) => {
    Ctor.__tsx = { ...Ctor.__tsx, contentProp: prop };
    return Ctor;
};
exports.Content = Content;
