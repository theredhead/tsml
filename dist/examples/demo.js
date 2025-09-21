"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_js_1 = require("../factory.js");
const registration_js_1 = require("./registration.js");
const xml = `<ui:VBox xmlns:ui="@theredhead/ui" xmlns:x="tsx" spacing="8">
  <ui:Label text="Hello"/>
  <ui:Button text="Click me"/>
</ui:VBox>`;
const container = (0, registration_js_1.makeContainer)();
const factory = new factory_js_1.TSXamlFactory({
    container,
    defaultContentProp: "children",
});
factory.build(xml).then(console.log);
