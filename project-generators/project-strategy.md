# Project Strategy

The strategy is the parameter of the `createProjectGenerator` factory. The structure has all the details needed to start the project generation. The interface is called [`ProjectStrategy`](https://github.com/teleporthq/teleport-code-generators/blob/master/packages/teleport-project-generator/src/types.ts#L3) and can be consulted on GitHub. If we were to simplify this interface, the key parts are its required fields. These give you a better understanding of what a project generator does.

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

You can define **component generators** for each separate type of file that a project can generate. You also have to provide a **path** for each type of file. A **path** is defined as an **array of folders** (eg: `["src", "components"]`), the first one being generated directly in the root of the project. An **empty array** means the files will also be generated in the **root**. We went for the array notation to avoid confusions with slashes used at the beginning or at the end of the path.

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

## Components

This part of the strategy refers to the vast majority of **components** that are generated during the project generation process. These components are found under the `components` inside the `ProjectUIDL`. In your typical project, you would have components for **atomic** parts of the UI (eg: buttons, dialogs, cards) as well as for more complex parts of the application which can be **isolated** (eg: header, footer, listItem, loginForm)

```ts
components: {
  generator: ComponentGenerator
  path: string[]
}
```

 - **`generator`**: you can pass any general purpose component generator (eg: `teleport-component-generator-vue`, `teleport-component-generator-react`).
 - **`path`**: an array of folders representing the location where the component files are added in the output folder.

## Pages

Pages are the top level components of the projects. They have the same structure as any regular component and can be generated using the same component generators. The only difference is that they are defined inside the `root` part of the `ProjectUIDL`, where each route generates a different page component.

```ts
pages: {
  generator: ComponentGenerator
  path: string[]
  metaDataOptions?: {
    usePathAsFileName?: boolean
    convertDefaultToIndex?: boolean
  }
}
```

 - **`generator`**: you can pass any general purpose component generator (eg: `teleport-component-generator-vue`, `teleport-component-generator-react`).
 - **`path`**: an array of folders representing the location where the page files are added in the output folder.
 - **`metaDataOptions.usePathAsFileName`**: some frameworks have the routing built-in based on file names of the pages components (eg: next, nuxt).
 - **`metaDataOptions.convertDefaultToIndex`**: used in the cases when you want the default route to correspond to the `index` file. also used in the cases when the routing is decided based on the component names.

## Routing

The routing part is optional, since some frameworks decide the routing strictly based on the names of the pages and their paths. For the other options, the `routing` section is used to specify how to generate the routing file. Typically you will have a single routing file specific for each kind of framework.

```ts
router?: {
  generator: ComponentGenerator
  path: string[]
  fileName?: string
}
```

 - **`generator`**: you cannot use a general purpose component generator for this one. For official project generators, we have special routing plugins (eg: `teleport-plugin-react-app-routing`, `teleport-plugin-vue-app-routing`) that are used to generate the code inside the routing files.
 - **`path`**: an array of folders representing the location where the routing file is added in the output folder.
 - **`fileName`**: by default the routing code is generated in a file called `index`, you can override it with this param.

## Entry File

The entry file is the part of the application where you can specify global information about it. In your typical website, this would be the index.html or layout component which allows you to specify `<head>` related information or to inject global assets, links, etc.

```ts
entry: {
  generator: ComponentGenerator
  path: string[]
  fileName?: string
  chunkGenerationFunction?: (
    uidl: ProjectUIDL,
    options: EntryFileOptions
  ) => Record<string, ChunkDefinition[]>
  appRootOverride?: string
}
```

 - **`generator`**: you will not be using a general purpose component generator for this. The code inside this file is generated based on the `globals` part of the `ProjectUIDL`. Also, you will only require a generator to link the code chunks (using [linkCodeChunks](/component-generators/api-reference.html#linkcodechunks)).
 - **`path`**: an array of folders representing the location where the entry file is added in the output folder.
 - **`fileName`**: by default the entry file code is generated in a file called `index`, you can override it with this param.
 - **`chunkGenerationFunction`**: there's a default function that parses the `globals` section of the UIDL and returns a HAST code chunk for the html document. In case you need a custom behavior here or the framework requires a non-html file for the global/layout information(eg: next.js), you can write your own custom function that constructs these code chunks.
 - **`appRootOverride`**: by default, the html generation function will place a `<div id="app"/>` in the `body` tag. You can override this with any string that will be injected in the `body`.


## Static Assets

The last section of the strategy is about specifying the location where the static assets are copied in the output folder.

```ts
static: {
  prefix?: string
  path: string[]
}
```

- **`path`**: an array of folders representing the location where the static assets are added in the output folder.
- **`prefix`**: a string prefix that is prepended to all the urls inside the code generated in components, pages, entry files and so on. if it is not provided, this will be computed based on the `path` param (eg: `path: ["static"]` will become `/static`)