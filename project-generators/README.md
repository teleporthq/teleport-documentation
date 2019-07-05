# Architecture

A project generator converts a [ProjectUIDL](/uidl/#project-uidl) into an in-memory structure of files and folders.

## Project Strategy

The strategy is the parameter of the `createProjectGenerator` factory. The structure will give all the details needed to start the project generation. The detailed interface is called [`ProjectStrategy`](https://github.com/teleporthq/teleport-code-generators/blob/master/packages/teleport-project-generator/src/types.ts#L3) and can be consulted on GitHub. If we were to simplify this interface, the key parts are its required fields. These give you a better understanding of what a project generator does.

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

### Components

### Pages

### Routing

### Entry File

### Static Assets

## Project Templates

The template is an input parameter that you can send to the project generator if you prefere not to use the default architecture for your project.

You to send the template in two formats:

- the first one is a `GeneratedFolder` structure like the following:

```json
{
  "name": "project-name",
  "files": [],
  "subFolders": [
    {
      "name": "components",
      "files": [],
      "subFolders": []
    },
    {
      "name": "pages",
      "files": [],
      "subFolders": []
    },
    {
      "name": "public",
      "files": [],
      "subFolders": []
    }
  ]
}
```

- the second one is a `RemoteTemplateDefinition` structure. You can use this one when the template is stored on your Github account. In order to identify the template, the github `username` and the `repository` name are required.

  You will observe an optional parameter, the `auth`, used for authenticated requests to the Github API (due to the low rate limit of their API).

```ts
interface RemoteTemplateDefinition {
  username: string
  repo: string
  auth?: ServiceAuth
}

interface ServiceAuth {
  basic?: {
    username: string
    password: string
  }
  token?: string
}
```

:::tip
The generated pages and components will live in the template under the path you define in the [strategy](/project-generators/#project-strategy)
:::

## Project Generation Flow

## Project Generator Object

### Installation and Setup

### API Reference
