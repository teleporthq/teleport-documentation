# Examples

## Basic Component

The **Component UIDL** starts from two mandatory fields: `name` and `node`. The complete specification is available as a [JSON Schema](/uidl/support.html#json-schema) or as [TypeScript interfaces](/uidl/support.html#typescript-interfaces). The `node` is a recursive structure that represents the entire tree-like structure of a component. You can read more about the [different types of nodes](/uidl/#basic-node-types) in the corresponding UIDL section.

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
          "content": "Hello, World!"
        }
      ]
    }
  }
}
```

When put through a **React** code generator, this will yield:
```javascript
import React from 'react'

const Message = (props) => {
  return <span>Hello, World!</span>
}

export default Message
```

If you want to build your own UIDL starting from this examples and see the output in real time, check out the online [component playground](https://repl.teleporthq.io/).

:::tip
The UIDL element types (ex: container, text, image, etc.) are platform indepentent and can represent any kind of interface, not being locked-in for web interfaces.
:::

## Referencing Dynamic Values

Dynamic data can be of [multiple types](/uidl/#basic-node-types). If you want to pass a dynamic property to a component, you will define that property (ex: `title`) in `propDefinitions`. Once `title` is defined, it can be referenced in a `dynamic` node anywhere inside the component.

```json{4-6,22-23}
{
  "name": "Hello World Component",
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
      "children": [
        {
          "type": "element",
          "content": {
            "elementType": "text",
            "children": [
              {
                "type": "dynamic",
                "content": {
                  "referenceType": "prop",
                  "id": "title"
                }
              },
              {
                "type": "static",
                "content": "Hello, World!"
              }
            ]
          }
        }
      ]
    }
  }
}
```

While building custom UIDLs, keep in mind that all types of nodes have the same structure with `type` and `content`.

## Passing Props from the Parent

A parent component can pass prop data to a child via the **attrs** property of the component UIDL. In this example, from the parent's point of view, the prop value is `static`. Only the child will treat it as a `dynamic` value in this case.

```json
{
  "$schema": "https://docs.teleporthq.io/uidl-schema/v1/component.json",
  "name": "ParentComponent",
  "node": {
    "type": "element",
    "content": {
      "elementType": "AuthorCard",
      "dependency": {
        "type": "local"
      },
      "attrs": {
        "authorName": {
          "type": "static",
          "content": "test"
        },
        "authorImage": {
          "type": "static",
          "content": "/path-to-user-image.jpg"
        }
      }
    }
  }
}
```

Notice that we had to specify a `dependency` in order to generate the import statement. You can [read more about dependencies here](/uidl/#component-element-with-dependencies).

The component receiving the props is defined below:

```json{4-11,24-28,34-38}
{
  "$schema": "https://docs.teleporthq.io/uidl-schema/v1/component.json",
  "name": "AuthorCard",
  "propDefinitions": {
    "authorName": {
      "type": "string",
      "defaultValue": "Emma"
    },
    "authorImage": {
      "type": "string"
    }
  },
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
                "type": "dynamic",
                "content": {
                  "referenceType": "prop",
                  "id": "authorImage"
                }
              }
            }
          }
        },
        {
          "type": "dynamic",
          "content": {
            "referenceType": "prop",
            "id": "authorName"
          }
        }
      ]
    }
  }
}
```

Looking back at the two examples with the author card, notice that the names `authorName` and `authorImage` are passed as `attributes` in the parent and used as `props` in the child.

## Styling Elements

Each element node has a style property where styles are defined. Because styles can be `static` or `dynamic`, the same syntax applies:

```json{12-19}
{
  "name": "Simple Component",
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
              "margin": {
                "type": "static",
                "content": "10px"
              },
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

Visit [the style section](/uidl#with-styles-and-attributes) from the UIDL page to get a better understanding of how styles work.

## Project UIDL

Project UIDLs tend to be quite big since they define a couple of components + the logic for routing and generating pages.

One example of project UIDL can be found [here](https://github.com/teleporthq/teleport-code-generators/blob/master/examples/uidl-samples/project.json)

