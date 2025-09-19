import { DIContainer, type NamespaceTypes } from '../di.js';
import { TOK } from '../tokens.js';
import { VBox, Label, ActionButton } from './ui.js';
import { ThemeService, AnalyticsService } from './services.js';

export function makeContainer(): DIContainer {
  const c = new DIContainer();

  const uiPkg: NamespaceTypes = {
    uri: '@theredhead/ui',
    types: {
      VBox: { kind: 'class', ctor: VBox },
      Label: { kind: 'class', ctor: Label },
      Button: TOK.UI.Button, // alias to interface token
    },
    typeMeta: { VBox: { contentProp: 'children' } },
  };
  c.useTypes(uiPkg);

  c.register({ token: TOK.UI.Button, lifetime: 'transient', useClass: ActionButton, deps: [TOK.Services.Theme, TOK.Services.Analytics] });
  c.register({ token: TOK.Services.Theme, lifetime: 'singleton', useClass: ThemeService });
  c.register({ token: TOK.Services.Analytics, lifetime: 'singleton', useFactory: () => new AnalyticsService('UA-XXXX') });

  return c;
}
