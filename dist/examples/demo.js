import { TSXamlFactory } from '../factory.js';
import { makeContainer } from './registration.js';
const xml = `<ui:VBox xmlns:ui="@theredhead/ui" xmlns:x="tsx" spacing="8">
  <ui:Label text="Hello"/>
  <ui:Button text="Click me"/>
</ui:VBox>`;
const container = makeContainer();
const factory = new TSXamlFactory({ container, defaultContentProp: 'children' });
const root = await factory.build(xml);
console.log('Built root:', root);
