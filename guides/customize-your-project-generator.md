# Customize Your Project Generator
All [pre-configured project generators](/project-generators/flavors.html) are implemented on top of the `teleport-project-generator` package, which offers the underlying abstractions for processing a `ProjectUIDL` into a structure of in-memory files and folders. In this guide, we will configure a `vue` project based on a structure similar with what you get when you run the `vue-cli`. We will be using `.vue` files for definining the components.

We'll start by installing the `teleport-project-generator` package:
```bash
npm install @teleporthq/teleport-project-generator
```

Before creating a project generator, we need to figure out how we want to handle the different **components** that are making up the project.

:::tip
Project generators rely heavily on component generators to create individual files for their output. If you're new to the component generation process, please check the first two guides on [how to create your first component](/guides/getting-started.html) and how to [customize a component generator](/guides/custom-component-generator.html).
:::

Ok, moving further, we'll need the official `teleport-component-generator-vue`, but also the generic component generator `teleport-component-generator`, for the **router** and **entry** files.

So we'll install the first package for our **pages** and **components**:
```bash
npm install @teleporthq/teleport-component-generator-vue
```

:::tip
You can also use the `teleport-component-generator` to configure a custom `vue` component generator, but in this case we want to skip installing all the `vue` specific plugins.
:::

Then we will install the core generator for the **router** and **entry** files:
```bash
npm install @teleporthq/teleport-component-generator
```

For the **router** we also need:
```bash
npm install @teleporthq/teleport-plugin-vue-app-routing
npm install @teleporthq/teleport-plugin-import-statements
npm install @teleporthq/teleport-postprocessor-prettier-js
```

`teleport-plugin-vue-app-routing` handles the code in the router.js file, while `teleport-plugin-import-statements` is used by any generator to create the import statements based on the dependencies of that component. `teleport-postprocessor-prettier-js` is used to format the code.

Finally, for the **entry** file we need the `html` formatter:

```bash
npm install @teleporthq/teleport-postprocessor-prettier-html
```

------

Before heading into the configuration code, we have the option to define a custom mapping for the vue project. In this case, we want to map the UIDL standard `navlink` element to the `router-link` element which is supported by `vue-router`. Here's how the mapping file would look like:

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

------

A single JS/TS file is needed for creating this custom project generator. In here, we will instantiate all the component generators that were installed at the previous steps and pass them inside the **project strategy**. 

First, create the vue component generator, that handles **components** and **pages**:

```javascript
import vueProjectMapping from './vue-project-mapping.json'
const vueComponentGenerator = createVueComponentGenerator(vueProjectMapping)
```

Then the generator that creates the `router.js` file:
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

Like mentioned before, each project generator requires a [ProjectStrategy](/project-generators/project-strategy.html) object. The strategy is assigning component generators to certain types of files that are generated during the process. Also, it defines the paths where those files are placed in the output folder.

Imagine that you want to generate a project with the following folder structure:

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

The strategy specifies that:
 - all components are placed in the `src/components` folder
 - all pages are placed in the `src/views` folder
 - the router file is placed in the `src` folder
 - the entry point (index.html) is placed in the `public` folder

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
Notice that next to the `paths`, you assign one of the instances of **component generators** that we have from the previous steps.
:::

:::tip
Consult the [project strategy complete documentation](/project-generators/project-strategy.html) to find out all the options and parameters that you can specify for each part of the project generation process.
:::

------

Once we have all that, we can invoke the `createProjectGenerator` factory with our custom **strategy** object:

```javascript
import { createProjectGenerator } from '@teleporthq/teleport-project-generator'
/* ... */
const generator = createProjectGenerator(strategy)
```

And we use the generator instance like this:
```javascript
const outputFolder = await generator.generateProject(projectUIDL)
```

------

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