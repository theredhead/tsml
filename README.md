# TSXaml-Kit

TSXaml-Kit is a TypeScript library for building object trees from XML markup, inspired by XAML and modern UI frameworks. It provides a declarative way to describe UI and data structures, with support for dependency injection, property bindings, and observables.

## Features

- **XML to TypeScript Object Tree**: Parse XML markup and instantiate TypeScript classes, mapping XML elements to your own types.
- **Dependency Injection (DI)**: Register and resolve services and types using a flexible DI container.
- **Property Bindings**: Bind XML attributes to observable properties for reactive updates.
- **Observables**: Decorators and helpers for property change notifications and observer patterns.
- **Content Slots**: Flexible content assignment for child elements, similar to slots in web components or XAML content properties.
- **Extensible Type Registry**: Register namespaces, types, and metadata for custom XML vocabularies.

## Getting Started

### Installation

```sh
npm install tsxaml-kit xmldom
```

### Example Usage

```typescript
import { TSXamlFactory } from "tsxaml-kit/factory";
import { makeContainer } from "tsxaml-kit/examples/registration";

const xml = `<ui:VBox xmlns:ui="@theredhead/ui" xmlns:x="tsx" spacing="8">
  <ui:Label text="Hello"/>
  <ui:Button text="Click me"/>
</ui:VBox>`;

const container = makeContainer();
const factory = new TSXamlFactory({
  container,
  defaultContentProp: "children",
});
const root = await factory.build(xml);
console.log("Built root:", root);
```

### XML to TypeScript Factory

You can also generate a TypeScript factory function from XML:

```typescript
import { generateTsFactory } from "tsxaml-kit/xml-to-ts-factory";

const fact = generateTsFactory(xml, {
  prefixImports: { ui: "@theredhead/ui" },
  contentSlot: (el) => (el.tagName === "ui:VBox" ? "children" : null),
});
console.log("Generated factory function:\n", fact);
```

## Project Structure

- `src/` — Core library source files
  - `factory.ts` — Main XML-to-object factory
  - `di.ts` — Dependency injection container
  - `observable-core.ts` — Observable host and observer logic
  - `observable-decorators.ts` — Observable property decorators
  - `content-decorator.ts` — Content slot decorator
  - `xml-to-ts-factory.ts` — XML to TypeScript factory generator
  - `examples/` — Example XML, demo scripts, and service registrations

## Concepts

### Dependency Injection

Register services and types, then resolve them by token. Supports singleton, scoped, and transient lifetimes.

### Observables

Decorate class properties to enable change notifications and observer patterns. Integrates with bindings for reactive UI/data updates.

### Content Slots

Assign children or content to properties using XML attributes or type metadata, similar to XAML's content properties.

## License

MIT

---

_TSXaml-Kit is inspired by XAML, React, and modern UI/data frameworks. Contributions and feedback are welcome!_
