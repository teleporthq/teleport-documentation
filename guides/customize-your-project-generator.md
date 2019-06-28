# Customize Your Project Generator
All [pre-configured project generators](/project-generators/flavors.html) are implemented on top of the `teleport-project-generator` package, which offers the underlying abstractions for processing a `ProjectUIDL` into a structure of in-memory files and folders. In this guide, we will configure a `vue` project based on a structure similar with what you get when you run the `vue-cli`, so using `.vue` files for definining the components.

We'll start by installing the `teleport-project-generator` package:
```bash
yarn add @teleporthq/teleport-project-generator
```

Before creating a project generator, we need to figure out how we want to handle the different **components** that are making up the project.

We'll need the official `teleport-component-generator-vue`, but also the generic component generator `teleport-component-generator`, for the router and entry files.

```bash
yarn add @teleporthq/teleport-component-generator-vue
yarn add @teleporthq/teleport-component-generator
```

And we need some plugins and post-processors for the two instances of `teleport-component-generator`:
```bash
yarn add @teleporthq/teleport-plugin-vue-app-routing
yarn add @teleporthq/teleport-plugin-import-statements
yarn add @teleporthq/teleport-postprocessor-prettier-html
yarn add @teleporthq/teleport-postprocessor-prettier-js
```

:::tip
You can also use the `teleport-component-generator` to configure a custom `vue` component generator, but in this case we want to skip installing all the `vue` specific plugins.
:::

One final detail before heading into the configuration code, we have the option to define a custom mapping for the vue project. In this case, we want to map the UIDL standard `navlink` element to the `router-link` element which is supported by `vue-router`. Here's how the mapping file would look like:

```json
{
  "elements": {
    "navlink": {
      "elementType": "router-link",
      "attrs": {
        "to": { 
          "type": "dynamic",
          "content": {
            "referenceType": "attr",
            "id": "transitionTo"
          }
        }
      }
    }
  }
}
```

::: warning
The `navlink` element has a `transitionTo` attribute that specifies the `state` of the `route` key when clicking on that link. Internally, the project generator will convert that state key (eg: `about`) to the url added as the `to` prop (eg: `/about`)
:::

Now we need to create the component generators needed in the project strategy. First the component and the pages generator, which is the standard `vue` generator:

```javascript
import vueProjectMapping from './vue-project-mapping.json'
const vueComponentGenerator = createVueComponentGenerator(vueProjectMapping)
```
Then we configure the generator that creates the `router.js` file:
```javascript
const vueRouterGenerator = createComponentGenerator()
vueRouterGenerator.addPlugin(vueRoutingPlugin)
vueRouterGenerator.addPlugin(importStatementsPlugin)
vueRouterGenerator.addPostProcessor(prettierJS)
```
And the generator that creates the `index.html` file:
```javascript
const htmlFileGenerator = createComponentGenerator()
htmlFileGenerator.addPostProcessor(prettierHTML)
```

For creating a custom project generator, we need to define our [ProjectStrategy](/project-generators/#project-strategy). Let's define the following structure:

```
project
|--public/
|----index.html
|--src/
|----components/
|------...
|----views/
|------...
|----static/
|------manifest.json
|------favicon.ico
|------...
|----router.js
|--package.json
```

```javascript
const strategy = {
  components: {
    // components generated in `/src/components`
    generator: vueComponentGenerator,
    path: ['src', 'components'],
  },
  pages: {
    // pages generated in `/src/views`
    generator: vueComponentGenerator,
    path: ['src', 'views'],
  },
  router: {
    // router file named `router.js` generated in `/src`
    generator: vueRouterGenerator,
    path: ['src'],
    fileName: 'router',
  },
  entry: {
    // entry file with default name `index.html` generated in `/public`
    generator: htmlFileGenerator,
    path: ['public'],
  },
  static: {
    // assets will be copied to `/src/assets` and will be prefixed in the code with `/assets`
    prefix: '/assets',
    path: ['src', 'assets'],
  },
}
```

:::tip
Consult the [project strategy complete documentation](/project-generators/#project-strategy) to find out all the options and parameters that you can specify for each part of the project generation process.
:::

Finally, we create a new instance of a project generator, using the strategy we have defined:

```javascript
import { createProjectGenerator } from '@teleporthq/teleport-project-generator'
/* ... */
const generator = createProjectGenerator(strategy)
```

And we use it like this:
```javascript
const outputFolder = await generator.generateProject(projectUIDL)
```

Here's the complete code snippet of everything we did in this guide:
```javascript
import { createProjectGenerator } from '@teleporthq/teleport-project-generator'
import { createVueComponentGenerator } from '@teleporthq/teleport-component-generator-vue'
import { createComponentGenerator } from '@teleporthq/teleport-component-generator'

import vueRoutingPlugin from '@teleporthq/teleport-plugin-vue-app-routing'
import importStatementsPlugin from '@teleporthq/teleport-plugin-import-statements'
import prettierHTML from '@teleporthq/teleport-postprocessor-prettier-html'
import prettierJS from '@teleporthq/teleport-postprocessor-prettier-js'

import vueProjectMapping from './vue-project-mapping.json'

const vueComponentGenerator = createVueComponentGenerator(vueProjectMapping)

const vueRouterGenerator = createComponentGenerator()
vueRouterGenerator.addPlugin(vueRoutingPlugin)
vueRouterGenerator.addPlugin(importStatementsPlugin)
vueRouterGenerator.addPostProcessor(prettierJS)

const htmlFileGenerator = createComponentGenerator()
htmlFileGenerator.addPostProcessor(prettierHTML)

const strategy = {
  components: {
    // components generated in `/src/components`
    generator: vueComponentGenerator,
    path: ['src', 'components'],
  },
  pages: {
    // pages generated in `/src/views`
    generator: vueComponentGenerator,
    path: ['src', 'views'],
  },
  router: {
    // router file named `router.js` generated in `/src`
    generator: vueRouterGenerator,
    path: ['src'],
    fileName: 'router',
  },
  entry: {
    // entry file with default name `index.html` generated in `/public`
    generator: htmlFileGenerator,
    path: ['public'],
  },
  static: {
    // assets will be copied to `/src/assets` and will be prefixed in the code with `/assets`
    prefix: '/assets',
    path: ['src', 'assets'],
  },
}

const generator = createProjectGenerator(strategy)

const outputFolder = await generator.generateProject(projectUIDL)
```

If you want to play with a **similar configuration**, you can [check out this codesandbox](https://codesandbox.io/s/custom-project-generator-mqksv), where you can edit the input UIDL, the mapping, or just try out different plugins, post-processors or switch the project strategy.