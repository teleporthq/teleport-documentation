# Create Your Project Strategy
All pre-configured project generators are implemented on top of the `teleport-project-generator` package, which offers the underlying abstractions for processing a `ProjectUIDL` into a structure of in-memory files and folders.

We'll start by installing the `teleport-project-generator` package:
```bash
yarn add @teleporthq/teleport-project-generator
```

which is then used like this:

```javascript
import { createProjectGenerator } from '@teleporthq/teleport-project-generator'

const generator = createProjectGenerator({
  components: ...
  pages: ...
  entry: ...
  static: ...
})
```

### What Is A Project Strategy?

The only parameter of the `createProjectGenerator` factory is the [`ProjectStrategy`](https://github.com/teleporthq/teleport-code-generators/blob/master/packages/teleport-project-generator/src/types.ts#L3). If we were to simplify this interface, the key parts are its required fields. These give you a better understanding of what a project generator does.

```typescript
interface ProjectStrategy {
  components: {
    generator: ComponentGenerator
    path: string[]
  }
  pages: {
    generator: ComponentGenerator
    path: string[]
  }
  router?: {
    generator: ComponentGenerator
    path: string[]
  }
  entry: {
    generator: ComponentGenerator
    path: string[]
  }
  static: {
    path: string[]
  }
}
```

You can define **component generators** for each separate type of file that a project can generate. You also have to provide a **path** for each type of file. A **path** is defined as an **array of folders** (eg: `["src", "components"]`), the first one being generated directly in the root of the project. An **empty array** means the files will also be generated in the **root**.

Considering this strategy:
```javascript
{
  components: {
    generator: vueComponentGenerator,
    path: ["components"],
  },
  pages: {
    generator: vueComponentGenerator,
    path: ["pages"],
  },
  router: {
    generator: vueRouterComponentGenerator,
    path: [],
    fileName: "router"
  },
  entry: {
    generator: htmlEntryGenerator,
    path: []
  },
  static: {
    path: ["static"]
  }
}
```
This should be the folder structure at the end of the generation process:
```
project
|--components/
|----button.js
|----navbar.js
|----...
|--pages/
|----home.js
|----about.js
|----...
|--static/
|----manifest.json
|----favicon.ico
|----...
|--router.js
|--index.html
|--package.json
```
:::tip
The **router** strategy is optional since some frameworks (next, nuxt) have the routing capability built-in, based on the folder structure of the pages.
:::