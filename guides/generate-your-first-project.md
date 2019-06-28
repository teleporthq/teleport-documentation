# Generate Your First Project

Once you have a good understanding of the [component generation process](/guides/getting-started.html), you can explore a full project generation.

A [project UIDL](/uidl/#project-uidl) can define a fully working website. The UIDL consists of:

- a collection of **component UIDLs** and
- logic for **routing** the different pages of the application
- **global** settings and meta tags

The easiest way to get started is to grab one of the [pre-configured project generators](/project-generators/flavors.html). In this guide, we will use the `teleport-project-generator-next` one. This will generate a fully working [Next.js](https://nextjs.org/) application with `pages` and `components`.

```
npm install @teleporthq/teleport-project-generator-next
```

```javascript
import nextGenerator from "@teleporthq/teleport-project-generator-react-next"

const uidl = {
  /* ... */
}

const result = await nextGenerator.generateProject(uidl)

console.log(result.outputFolder)
```

You can start from this [project-uidl sample](https://github.com/teleporthq/teleport-code-generators/blob/master/examples/uidl-samples/project.json).

The result will be an object of type `GeneratedFolder`:

```typescript
interface GeneratedFolder {
  name: string
  files: GeneratedFile[]
  subFolders: GeneratedFolder[]
}

interface GeneratedFile {
  name: string
  content: string
  fileType?: string
  contentEncoding?: string
}
```

Sample output:

```json
{
  "name": "react-next",
  "files": [
    {
      "name": "package",
      "fileType": "json",
      "content": "{\n  \"name\": \"myvueproject\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Project generated based on a UIDL document\",\n  \"main\": \"index.js\",\n  \"author\": \"teleportHQ\",\n  \"license\": \"MIT\",\n  \"dependencies\": {\n    \"next\": \"^8.0.3\",\n    \"react-dom\": \"^16.8.3\",\n    \"react\": \"^16.8.3\"\n  },\n  \"scripts\": {\n    \"dev\": \"next\",\n    \"build\": \"next build\",\n    \"start\": \"next start\"\n  }\n}"
    }
  ],
  "subFolders": [
    {
      "name": "components",
      "files": [
        {
          "name": "navbar",
          "fileType": "js",
          "content": "import React, { Fragment } from 'react'\nimport Link from 'next/link'\n\nconst Navbar = (props) => {\n  return (\n    <Fragment>\n      {<Link href=\"/\">{<a>Home</a>}</Link>}\n      {<Link href=\"/about\">{<a>About</a>}</Link>}\n      {<Link href=\"/here-we-are\">{<a>Contact</a>}</Link>}\n    </Fragment>\n  )\n}\n\nexport default Navbar\n"
        }
        /*...*/
      ],
      "subFolders": [
        /*...*/
      ]
    }
    /*...*/
  ]
}
```

The next guide will show you how to create a custom **project generator** by defining a **project strategy**. If you are happy with one of the [pre-configured project generators](/project-generators/flavors.html), you can skip to the [next guide](/guides/pack-and-publish-your-project.html), that will show you how to **pack** your project and **publish** it.
