# Quick Setup

The quickest way to get started with our ecosystem is to try out one of our pre-configured **component generators**.

Install one of the following:
```bash
npm install @teleporthq/teleport-component-generator-react
npm install @teleporthq/teleport-component-generator-vue
```
or using yarn:
```bash
yarn add @teleporthq/teleport-component-generator-react
yarn add @teleporthq/teleport-component-generator-vue
```

For generating a component, you have to start from a **component UIDL**:

```json
{
  "name": "My First Component",
  "node": {
    "type": "element",
    "content": {
      "elementType": "text",
      "children": [
        {
          "type": "static",
          "content": "Hello World!"
        }
      ]
    }
  }
}
```

:::tip
You can play with the UIDL structure on the [online REPL](https://repl.teleporthq.io/)
:::

To use the pre-configured component generators you have to create your generator instance and call the `generateComponent` *async* function:

```javascript
import ReactGenerator from '@teleporthq/teleport-component-generator-react'

const uidl = { ... } // your sample here
const generator = ReactGenerator.createReactComponentGenerator();
const { files } = await generator.generateComponent(uidl)
console.log(files[0].content)
```
The console output will be something like:
```javascript
import React from 'react'

const MyFirstComponent = (props) => {
  return <span>Hello World!</span>
}

export default MyFirstComponent
```

For the `Vue` generator, just switch the package:
```javascript
import VueGenerator from '@teleporthq/teleport-component-generator-vue'

const uidl = { ... } // your sample here
const generator = VueGenerator.createVueComponentGenerator();
const { files } = await generator.generateComponent(uidl)
console.log(files[0].content)
```
The console output will be something like:
```vue
<template>
  <span>Hello World!</span>
</template>

<script>
export default {
  name: 'MyFirstComponent',
}
</script>
```
