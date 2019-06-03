# Custom Generator
All the preconfigured component generators are exposing an instance of the `teleport-component-generator` package. Naturally, you can install the package and build your own generator with [plugins](/component-generators/plugins.html), [mappings](/component-generators/mappings.html) and [postprocessors](/component-generators/post-processors.html).

Let's configure a `React` component generator that uses `styled-jsx` and formats all code with `prettier`:

First install the dependencies:
```
npm install @teleporthq/teleport-component-generator
npm install @teleporthq/teleport-plugin-react-base-component
npm install @teleporthq/teleport-plugin-react-styled-jsx
npm install @teleporthq/teleport-plugin-import-statements
npm install @teleporthq/teleport-postprocessor-prettier-js
```

:::tip
`teleport-plugin-import-statements` will handle all the import statements that need to be generated, both from local dependencies as well as project or lib dependencies
:::

Then, we import all dependencies and we create the component generator, using the factory, a named export from the module:

```javascript
import { createGenerator } from '@teleporthq/teleport-component-generator'
import reactPlugin from '@teleporthq/teleport-plugin-react-base-component'
import styledJSXPlugin from '@teleporthq/teleport-plugin-react-styled-jsx'
import importStatementsPlugin from '@teleporthq/teleport-plugin-import-statements'
import prettierJS from '@teleporthq/teleport-postprocessor-prettier-js'

const generator = createGenerator()
```

Next, we have to consider any specific **mapping** for React. By default, the `teleport-component-generator` performs a mapping from the abstract UIDL elements to HTML elements.

Jump to the [mappings section](/component-generators/mappings.html#file-structure) to better understand the structure of a mapping file. A React mapping could look like this:

```json
{
  "elements": {
    "group": {
      "elementType": "Fragment",
      "dependency": {
        "type": "library",
        "path": "react",
        "meta": {
          "namedImport": true
        }
      }
    }
  }
}
```

The **official `React` mapping** is maintained inside [`teleport-component-generator-react`](https://github.com/teleporthq/teleport-code-generators/blob/master/packages/teleport-component-generator-react/src/react-mapping.json)

Add the mapping:
```javascript
import reactMapping from './react-mapping.json'

generator.addMapping(reactMapping)
```

:::tip
You can add as many mappings as you wish on one generator, they will override the elements and events that were previously mapped with the same key.
:::

Next, we can add all our **plugins** to the existing generator. Note that the **order** of the plugins is important as they will be run in **sequence** on the input UIDL:

```javascript
generator.addPlugin(reactPlugin)
generator.addPlugin(styledJSXPlugin)
generator.addPlugin(importStatementsPlugin)
```

Finally, we can add the post-processors:

```javascript
generator.addPostProcessor(prettierJS)
```

Now, we can test the generator. Considering the following UIDL:

```json
{
  "name": "React Component",
  "node": {
    "type": "element",
    "content": {
      "elementType": "container",
      "children": [
        {
          "type": "element",
          "content": {
            "elementType": "text",
            "style": {
              "color": {
                "type": "static",
                "content": "red"
              }
            },
            "children": [
              {
                "type": "static",
                "content": "World!"
              }
            ]
          }
        }
      ]
    }
  }
}
```

calling the generator:

```javascript
await generator.generateComponent(uidl)
```

should yield:

```javascript
import React from 'react'

const ReactComponent = (props) => {
  return (
    <div>
      <span className="text">World!</span>
      <style jsx>
        {`
          .text {
            color: red;
          }
        `}
      </style>
    </div>
  )
}

export default ReactComponent
```

Here's the full running code snippet:
```javascript
import { createGenerator } from '@teleporthq/teleport-component-generator'
import reactPlugin from '@teleporthq/teleport-plugin-react-base-component'
import styledJSXPlugin from '@teleporthq/teleport-plugin-react-styled-jsx'
import importStatementsPlugin from '@teleporthq/teleport-plugin-import-statements'
import prettierJS from '@teleporthq/teleport-postprocessor-prettier-js'

import reactMapping from './react-mapping.json'
import uidl from './uidl.json'

const generator = createGenerator()

generator.addMapping(reactMapping)

generator.addPlugin(reactPlugin)
generator.addPlugin(styledJSXPlugin)
generator.addPlugin(importStatementsPlugin)

generator.addPostProcessor(prettierJS)

const run = async() => {
  const result = await generator.generateComponent(uidl)
  console.log(result.files[0])
}
```