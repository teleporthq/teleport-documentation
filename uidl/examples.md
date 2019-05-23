# Examples

The current page illustrates some UIDL examples.

If you also want to build your own UIDL starting from this examples and maybe also see some React
and Vue code being generated ( with our [code generators](generators/) obviously! ) check this
[component playground](https://repl.teleporthq.io/).

### Most basic examples

#### Creating a "Hello, World!" Component

The most basic we can do is the classic "Hello, World!" example.

The UIDL contains specific component keys like: `name`, `node`, etc. A complete list of the keys
can be seen if you check the [TypeScript interfaces](/uidl/support.html#typescript-interfaces)
we are using.

Now, let's focus on the definition of `node`. It contains `type` and `content`. The value of the type
must be one of the following _static_, _dynamic_, _element_, _repeat_, _conditional_, _slot_, _nested-style_.
In this case, the type is element. Details about the other types and when to use them can be found
[here](/uidl/#basic-node-types). The `content` field contains relevant information about the element
we are creating i.e. `elementType` and the `children`. Inside the array of children, there is only
one child of a `static` type that contains the text `Hello, World!`

```json
{
  "$schema": "https://raw.githubusercontent.com/teleporthq/uidl-definitions/master/component.json",
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

Now let's complicate the example and add `propDefinitions`. Inside of it, we defined a
`title` key that is referenced in a node of `dynamic` type. Check below the UIDL and compare it
with the previous example.

```json
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

### Getting props from parents

A parent component can pass prop data to a child via the **attrs** property of the
component uidl. So the first step in passing props to children is to see how the parent
is able to send data down the tree.

```json
{
  "$schema": "https://raw.githubusercontent.com/teleporthq/uidl-definitions/master/component.json",
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

A simple parent component that simply passes data to a child looks like the example above.
Notice that we had to specify a `dependency` in order to correctly generate the import
statement.

The component receiving the props is next. In order to do something with the attribute
values that were sent we need to define them as props and reference them via dynamic
node values.

```json
{
  "$schema": "https://raw.githubusercontent.com/teleporthq/uidl-definitions/master/component.json",
  "name": "AuthorCard",
  "propDefinitions": {
    "authorName": {
      "type": "string",
      "defaultValue": "Emma"
    },
    "authorImage": {
      "type": "string",
      "defaultValue": "path/to/defualt/URL"
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

In the example above we have a new component, which has a container node, in which
we place one image that gets the url (src) set to whatever the parent has sent over
via attributes. In a similar way, we have just the plain text of the author name as
the second child of the container.

If we look at the two examples, the parent and the child author card, we notice that
the names `authorName` and `authorImage` are passed as attributes in the parent
and used as props in the child.

### Creating a component that has styles

Styling is achieved via the `style` tag on element nodes. In order to add styles to
a component, you must add a element to the node property of the ComponentUIDL. This
element will be the HTML/Primitive renderable entity which can receive styles.

The [Element Usage with Styles and Attributes](/uidl#with-styles-and-attributes) shows
how to add styles to a component.

### Project UIDL

One example of project UIDL can be found [here](https://github.com/teleporthq/teleport-code-generators/blob/master/examples/uidl-samples/project.json)
