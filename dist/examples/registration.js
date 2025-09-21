"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeContainer = makeContainer;
const di_js_1 = require("../di.js");
const tokens_js_1 = require("../tokens.js");
const ui_js_1 = require("./ui.js");
const services_js_1 = require("./services.js");
function makeContainer() {
    const c = new di_js_1.DIContainer();
    const uiPkg = {
        uri: '@theredhead/ui',
        types: {
            VBox: { kind: 'class', ctor: ui_js_1.VBox },
            Label: { kind: 'class', ctor: ui_js_1.Label },
            Button: tokens_js_1.TOK.UI.Button, // alias to interface token
        },
        typeMeta: { VBox: { contentProp: 'children' } },
    };
    c.useTypes(uiPkg);
    c.register({ token: tokens_js_1.TOK.UI.Button, lifetime: 'transient', useClass: ui_js_1.ActionButton, deps: [tokens_js_1.TOK.Services.Theme, tokens_js_1.TOK.Services.Analytics] });
    c.register({ token: tokens_js_1.TOK.Services.Theme, lifetime: 'singleton', useClass: services_js_1.ThemeService });
    c.register({ token: tokens_js_1.TOK.Services.Analytics, lifetime: 'singleton', useFactory: () => new services_js_1.AnalyticsService('UA-XXXX') });
    return c;
}
