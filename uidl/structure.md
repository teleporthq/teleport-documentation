# Structure

## Node Types

The building block of the UIDL structure is the `UIDLNode`. Each node has the same structure:

```
{
  type: string
  content: any
}
```

Available types are: `static`, `dynamic`, `element`, `conditional`, `repeat`, `slot` and `nested-style`.

As the **UIDL** is being traversed, the nodes are interpreted and translated into lines of code:

- `static` nodes become plain text
- `dynamic` nodes become expressions inside templates
- `element` nodes become tags
- and so on ...

The content represents all the information that the current `node` holds. You can read more about the structure of each node below. We will refer to a `UIDLNode` whenever a field in the UIDL allows any node type as a value.

Note that not all node types are intended to be used everywhere. Some types are restricted to certain keys in the UIDL. Please consult the table below for a full understanding of the usage:

|                  | Root Node | Element Children | Attribute | Style | Conditional Ref | Repeat Source |
| ---------------- | --------- | ---------------- | --------- | ----- | --------------- | ------------- |
| Static Value     | x         | x                | x         | x     |                 | x             |
| Dynamic Ref      | x         | x                | x         | x     | x               | x             |
| Element Node     | x         | x                |           |       |                 |               |
| Conditional Node | x         | x                |           |       |                 |               |
| Repeat Node      | x         | x                |           |       |                 |               |
| Slot Node        |           | x                |           |       |                 |               |
| NestedStyle Node |           |                  |           | x     |                 |               |

### Static Value

Static node types are static values which are meant to be treated as strings or numbers
to be passed on by the code generators as they are.

```typescript
interface UIDLStaticValue {
  type: 'static'
  content: string | number | boolean
}
```

The `height: 100px` style value is a good example of a static value. Also, the content of the `text` element is `Hello World`, as a static string.

```json{7-10,15-18}
{
  "$schema": "https://docs.teleporthq.io/uidl-schema/v1/component.json",
  "name": "Message",
  "node": {
    "type": "element",
    "style": {
      "height": {
        "type": "static",
        "content": "100px"
      }
    },
    "content": {
      "elementType": "text",
      "children": [
        {
          "type": "static",
          "content": "Hello World"
        }
      ]
    }
  }
}
```

### Dynamic Reference

A dynamic node can be used when you need to reference a value that will be supplied at runtime by the generated code. You can think of component internal `state` or component `props`, but also `local` variables.

```typescript
interface UIDLDynamicReference {
  type: 'dynamic'
  content: {
    referenceType: 'prop' | 'state' | 'local'
    id: string
  }
}
```

In this case, the content can have the following fields:

- `referenceType` - Identifies the type of dynamic reference (ex: 'prop', 'state', 'local')
- `id` - Identifies a specific value from the dynamic object (ex: 'isVisible', 'title')

:::tip
The `id` field supports the dot notation, ex: 'user.name'
:::

Such dynamic values are usually declared at the component level root. Check [prop definitions](/uidl#prop-definitions) and [state definitions](/uidl#state-definitions) for that.

An example of using a dynamic `prop` in an attribute:

```json{4-6,15-19}
{
  "$schema": "https://docs.teleporthq.io/uidl-schema/v1/component.json",
  "propDefinitions": {
    "authorAvatarUrl": {
      "type": "string"
    }
  },
  "name": "ImageElement",
  "node": {
    "type": "element",
    "content": {
      "elementType": "image",
      "attrs": {
        "url": {
          "type": "dynamic",
          "content": {
            "referenceType": "prop",
            "id": "authorAvatarUrl"
          }
        }
      }
    }
  }
}
```

### Element Node

When you want to represent a visual element (ex: input, image), you can use an UIDLElementNode. The generators will take these elements and will map them to the specific platform (ex: `container` will become `div`, `image` will become `img`).

```typescript
interface UIDLElementNode {
  type: 'element'
  content: {
    elementType: string
    name?: string
    dependency?: ComponentDependency
    style?: Record<string, UIDLDynamicReference | UIDLStaticValue | UIDLNestedStyleDeclaration>
    attrs?: Record<string, UIDLDynamicReference | UIDLStaticValue>
    events?: Record<string, EventHandlerStatement[]>
    children?: UIDLNode[]
  }
}
```

In this case, the content can have the following fields:

- `elementType` - the type of the abstract element (ex: 'container', 'text', 'image', etc.)
- `name` - each element can have a custom name. As a fallback the elementType is used.
- `dependency` - adds information about the element if it is a custom component or something used from an external package
- `style` - defines the visual aspect of the element, with css-like properties. Each key is the name of the attribute, each value is of type `static`, `dynamic` or `nested-style`. The UIDLNestedStyleNode is specific here because of the way in which styles are parsed by the generators.
- `attrs` - defines any properties/attributes added on this element. For custom elements, the attributes will be translated into dynamic values inside. Each key is the
- `events` - defines a list of instructions that can be added on event handlers. This is an experimental feature and has limited capabilities for now.
- `children` - is the array of `UIDLNode` objects that this element surrounds. Using this field, we ensure the tree-like structure of the entire component.

This is how you define an image `element`:

```json
{
  "type": "element",
  "content": {
    "elementType": "image",
    "attrs": {
      "src": "path/to/avatar.jpg"
    }
  }
}
```

The element node can contain other element nodes as children, and the `elementType` must exist either in the mappings used by the generator or it should be defined as one of the components of the project.

:::tip
Notice the composition pattern between two elements.
:::

```json{7-7,12-12}
{
  "$schema": "https://docs.teleporthq.io/uidl-schema/v1/component.json",
  "name": "ImageElement",
  "node": {
    "type": "element",
    "content": {
      "elementType": "container",
      "children": [
        {
          "type": "element",
          "content": {
            "elementType": "image",
            "attrs": {
              "url": {
                "type": "static",
                "content": "path/to/avatar/url"
              }
            }
          }
        }
      ]
    }
  }
}
```

When run through the `React` generator, this will yield:

```javascript
import React from 'react'

const ImageElement = props => {
  return (
    <div>
      <img src="path/to/avatar/url" />
    </div>
  )
}

export default ImageElement
```

### Conditional Node

This node should be used when an UIDLNode should be rendered inside a conditional expression (ex: v-if in Vue).

```typescript
interface UIDLConditionalNode {
  type: 'conditional'
  content: {
    node: UIDLNode
    reference: UIDLDynamicReference
    value?: string | number | boolean
    condition?: {
      conditions: Array<{
        operation: string
        operand?: string | boolean | number
      }>
      matchingCriteria?: string
    }
  }
}
```

The content node contains:

- `node` - the instance of UIDLNode which is placed behind the conditional
- `reference` - a UIDLDynamicReference value based on which the rendering condition is working
- `value` - the value of the dynamic reference for which the `node` is displayed
- `condition` - the explicit conditional expression based on which the `node` is displayed

The conditional node will either use the `value` and make an equality (===) between the `reference` and the `value`, or can use the `condition`, which allows for more complex conditionals, using all the available binary and unary operators.

A condition like:

```json
{
  "conditions": [
    { "operation": ">", "operand": 3 },
    { "operation": "<=", "operand": 5 }
  ],
  "matchingCriteria": "all"
}
```

will render into:

```javascript
reference > 3 && reference <= 5
```

In the following example, you can see a conditional node, based on the `true`/`false` value of a `state` key.

```json
{
  "$schema": "https://docs.teleporthq.io/uidl-schema/v1/component.json",
  "name": "MyConditionalElement",
  "stateDefinitions": {
    "isVisible": {
      "type": "boolean",
      "defaultValue": true
    }
  },
  "node": {
    "type": "element",
    "content": {
      "elementType": "div",
      "children": [
        {
          "type": "conditional",
          "content": {
            "reference": {
              "type": "dynamic",
              "content": {
                "referenceType": "state",
                "id": "isVisible"
              }
            },
            "value": true,
            "node": {
              "type": "element",
              "content": {
                "elementType": "text",
                "children": [
                  {
                    "type": "static",
                    "content": "Now you see me!"
                  }
                ]
              }
            }
          }
        }
      ]
    }
  }
}
```

### Repeat Node

A common pattern in front end development is mapping multiple entities of the same type, usually provided in a data array, to a set of identical or similar visual elements.

This node allows you to represent a node inside a repetitive structure (ex: v-for in Vue).

```typescript
interface UIDLRepeatNode {
  type: 'repeat'
  content: {
    node: UIDLNode
    dataSource: UIDLAttributeValue
    meta?: {
      useIndex?: boolean
      iteratorName?: string
      dataSourceIdentifier?: string
    }
  }
}
```

The content allows the following fields:
* `node` - the UIDLNode that will be placed inside the repeater
* `dataSource` - the array of values over which the code iterates
* `meta.useIndex` - when this flag is present, the iteration declares the `index` value as the position of the element in the array
* `meta.iteratorName` - a string which overrides the name of the variable inside the iteration (default: `item`)
* `meta.dataSourceIdentifier` - a string which identifies the local data source variable inside the component. This is used only when you are passing a static array as a dataSource and the framework needs to declare that array as a local variable (ex: Vue will place this on the `data` object)

A repeat over an array retrieved from `props`:

```json
{
  "$schema": "https://docs.teleporthq.io/uidl-schema/v1/component.json",
  "name": "MyRepeatElement",
  "propDefinitions": {
    "items": {
      "type": "array",
      "defaultValue": ["hello", "world"]
    }
  },
  "node": {
    "type": "element",
    "content": {
      "elementType": "div",
      "children": [
        {
          "type": "repeat",
          "content": {
            "node": {
              "type": "element",
              "content": {
                "elementType": "text",
                "children": [
                  {
                    "type": "dynamic",
                    "content": {
                      "referenceType": "local",
                      "id": "item"
                    }
                  }
                ]
              }
            },
            "dataSource": {
              "type": "dynamic",
              "content": {
                "referenceType": "prop",
                "id": "items"
              }
            },
            "meta": {
              "useIndex": true,
              "iteratorName": "item"
            }
          }
        }
      ]
    }
  }
}
```

This will yield the following component when using the `Vue` generator:
```vue
<template>
  <div><span v-for="(item, index) in items" :key="index">{{item}}</span></div>
</template>

<script>
export default {
  name: 'MyRepeatElement',
  props: {
    items: {
      type: Array,
      default: ['hello', 'world'],
    },
  },
}
</script>
```

### Slot Node

:::warning
This is not stable yet and is subject to changes in the near future
:::

This node type is exclusive to arrays of children in element nodes. Because a component can have some children declared inline and other children passed from parents we need a way to specify where these parent-provided-children get to be placed in relation with the other elements of the component. The concept of **slot** from web components allows us to do exactly this.

```json
{
  "$schema": "https://docs.teleporthq.io/uidl-schema/v1/component.json",
  "name": "MySlotElement",
  "node": {
    "type": "element",
    "content": {
      "elementType": "div",
      "children": [
        {
          "type": "static",
          "content": "static header"
        },
        {
          "type": "slot",
          "content": {}
        },
        {
          "type": "static",
          "content": "static footer"
        }
      ]
    }
  }
}
```

We plan to handle name slots in the future, but for now only the default slot is supported.

### Nested-style Node

:::warning
This is not stable yet and is subject to changes in the near future
:::

Styles are css-like properties that are applied directly on the root node of a component. With this approach alone you cannot define responsive styles. Using the `nested-style` node, you can define a sub-section instead of a single `static` / `dynamic` value for a give style key.

```json
{
  "$schema": "https://docs.teleporthq.io/uidl-schema/v1/component.json",
  "name": "MyNestedStyleElement",
  "node": {
    "type": "element",
    "content": {
      "elementType": "div",
      "children": [
        {
          "type": "element",
          "content": {
            "elementType": "div",
            "style": {
              "width": { "type": "static", "content": "100px" },
              "@media(max-width: 320px)": {
                "type": "nested-style",
                "content": {
                  "width": { "type": "static", "content": "10px" }
                }
              }
            }
          }
        }
      ]
    }
  }
}
```

## Component UIDL

When building modern interfaces, a component represents a reusable piece of code. In the realm of the UIDL, a component represents a set of tree-like UIDLNodes together with some top level declarations used to identify the dynamic data inside.

```typescript
interface ComponentUIDL {
  $schema?: string
  name: string
  node: UIDLNode
  meta?: Record<string, any>
  propDefinitions?: Record<string, UIDLPropDefinition>
  stateDefinitions?: Record<string, UIDLStateDefinition>
}
```

The **fields** that can be used at the component root level:

- `name` - **unique string** name identifier of the component. The name is used for generating the component name, but can also represent the file name when used in a project generation process.
- `node` - Any instance of `UIDLNode` which becomes the **root node** of the rendered component.

Additionally, depending on the context you can use one of the following **optional fields**:

- `$schema` - **url** pointing to the exact version of the component [UIDL schema](/uidl/support.html#json-schema).
- `meta` - **object** containing dynamic values, also used at other levels throughout the UIDL.
- `stateDefinitions` - **object** containing information used to define the state of a component.
  For more details about props definition structure check below the [State Definitions](/uidl/#state-definitions) dedicated section.
- `propDefinitions` - **object** with information used as a content for the component.
  For more details about state definition structure check below the [Prop Definitions](/uidl/#prop-definitions) dedicated section.

A basic component consisting of a single `text` element with some static value inside can be represented like this:

```json
{
  "$schema": "https://docs.teleporthq.io/uidl-schema/v1/component.json",
  "name": "Message",
  "node": {
    "type": "element",
    "content": {
      "elementType": "text",
      "children": [
        {
          "content": "Hello World!!",
          "type": "static"
        }
      ]
    }
  }
}
```

which would yield (in Vue):
```vue
<template>
  <span>Hello World!!</span>
</template>

<script>
export default {
  name: 'Message',
}
</script>
```

A more **complex example** of a UIDL component would be this `AuthorCard`:

```json
{
  "$schema": "https://docs.teleporthq.io/uidl-schema/v1/component.json",
  "name": "AuthorCard",
  "propDefinitions": {
    "title": {
      "type": "string",
      "defaultValue": "Hello"
    }
  },
  "node": {
    "type": "element",
    "content": {
      "elementType": "container",
      "attrs": {
        "data-static-attr": {
          "type": "static",
          "content": "test"
        },
        "data-dynamic-attr": {
          "type": "dynamic",
          "content": {
            "referenceType": "prop",
            "id": "title"
          }
        }
      },
      "children": [
        {
          "type": "element",
          "content": {
            "elementType": "text",
            "children": [
              {
                "type": "static",
                "content": "Hello World!"
              },
              {
                "type": "dynamic",
                "content": {
                  "referenceType": "prop",
                  "id": "title"
                }
              }
            ]
          }
        }
      ]
    }
  }
}
```

:::tip
As you can see, a component can describe an entire tree of subcomponents that work together to build the user interface required for a given functionality.
:::

:::tip
For more information about the types of children and values a component can have, check the [node types](/uidl/#node-types) section of the docs.
:::

### Prop Definitions

Component properties act like the public interface of each component. Using props, the parent component can pass any value to any of its children. A component must define its props via `propDefinitions` in order to be able to use them safely.

Each prop definition has to follow this interface:
```typescript
interface UIDLPropDefinition {
  type: string
  defaultValue?: string | number | boolean | ...
  isRequired?: boolean
  meta?: Record<string, any>
}
```

The UIDL prop definitions are structured in an object where the name of the `prop` is the `key` and the `value` is a `UIDLPropDefinition`. Inside the prop definition you can set:
* `type` - the **type** of the prop (ex: string, number, boolean, object, etc.)
* `defaultValue` - the value used by the components when the prop is not provided
* `isRequired` - a **boolean** flag indicating if the prop is marked as required in the generated code
* `meta` - additional **info** which can be sent to the component generators

Sample example of propDefinitions:

```json
{
  <!--- other UIDL fields -->
 "propDefinitions": {
    "title": {
      "type": "string",
      "defaultValue": "Hello"
    },
    "items": {
      "type": "array",
      "defaultValue": []
    },
    "isShareable": {
      "type": "boolean",
      "defaultValue": false
    },
    "isDisplayed": {
      "type": "boolean",
      "defaultValue": true
    }
  }
  <!--- other UIDL fields -->
}
```

### State Definitions

Components can declare state keys as internal values, which are encapsulated inside them. There are a couple of *experimental* instructions which can be used to declare changes to the state at runtime. State values are regularly used to render `conditional` or `repeat` nodes.

Similarly to [propDefinitions](/uidl/#prop-definitions), `stateDefinitions` is an object, where the `key` is the name of the `state` and the `value` is of type `UIDLStateDefinition`:

```typescript
interface UIDLStateDefinition {
  type: string
  defaultValue: string | number | boolean | ...
  values?: Array<{
    value: string | number | boolean
    meta?: { ... }
  }>
}
```

where:
* `type` - represents the **type** of the state (ex: string, number, boolean, object, array etc.)
* `defaultValue` - is the initial state value
* `values` - is an array of exact values that the state can be in. This is used for now when defining the routing for projects. In the future, this would be the basis for defining more complex state transitions.

A sample of stateDefinitions:

```json
{
  <!--- other UIDL fields -->
  "stateDefinitions": {
    "isVisible": {
      "type": "boolean",
      "defaultValue": true
    },
    "isShareable": {
      "type": "boolean",
      "defaultValue": false
    }
  }
  <!--- other UIDL fields -->
}
```

### Component Node

Each component UIDL must contain a single content `node`. This node describes what this component looks like when it is displayed. The **root node** is any element of type `UIDLNode`. Check [the table from the node types section](/uidl/#node-types) to understand which nodes can be used as the **root node**.

Here's an example where the **root node** is of type `element` and renders an `image` element:

```json
{
  <!---other UIDL fields -->
  "node": {
    "type": "element",
    "content": {
      "elementType": "image",
      <!--- other UIDL fields -->
    }
  }
  <!--- other UIDL fields -->
}
```

### Other examples

#### Assignments

When assigning a node to a key, we need to declare the node type and pass in content
specific to that node type in the content key:

```json
{
  "type": "static",
  "content": "Hello World!!"
}
```

A "hello world" message could be written like this:

```json
{
  "$schema": "https://docs.teleporthq.io/uidl-schema/v1/component.json",
  "name": "Message",
  "node": {
    "type": "element",
    "content": {
      "elementType": "text",
      "children": [
        {
          "type": "static",
          "content": "Hello World!!"
        }
      ]
    }
  }
}
```

:::tip
To write your UIDLs faster, you can also use something like: `"children": ["Hello World!!"]`. This is a valid representation also because the generators automatically assume static content for strings in styles, attributes and children assignments
:::

#### Component element with styles and attributes

Components end up having element nodes as leafs most of the time. These elements have styles, attributes, events and dependencies.

Styles and attributes can receive very similar values. They both accept nodes of type `static` and `dynamic` while the `nested-styles` node type is exclusive to style.

```json
{
  "$schema": "https://docs.teleporthq.io/uidl-schema/v1/component.json",
  "name": "ElementWithStylesAndAttributes",
  "propDefinitions": {
    "title": {
      "type": "string",
      "defaultValue": "my-value"
    }
  },
  "node": {
    "type": "element",
    "content": {
      "elementType": "div",
      "attrs": {
        "tab-index": {
          "type": "static",
          "content": "0"
        },
        "data-dynamic-attr": {
          "type": "dynamic",
          "content": {
            "referenceType": "prop",
            "id": "title"
          }
        }
      },
      "style": {
        "width": { "type": "static", "content": "100px" },
        "@media(max-width: 320px)": {
          "type": "nested-style",
          "content": {
            "width": { "type": "static", "content": "10px" }
          }
        }
      },
      "children": [
        {
          "type": "static",
          "content": "Hello"
        }
      ]
    }
  }
}
```

#### Component element with dependencies

Adding primitive elements like containers and images is not enough to build more complex visual user interfaces. Sometimes we might want to rely on a third party package for a specific component, or we want to define the components ourselves and reuse them in multple place.

In order to do so we have the **dependency** key option which will allow us to specify what import statements need to appear in the component that uses instances of a given element.

Each element node needs to include it's dependecy declaration for now.

```json
{
  "$schema": "https://docs.teleporthq.io/uidl-schema/v1/component.json",
  "name": "ElementWithDependecies",
  "node": {
    "type": "element",
    "content": {
      "elementType": "div",
      "children": [
        {
          "type": "element",
          "content": {
            "attrs": {
              "some-value": {
                "type": "static",
                "content": "1"
              }
            },
            "elementType": "ReactDatepicker",
            "dependency": {
              "type": "package",
              "path": "react-datepicker",
              "version": "1.0.2",
              "meta": {
                "namedImport": false
              }
            }
          }
        },
        {
          "type": "element",
          "content": {
            "attrs": {
              "authorName": {
                "type": "static",
                "content": "Emma"
              }
            },
            "elementType": "AuthorCard",
            "dependency": {
              "type": "local"
            }
          }
        }
      ]
    }
  }
}
```

## Project UIDL

A project UIDL is a collection of component UIDLs with some additional information on top, related to global settings, assets and routing.

```typescript
interface ProjectUIDL {
  $schema?: string
  name: string
  globals: {
    settings: {
      title: string
      language: string
    }
    meta: Array<Record<string, string>>
    assets: GlobalAsset[]
    manifest?: WebManifest
  }
  root: ComponentUIDL
  components?: Record<string, ComponentUIDL>
}
```

The UIDL structure for a project can have the following **fields** at the root level:

- `name` - **unique string** name identifier of the project.
- `root` - **object** with the component UIDL that is considered to be the entry point in your project.
  For more details check [Root Node](/uidl/#routing)
- `globals` - **object** with project related information. Inside this object, you can nest objects with
  settings, manifest, assets, global variables or other meta information related to your project.
  For more details check [Globals](/uidl/#globals)
- `$schema` - **url** pointing to the exact version of the project UIDL schema.
- `components` - **object** containing other UIDL components. The components should be defined according
  to the pattern defined below.

### Globals

The **globals** node contains information specific to your project. The following fields can be configured inside this object:

- `settings` - **object** containing global settings like: **language** and **title**.

```json
{
  <!---other UIDL fields -->
  "settings": {
    "language": "en",
    "title": "teleportHQ"
  }
  <!---other UIDL fields -->
}
```

- `assets` - **array** with objects containing the type of the asset
  ( e.g.: **style**, **script**, **icon**, **font** ) and the path to it.
  Check the sample below:

```json
{
  <!---other UIDL fields -->
  "assets": [
    {
      "type": "script",
      "content": "console.log('inline script')",
      "meta": {
        "target": "body"
      }
    },
    {
      "type": "font",
      "path": "https://fonts.googleapis.com/css?family=Roboto"
    }
  ]
  <!---other UIDL fields -->
}
```

- `meta` - **array** with objects containing any other information that
  is need by the project to run as desired. Here you can add the information
  you would normally have inside &#60;meta&#62; HTML tag, info like **description**,
  **keywords**, **viewport**, etc.

```json
{
  <!---other UIDL fields -->
  "meta" : [
    { "name": "description", "content": "Free Web tutorials" },
    { "name": "keywords", "content": "security" },
    { "name": "viewport", "content": "width=device-width, initial-scale=1.0" },
    { "property": "og:title", "content": "Free Web tutorials" },
  ],
  <!---other UIDL fields -->
}
```

The following fields are optional inside the **globals** object:

- `manifest` - **object** contaning the information for the webapp manifest file

```json
{
  <!---other UIDL fields -->
  "manifest": {
    "icons": [
      {
        "src": "/playground_assets/icons-192.png",
        "type": "image/png",
        "sizes": "192x192"
      },
      {
        "src": "/playground_assets/icons-512.png",
        "type": "image/png",
        "sizes": "512x512"
      }
    ],
    "theme_color": "#822CEC",
    "background_color": "#822CEC"
  }
  <!---other UIDL fields -->
}
```

### Routing

:::warning
Routing is still an experimental feature and might be subjected to change in the future
:::

In the **root** field, you configure the entry point of the project. At the moment, this is limited to defining the top level routing mechanism, but in the future this will allow you to describe different layouts for the entire application.

The value of the `root` is a [Component UIDL](/uidl#component-uidl).

Below is one sample example of how the root node can look like.

```json
{
  <!---other UIDL fields -->
  "root": {
    "name": "App",
    "stateDefinitions": {
      "route": {
        "type": "string",
        "defaultValue": "index",
        "values": [
          {
            "value": "index",
            "meta": {
              "path": "/",
              "componentName": "Home"
            }
          },
          {
            "value": "about",
            "meta": {
              "path": "/about",
              "componentName": "About"
            }
          },
          {
            "value": "contact-us",
            "meta": {
              "path": "/here-we-are",
              "componentName": "Us"
            }
          }
        ]
      }
    }
  <!---other UIDL fields -->
}
```

Navigation from one page (or state) to another in a application depends on the framework running the app. Modern frameworks implement client side routing via their own libraries.

Since each framework implements its own tricks for navigation, you can use an abstract `element` called `navlink`. This `navlink` is resolved based on the specific project flavor:
* for `next.js`, you would get a \<Link\> with a dependency to `next/link`
* for `vue`, you would get a `<router-link>`
* and so on ...

```json
{
  "type": "element",
  "content": {
    "elementType": "navlink",
    "attrs": {
      "transitionTo": {
        "type": "static",
        "content": "about"
      }
    },
    "children": [
      {
        "type": "static",
        "content": "About Page"
      }
    ]
  }
}
```

The value set on `transitionTo` is a `state` key which is specified in the `values` field in the `route` state in the project UIDL. The generators will translate that state key to the `url` in case of web based project generators.
