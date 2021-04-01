# Flavors

The standard `teleport-component-generator` can be customized with _mappings_, _plugins_ and _post-processors_. Each flavor of component generation is just an **instance** of the generic generator with preloaded plugins and post-processors. Additionally, each flavor defins its own **mapping**, corresponding to the particularities of the framework.

Below you can find the official list of `teleport` component generator packages:

- [React](/component-generators/flavors.html#react)
- [Vue](/component-generators/flavors.html#vue)
- [Angular](/component-generators/flavors.html#angular)
- [Stencil](/component-generators/flavors.html#stencil)
- [Preact](/component-generators/flavors.html#preact)

:::tip
You can play with the different code ouputs in our [online REPL](https://repl.teleporthq.io/)
:::

## React

The `teleport-component-generator-react` package loads all the different style plugins and allows you to pick the preferred styling via a input parameter called `variation`.

The bulk of the package is this function that configures the generator:

```typescript
const stylePlugins = {
  InlineStyles: inlineStylesPlugin,
  StyledComponents: reactStyledComponentsPlugin,
  StyledJSX: reactStyledJSXPlugin,
  CSSModules: cssModulesPlugin,
  CSS: cssPlugin,
  JSS: reactJSSPlugin,
};

export const createReactComponentGenerator = (
  variation: string = "CSS",
  mapping: Mapping = {}
): ComponentGenerator => {
  const stylePlugin = stylePlugins[variation] || cssPlugin;

  const generator = createComponentGenerator();

  generator.addMapping(reactMapping);
  generator.addMapping(mapping);

  generator.addPlugin(reactComponentPlugin);
  generator.addPlugin(stylePlugin);
  generator.addPlugin(propTypesPlugin);
  generator.addPlugin(importStatementsPlugin);

  generator.addPostProcessor(prettierJS);

  return generator;
};
```

#### Install

```bash
npm install @teleporthq/teleport-component-generator-react
```

or

```bash
yarn add @teleporthq/teleport-component-generator-react
```

#### Usage

```javascript
import { createReactComponentGenerator } from "@teleporthq/teleport-component-generator-react";

// other style options: "CSS" - default, "StyledComponents", "StyledJSX", "JSS", "InlineStyles"
const reactGenerator = createReactComponentGenerator({
  variation: "CSSModules",
});

const result = await reactGenerator.generateComponent(uidl);
```

Check `GeneratorOptions` to seee other parameters that can be passed.

## Vue

In the `teleport-component-generator-vue` there is no style variation, as the generator outputs `.vue` files with scoped style.

The main file of the package configures the generator:

```typescript
export const createVueComponentGenerator = (
  mapping: Mapping = {}
): ComponentGenerator => {
  const generator = createComponentGenerator();

  generator.addMapping(vueMapping);
  generator.addMapping(mapping);

  generator.addPlugin(vueComponentPlugin);
  generator.addPlugin(vueStylePlugin);
  generator.addPlugin(importStatementsPlugin);

  generator.addPostProcessor(prettierJS);
  generator.addPostProcessor(prettierHTML);
  generator.addPostProcessor(vueFile);

  return generator;
};
```

#### Install

```bash
npm install @teleporthq/teleport-component-generator-vue
```

or

```bash
yarn add @teleporthq/teleport-component-generator-vue
```

#### Usage

```javascript
import { createVueComponentGenerator } from "@teleporthq/teleport-component-generator-vue";

const vueGenerator = createVueComponentGenerator();

const result = await vueGenerator.generateComponent(uidl);
```

## Angular

The official package for angular components is: `teleport-component-generator-angular`. This generates separate files for the class component (.ts), the template (.html) and the style (.css).

The main file of the package configures the generator:

```typescript
export const createAngularComponentGenerator = (
  mapping: Mapping = {}
): ComponentGenerator => {
  const generator = createComponentGenerator();

  generator.addMapping(mapping);
  generator.addMapping(angularMapping);

  generator.addPlugin(angularComponentPlugin);
  generator.addPlugin(importStatementsPlugin);
  generator.addPlugin(stylePlugin);

  generator.addPostProcessor(prettierJS);
  generator.addPostProcessor(prettierHTML);

  return generator;
};
```

#### Install

```bash
npm install @teleporthq/teleport-component-generator-angular
```

or

```bash
yarn add @teleporthq/teleport-component-generator-angular
```

#### Usage

```javascript
import { createAngularComponentGenerator } from "@teleporthq/teleport-component-generator-angular";

const angularGenerator = createAngularComponentGenerator();

const result = await angularGenerator.generateComponent(uidl);
```

## Stencil

The official package for stencil components is: `teleport-component-generator-stencil`. This generates typescript based `.tsx` files for components as well as separate `.css` files for styling. The component is generated with the `shadow`: `true` flag.

The main file of the package configures the generator:

```typescript
export const createStencilComponentGenerator = (
  mapping: Mapping = {}
): ComponentGenerator => {
  const generator = createComponentGenerator();

  generator.addMapping(stencilMapping);
  generator.addMapping(mapping);

  generator.addPlugin(stencilComponentPlugin);
  generator.addPlugin(stencilStylePlugin);
  generator.addPlugin(importStatementsPlugin);

  generator.addPostProcessor(prettierJS);

  return generator;
};
```

#### Install

```bash
npm install @teleporthq/teleport-component-generator-stencil
```

or

```bash
yarn add @teleporthq/teleport-component-generator-stencil
```

#### Usage

```javascript
import { createStencilComponentGenerator } from "@teleporthq/teleport-component-generator-stencil";

const stencilGenerator = createStencilComponentGenerator();

const result = await stencilGenerator.generateComponent(uidl);
```

## Preact

The official package for `preact` components is similar to the `react` one: `teleport-component-generator-preact`. When creating the generator, you can pass a parameter to specify different styling variations. Based on that, the generator loads a different style plugin.

The main file of the package configures the generator:

```typescript
const stylePlugins = {
  InlineStyles: inlineStylesPlugin,
  CSSModules: cssModulesPlugin,
  CSS: cssPlugin,
};

export const createPreactComponentGenerator = ({
  variation: string = "CSS",
  mapping: Mapping = {},
}): ComponentGenerator => {
  const generator = createComponentGenerator();
  const stylePlugin = stylePlugins[variation] || cssPlugin;

  generator.addMapping(preactMapping);
  generator.addMapping(mapping);

  generator.addPlugin(preactComponentPlugin);
  generator.addPlugin(stylePlugin);
  generator.addPlugin(proptypesPlugin);
  generator.addPlugin(importStatementsPlugin);

  generator.addPostProcessor(prettierJS);

  return generator;
};
```

#### Install

```bash
npm install @teleporthq/teleport-component-generator-preact
```

or

```bash
yarn add @teleporthq/teleport-component-generator-preact
```

#### Usage

```javascript
import { createPreactComponentGenerator } from "@teleporthq/teleport-component-generator-preact";

// other style options: "CSS" - default, "InlineStyles"
const preactGenerator = createPreactComponentGenerator({
  variation: "CSSModules",
});

const result = await preactGenerator.generateComponent(uidl);
```
