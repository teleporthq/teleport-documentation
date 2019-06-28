# Flavors

The standard `teleport-component-generator` can be customized with *mappings*, *plugins* and *post-processors*. Each flavor of component generation is just an **instance** of the generic generator with preloaded plugins and post-processors. Additionally, each flavor defins its own **mapping**, corresponding to the particularities of the framework.

## React

The `teleport-component-generator-react` package loads all the different style plugins and allows you to pick the preferred styling via a input parameter called `variation`.

The bulk of the package is this simple function that configures the generator:

```typescript
const stylePlugins = {
  InlineStyles: reactInlineStylesPlugin,
  StyledComponents: reactStyledComponentsPlugin,
  StyledJSX: reactStyledJSXPlugin,
  CSSModules: reactCSSModulesPlugin,
  JSS: reactJSSPlugin,
}

export const createReactComponentGenerator = (
  variation: string = 'InlineStyles',
  { mapping }: GeneratorOptions = { mapping }
): ComponentGenerator => {
  const stylePlugin = stylePlugins[variation] || reactInlineStylesPlugin

  const generator = createComponentGenerator()

  generator.addMapping(reactMapping)
  generator.addMapping(mapping)

  generator.addPlugin(reactComponentPlugin)
  generator.addPlugin(stylePlugin)
  generator.addPlugin(reactPropTypesPlugin)
  generator.addPlugin(importStatementsPlugin)

  generator.addPostProcessor(prettierJS)

  return generator
}
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
import { createReactComponentGenerator } from '@teleporthq/teleport-component-generator-react'

// other style options: "InlineStyles" - default, "StyledComponents", "StyledJSX", "JSS"
const reactGenerator = createReactComponentGenerator('CSSModules')

const result = await reactGenerator.generateComponent(uidl)
```

Additionally, you can pass a `GeneratorOptions` object as a second parameter:
```javascript
const reactGenerator = createReactComponentGenerator('CSSModules', { /*...*/ })
```

## Vue

The `teleport-component-generator-vue` is even simpler, as there's no style variation in `Vue`.

The bulk of the package is this simple function that configures the generator:

```typescript
export const createVueComponentGenerator = (
  { mapping }: GeneratorOptions = { mapping }
): ComponentGenerator => {
  const generator = createComponentGenerator()

  generator.addMapping(vueMapping)
  generator.addMapping(mapping)

  generator.addPlugin(vueComponentPlugin)
  generator.addPlugin(vueStylePlugin)
  generator.addPlugin(importStatementsPlugin)

  generator.addPostProcessor(prettierJS)
  generator.addPostProcessor(prettierHTML)
  generator.addPostProcessor(vueFile)

  return generator
}
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
import { createVueComponentGenerator } from '@teleporthq/teleport-component-generator-vue'

const vueGenerator = createVueComponentGenerator()

const result = await vueGenerator.generateComponent(uidl)
```