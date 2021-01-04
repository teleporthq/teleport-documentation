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

### Static Value

Static node types are static values which are meant to be treated as strings or numbers
to be passed on by the code generators as they are.

```typescript
interface UIDLStaticValue {
  type: "static";
  content: string | number | boolean;
}
```

The `height: 100px` style value is a good example of a static value. Also, the content of the `text` element is `Hello World`, as a static string.

```json{7-10,15-18}
{
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
  type: "dynamic";
  content: {
    referenceType: "prop" | "state" | "local" | "attr" | "children" | "token";
    id: string;
  };
}
```

In this case, the content can have the following fields:

- `referenceType` - Identifies the type of dynamic reference (ex: 'prop', 'state', 'local', 'attr', 'children', 'token')
- `id` - Identifies a specific value from the dynamic object (ex: 'isVisible', 'title')

:::tip
The `id` field supports the dot notation, ex: 'user.name'
:::

Such dynamic values are usually declared at the component level root. Check [prop definitions](/uidl#prop-definitions) and [state definitions](/uidl#state-definitions) for that.

An example of using a dynamic `prop` in an attribute:

```json{4-6,15-19}
{
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
  type: "element";
  content: {
    elementType: string;
    semanticType?: string;
    name?: string;
    key?: string; // internal usage
    dependency?: UIDLDependency;
    style?: UIDLStyleDefinitions;
    attrs?: Record<string, UIDLAttributeValue>;
    events?: UIDLEventDefinitions;
    abilities?: {
      link?: UIDLLinkNode;
    };
    referencedStyles?: UIDLReferencedStyles;
    children?: UIDLNode[];
    selfClosing?: boolean;
    ignore?: boolean;
  };
}
```

In this case, the content can have the following fields:

- `elementType` - the type of the abstract element (ex: 'container', 'text', 'image', etc.)
- `name` - each element can have a custom name. As a fallback the elementType is used.
- `dependency` - adds information about the element if it is a custom component or something used from an external package
- `style` - defines the visual aspect of the element, with css-like properties. Each key is the name of the attribute, each value is of type `static`, `dynamic`.
- `attrs` - defines any properties/attributes added on this element. For custom elements, the attributes will be translated into dynamic values inside. Each key is the
- `events` - defines a list of instructions that can be added on event handlers. This is an experimental feature and has limited capabilities for now.
- `children` - is the array of `UIDLNode` objects that this element surrounds. Using this field, we ensure the tree-like structure of the entire component.
- `referencedStyles` - is used to refer to styles from project-style sheet or defining media styles for a node.

This is how you define an image `element`:

```json
{
  "type": "element",
  "content": {
    "elementType": "image",
    "attrs": {
      "url": "path/to/avatar.jpg"
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
import React from "react";

const ImageElement = (props) => {
  return (
    <div>
      <img src="path/to/avatar/url" />
    </div>
  );
};

export default ImageElement;
```

### Conditional Node

This node should be used when an UIDLNode should be rendered inside a conditional expression (ex: v-if in Vue).

```typescript
interface UIDLConditionalNode {
  type: "conditional";
  content: {
    node: UIDLNode;
    reference: UIDLDynamicReference;
    value?: string | number | boolean;
    condition?: {
      conditions: Array<{
        operation: string;
        operand?: string | boolean | number;
      }>;
      matchingCriteria?: string;
    };
  };
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
reference > 3 && reference <= 5;
```

In the following example, you can see a conditional node, based on the `true`/`false` value of a `state` key.

```json
{
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
  type: "repeat";
  content: {
    node: UIDLNode;
    dataSource: UIDLAttributeValue;
    meta?: {
      useIndex?: boolean;
      iteratorName?: string;
      dataSourceIdentifier?: string;
    };
  };
}
```

The content allows the following fields:

- `node` - the UIDLNode that will be placed inside the repeater
- `dataSource` - the array of values over which the code iterates
- `meta.useIndex` - when this flag is present, the iteration declares the `index` value as the position of the element in the array
- `meta.iteratorName` - a string which overrides the name of the variable inside the iteration (default: `item`)
- `meta.dataSourceIdentifier` - a string which identifies the local data source variable inside the component. This is used only when you are passing a static array as a dataSource and the framework needs to declare that array as a local variable (ex: Vue will place this on the `data` object)

A repeat over an array retrieved from `props`:

```json
{
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
  <div>
    <span v-for="(item, index) in items" :key="index">{{ item }}</span>
  </div>
</template>

<script>
export default {
  name: "MyRepeatElement",
  props: {
    items: {
      type: Array,
      default: ["hello", "world"],
    },
  },
};
</script>
```

### Slot Node

:::warning
This is not stable yet and is subject to changes in the near future
:::

This node type is exclusive to arrays of children in element nodes. Because a component can have some children declared inline and other children passed from parents we need a way to specify where these parent-provided-children get to be placed in relation with the other elements of the component. The concept of **slot** from web components allows us to do exactly this.

```json
{
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

### Styles

Styles can be defined on [Eelement Node](http://localhost:8080/uidl/structure.html#element-node) using `style` and
`referencedStyles` attributes. `style` attribute is used to define styles that directly reflects on the node. Style can be defined using static node.

```json
{
  "type": "element",
  "content": {
    "elementType": "container",
    "children": [
      {
        "type": "element",
        "content": {
          "elementType": "text",
          "style": {
            "width": "100px"
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
```

### Referenced Styles

`referencedStyles` are used for defining `media` and `element-state` using `inlined`. Styles from `project-referenced` are refered using
`project-referenced` flag. More details on how to use and refer styles are mentioned [here](https://github.com/teleporthq/teleport-code-generators/pull/444).

```typescript
type UIDLReferencedStyles = Record<string, UIDLElementNodeReferenceStyles>;

type UIDLElementNodeReferenceStyles =
  | UIDLElementNodeProjectReferencedStyle
  | UIDLElementNodeInlineReferencedStyle;
```

`Element Node` with `referencedStyles` looks like

```json
<!-- other UIDLElementNode fields --->
"referencedStyles": {
  "5ed0d3daf36df4da926078e": {
    "id": "5ed0d3daf36df4da926078e",
    "type": "style-map",
    "content": {
      "mapType": "project-referenced",
      "referenceId": "5ed0d4923de727e93cb4efa2"
    }
  },
  "5ecfa0d2f9f29ada8482ff03": {
    "id": "5ecfa0d2f9f29ada8482ff03",
    "type": "style-map",
    "content": {
      "mapType": "inlined",
      "conditions": [
        { "conditionType": "element-state", "content": "hover"}
      ],
      "styles": {
        "color": { "type": "static", "content": "red"},
        "border-bottom": "3px solid red",
        "padding-bottom": "7px"
      }
    }
  }
}
<!-- other UIDLElementNode fields --->
```

## Component UIDL

When building modern interfaces, a component represents a reusable piece of code. In the realm of the UIDL, a component represents a set of tree-like UIDLNodes together with some top level declarations used to identify the dynamic data inside.

```typescript
interface ComponentUIDL {
  name: string;
  node: UIDLElementNode;
  styleSetDefinitions?: Record<string, UIDLStyleSetDefinition>;
  propDefinitions?: Record<string, UIDLPropDefinition>;
  importDefinitions?: Record<string, UIDLExternalDependency>;
  peerDefinitions?: Record<string, UIDLPeerDependency>;
  stateDefinitions?: Record<string, UIDLStateDefinition>;
  outputOptions?: UIDLComponentOutputOptions;
  designLanguage?: {
    tokens?: UIDLDesignTokens;
  };
  seo?: UIDLComponentSEO;
}
```

The **fields** that can be used at the component root level:

- `name` - **unique string** name identifier of the component. The name is used for generating the component name, but can also represent the file name when used in a project generation process.
- `node` - Any instance of `UIDLNode` which becomes the **root node** of the rendered component.

Additionally, depending on the context you can use one of the following **optional fields**:

- `meta` - **object** containing dynamic values, also used at other levels throughout the UIDL.
- `stateDefinitions` - **object** containing information used to define the state of a component.
  For more details about props definition structure check below the [State Definitions](/uidl/#state-definitions) dedicated section.
- `propDefinitions` - **object** with information used as a content for the component.
  For more details about state definition structure check below the [Prop Definitions](/uidl/#prop-definitions) dedicated section.

A basic component consisting of a single `text` element with some static value inside can be represented like this:

```json
{
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
  name: "Message",
};
</script>
```

A more **complex example** of a UIDL component would be this `AuthorCard`:

```json
{
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

- `type` - the **type** of the prop (ex: string, number, boolean, object, etc.)
- `defaultValue` - the value used by the components when the prop is not provided
- `isRequired` - a **boolean** flag indicating if the prop is marked as required in the generated code
- `meta` - additional **info** which can be sent to the component generators

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

Components can declare state keys as internal values, which are encapsulated inside them. There are a couple of _experimental_ instructions which can be used to declare changes to the state at runtime. State values are regularly used to render `conditional` or `repeat` nodes.

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

- `type` - represents the **type** of the state (ex: string, number, boolean, object, array etc.)
- `defaultValue` - is the initial state value
- `values` - is an array of exact values that the state can be in. This is used for now when defining the routing for projects. In the future, this would be the basis for defining more complex state transitions.

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

## Root Component UIDL

:::tip
Root Component is a extended version of `Component UIDL`. All fields in `Component UIDL` are supported
in `RootComponent UIDL`.
:::

The additational fields are used to define global styles and dependencies.
These can be directly used in project or just some supported dependencies.

### Peer Definitions

When we start using external dependeencies in our project. They might need a additational packages to work with,
which wee might not directly use in the project. Let's see a example.

Let us consider we are using components from [chakra-ui](https://chakra-ui.com/docs/getting-started). We define
these components in UIDL using

```json
{
  "name": "Simple Component",
  "node": {
    "type": "element",
    "content": {
      "elementType": "component",
      "semanticType": "Button",
      "attrs": {
        "colorScheme": "blue"
      },
      "dependency": {
        "type": "package",
        "path": "@chakra-ui/core",
        "version": "0.8.0",
        "meta": {
          "namedImport": true
        }
      },
      "children": ["Button"]
    }
  }
}
```

When we run these through code-generators, the generators will auto-import `@chakra-ui/core` and add them to `package.json` at the end.

But `@chakra-ui/core` needs `@emotion/core`, `@emotion/styled` and `emotion-theming` to work. These are pseudo
dependencies which are not directly used in the project. But we need them for the project to work.

So, we need to define them under `root` using `peerDeefinitions`

```json
<!-- other Project UIDL fields --->
"root": {
  "peerDefinitions":{
    "@emotion/core":{
      "type":"package",
      "path":"@emotion/core",
      "version":"^10.0.34"
    },
    "@emotion/styled":{
      "type":"package",
      "path":"@emotion/styled",
      "version":"^10.0.27"
    },
    "emotion-theming":{
      "type":"package",
      "path":"emotion-theming",
      "version":"^10.0.27"
    }
  }
}
<!-- other Project UIDL fields --->
```

These `peerDefinitions` are collected and added to `package.json` at the end. Typescript interface for Peer Definition.

```typescript
interface UIDLPeerDependency {
  type: "package";
  path: string;
  version: string;
}
```

### Import Definitions

These are used to define global imports that are needed for the proejct to work. For example, let's consider we are using
[antd](https://ant.design/) design system components in our proejct. But `antd` exports the `css` for all the components
seperately. The stylesheet need to be added globally for the components to render properly.

```json
{
  "type": "element",
  "content": {
    "semanticType": "Button",
    "elementType": "component",
    "attrs": {
      "type": "primary"
    },
    "children": ["Button from ANTD"],
    "dependency": {
      "type": "package",
      "path": "antd",
      "version": "4.5.4",
      "meta": {
        "namedImport": true
      }
    }
  }
}
```

Let's consider we are using `Button` as below. But now we need a global import of `antd` for it to work. These
global imports need to be defined under `root`.

```json
<!-- other Project UIDL fields --->
"root": {
  "importDefinitions": {
    "antdCSS": {
      "type": "package",
      "path": "antd/dist/antd.css",
      "version": "^4.5.1",
      "meta": {
        "importJustPath": true
      }
    }
  }
}
<!-- other Project UIDL fields --->
```

`importJustPath` is used to just add the import, but omit them adding to `package.json` field. A use case, is
adding `dependencies` from CDN. We don't need any additational info of CDN in `package.json`.

```typescript
interface UIDLExternalDependency {
  type: "library" | "package";
  path: string;
  version: string;
  meta?: {
    namedImport?: boolean;
    originalName?: string;
    importJustPath?: boolean;
    useAsReference?: boolean;
  };
}
```

### Style Set Definitions

These are used to define project style sheet. These are converted into `css` or `css-modules` or `styled-components` depending on the
target style variation selected in project geeneerators.

```json
<!-- other Project UIDL fields --->
"root": {
  "styleSetDefinitions": {
    "1234": {
      "id": "1234",
      "name": "secondaryButton",
      "type": "reusable-project-style-map",
      "content": {
        "background": "red",
        "width": "auto",
        "color": "#fff",
        "border": "1px solid #fff"
      }
    }
  }
}
<!-- other Project UIDL fields --->
```

Style Set Definitions can be extended with conditions for media-queries and selectors like `hover`, `active` etc.

```json
<!-- other Prject UIDL fields --->
"root": {
  "styleSetDefinitions": {
    "1234": {
        "id": "1234",
        "name": "primary-button",
        "type": "reusable-project-style-map",
        "conditions": [
          { "type": "screen-size",
            "meta": {
              "maxWidth": 991
            },
            "content": {
              "background": "blue"
            }
          }
        ],
        "content": {
          "background": "green",
          "width": "auto",
          "color": "#fff",
          "border": "1px solid #fff"
        }
      },
  }
}
<!-- other Prject UIDL fields --->
```

We can use tokens too, while defining `styleSetDefinitions`. Let's see the tokens more details in the coming
[steps](http://localhost:8080/uidl/structure.html#tokens).

```typescript
interface UIDLStyleSetDefinition {
  id: string;
  name: string;
  type: "reusable-project-style-map";
  conditions?: UIDLStyleSetConditions[];
  content: Record<string, UIDLStaticValue | UIDLStyleSetTokenReference>;
}

type UIDLStyleSetConditions =
  | UIDLStyleSetMediaCondition
  | UIDLStyleSetStateCondition;

interface UIDLStyleSetMediaCondition {
  type: "screen-size";
  content: Record<string, UIDLStaticValue | UIDLStyleSetTokenReference>;
  meta: {
    maxWidth: number;
    minWidth?: number;
    maxHeight?: number;
    minHeight?: number;
  };
}

interface UIDLStyleSetStateCondition {
  type: "element-state";
  meta: {
    state: "hover" | "active" | "focus" | "disabled";
  };
  content: Record<string, UIDLStaticValue | UIDLStyleSetTokenReference>;
}
```

## Design Language

From [v0.15.0](https://github.com/teleporthq/teleport-code-generators/releases/tag/v0.15.0) we introduced a new field
`designLanguage` in **Project UIDL**. We plan to bring all the design realted meta data for projects under this attribute.
Right now we can define `tokens` which can be used in styles to refer some constant values. Design-language is alo defined
under [RootComponentUIDL](http://localhost:8080/uidl/structure.html#root-component-uidl).

### Tokens

Tokens are used to store all the design related constants in a single place. They are converted into `css-variables`
in plain css flavours and in `css-in-js` they converted into constants. Tokens in **Project UIDL** can be defined under **root**.

```json
<!-- other fields of ProjectUIDL --->
"root": {
  "designLanguage": {
    "tokens": {
      "blue-500": {
        "type": "static",
        "content": "#9999ff"
      },
      "blue-600": {
        "type": "static",
        "content": "#6b7db3"
      },
      "red-500": {
        "type": "static",
        "content": "#ff9999"
      },
      "red-300": "#b36b6b",
      "font-size": 45
    }
  }
}
<!-- other fields of ProjectUIDL --->
```

Tokens can be defined using a simple `static-node`. Once defined they can be used for `styles`, `media-queries`, `project-style-sheet`.

```typescript
type UIDLDesignTokens = Record<string, UIDLStaticValue>;
```

When referring to a token, We need to use `UIDLStyleSetTokenReference`.

```typescript
interface UIDLStyleSetTokenReference {
  type: "dynamic";
  content: {
    referenceType: "token";
    id: string;
  };
}
```

Using tokens in UIDL, The `id` refers to the token-name or the `attr` id of the token. For more details on tokens, pleasee
refer the pull-request on [GitHub](https://github.com/teleporthq/teleport-code-generators/pull/503).

```json
"background": {
  "type": "dynamic",
  "content": {
    "referenceType": "token",
    "id": "blue-600"
  }
}
```

## Project UIDL

A project UIDL is a collection of component UIDLs with some additional information on top, related to global settings, assets and routing.

```typescript
interface ProjectUIDL {
  name: string;
  globals: {
    settings: {
      title: string;
      language: string;
    };
    meta: Array<Record<string, string>>;
    assets: GlobalAsset[];
    manifest?: WebManifest;
  };
  root: ComponentUIDL;
  components?: Record<string, ComponentUIDL>;
}
```

The UIDL structure for a project can have the following **fields** at the root level:

- `name` - **unique string** name identifier of the project.
- `root` - **object** with the component UIDL that is considered to be the entry point in your project.
  For more details check [Root Node](/uidl/#routing)
- `globals` - **object** with project related information. Inside this object, you can nest objects with
  settings, manifest, assets, global variables or other meta information related to your project.
  For more details check [Globals](/uidl/#globals)
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

- for `next.js`, you would get a \<Link\> with a dependency to `next/link`
- for `vue`, you would get a `<router-link>`
- and so on ...

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
