# Custom Component Generator
All the preconfigured component generators are exposing an instance of the `teleport-component-generator` package. Naturally, you can install the package and build your own generator with [plugins](/component-generators/plugins.html), [mappings](/component-generators/mappings.html) and [postprocessors](/component-generators/post-processors.html).

Let's configure a `React` component generator that uses `styled-components` and formats all code with `prettier`:

First install the dependencies:
```
npm install @teleporthq/teleport-component-generator
npm install @teleporthq/teleport-plugin-react-base-component
npm install @teleporthq/teleport-plugin-react-styled-components
npm install @teleporthq/teleport-plugin-import-statements
npm install @teleporthq/teleport-postprocessor-prettier-js
```

:::tip
`teleport-plugin-import-statements` will handle all the import statements that need to be generated, both from local dependencies as well as project or lib dependencies
:::

Then, we import all dependencies and we create the component generator, using the factory, a named export from the module:

```javascript
import ComponentGenerator from '@teleporthq/teleport-component-generator'
import reactPlugin from '@teleporthq/teleport-plugin-react-base-component'
import styledComponentsPlugin from '@teleporthq/teleport-plugin-react-styled-components'
import importStatementsPlugin from '@teleporthq/teleport-plugin-import-statements'
import prettierJS from '@teleporthq/teleport-postprocessor-prettier-js'

const generator = ComponentGenerator.createComponentGenerator()
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
generator.addPlugin(styledComponentsPlugin)
generator.addPlugin(importStatementsPlugin)
```

:::warning
The plugins are called in the exact order in which they are added. The `import` statements plugins hence should be the last one added, to take into consideration all the dependencies added by all the previous plugins. Also the framework base component should naturally be the first one added, since it is generating the initial chunks in the pipeline.
:::

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
import styled from 'styled-components'

const ReactComponent = (props) => {
  return (
    <div>
      <Text>World!</Text>
    </div>
  )
}

export default ReactComponent

const Text = styled.span`
  color: red;
`
```

Here's the full running code snippet:
```javascript
import { createComponentGenerator } from '@teleporthq/teleport-component-generator'
import reactPlugin from '@teleporthq/teleport-plugin-react-base-component'
import styledComponentsPlugin from '@teleporthq/teleport-plugin-react-styled-components'
import importStatementsPlugin from '@teleporthq/teleport-plugin-import-statements'
import prettierJS from '@teleporthq/teleport-postprocessor-prettier-js'

import reactMapping from './react-mapping.json'
import uidl from './uidl.json'

const generator = createComponentGenerator()

generator.addMapping(reactMapping)

generator.addPlugin(reactPlugin)
generator.addPlugin(styledComponentsPlugin)
generator.addPlugin(importStatementsPlugin)

generator.addPostProcessor(prettierJS)

const run = async() => {
  const result = await generator.generateComponent(uidl)
  console.log(result.files[0])
}
```

If you want to play with a **similar configuration**, you can [check out this codesandbox](https://codesandbox.io/s/custom-component-generator-7sej7), where you can edit the input UIDL, the mapping, or just try out different plugins and post-processors.
