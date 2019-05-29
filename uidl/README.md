# Standard

## Main concepts

The UIDL format is written in a human-readable JSON file. As the format evolves, we noticed that it was harder and harder to assume what type of content we attributed on each key in the UIDL JSON. So, we saw a strong need to know what kind of value we are assinging to a key in order to eliminate guesswork.

Having this in mind we defined the concept of [**node type**](/uidl/#basic-node-types), which tells us what type of object to expect to read on a given key in UIDL.

For example, when working with styles, we might need to know up front if the `width` of a component has a static value or a dynamic one. And if it is dynamic, where is the dynamic content coming from and how do we read such dynamic content.

Another example is with component children. We need to be able to specify that at a certain position in the children array of one component we have slot. Or a simple static string, which does not need to be resolved as another component but rather as a simple static value.

If we were to define an interface that every node specialise, it would look like this:

```ts
interface UIDLAbstractNode {
  type:
    | "static"
    | "dynamic"
    | "element"
    | "repeat"
    | "conditional"
    | "slot"
    | "nested-style";
  content: Record<string, unknown>;
}
```

Currently, we support the following node types. Below you can have an overview
of them. More details about them you can find in the [Basic node types section](/uidl/#basic-node-types).
Note that not all node types are intended to be used everywhere. Some types are
restricted to certain keys in the componnet UIDL.

- [static](/uidl#static-node-type) type: for static string or number values. Used
  when setting a value to a attribute, style, or as a text node child to a component.
  By default, component uidl keys that support static content will support plain text
  to be set to them.
- [dynamic](/uidl#dynamic-node-type) type: for referencing content that can change
  over time or that is passed down from parent components as parameters/properties to
  the component.
- [element](/uidl#element-node-type) type: for describing an actual presentation
  entity that gets to be visible on the screen and have more meaning that just a string.
- [repeat](/uidl#repeat-node-type) and [conditional](/uidl#conditional-node-type)
  types: for more advanced behaviors when adding elements in the structure of a component.
  They allow showing some content only if a condition is valid and can map over arrays of
  data and add the same element for each data entity in the array.
- [slot](/uidl#slot-node-type) type: defines where the content that is passed down as
  children from a parent component gets to be placed inside the current component.
- [nested-style](/uidl#nested-style-node-type) type: defines a style exclusive piece
  of content used right now by media queries. Contains objects that define the styles to
  be applied only if that query is active.

### Assignments

When assigning a node to a key, we need to declare the node type and pass in content
specific to that node type in the content key:

```json
{
  "type": "static",
  "content": "Hello World!!"
}
```

A simple hello world message could be written like this:

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

\_Note: In this docs you might find examples where `"children": ["Hello World!!"]`.
This is a valid representation also because we automatically assume static content
for strings in styles, attributes and children assignments`

### Basic node types

The types of nodes are limited, not simply string in the end, as we know ahead of
time all the node types we have.

The content is different for each type of node, but always the same structure is
used for a given type. This means that all nodes of type A will have the same content
structure.

Below we define the common node types. These types can appear in many places in the
Component UIDL when we are assigning content to attributes, styles, children and
more.

#### Static node type

Static node types are static values which are meant to be treated as strings or numbers
to be passed on by the code generators as they are.

The `height: 100px` style value is a good example of a static value.

```json
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
          "content": "Hello World!!"
        }
      ]
    }
  }
}
```

#### Dynamic node type

Content that changes over time or based on the attributes passed to one component
by its parent is declared as dynamic.

A dynamic node needs to indicate the source of data to be read and passed to the
key that uses it. Check [prop definitions](/uidl#prop-definitions) and [state
definitions](/uidl#state-definitions) out to see how dynamic data is declared
in components. The definitions for these areas can be read by dynamic nodes.

A good example of this type of node is the name and photo of a person in a card
component. Card components appear often in contact lists, in about us pages, at
the end of blog posts and so on. When we want to pass in dynamic data to the
card component and have it render 10 different persons, we provide the person
avatar and name as attributes to the card component and reference the values
pass to each instance via the dynamic node content.
Note that the declaration below describes the value passed in as attributes in
the parent component.

```json
{
  "type": "dynamic",
  "content": {
    "referenceType": "prop",
    "id": "authorAvatarUrl"
  }
}
```

The image that renders the avatar could use this node like so:

```json
{
  "$schema": "https://docs.teleporthq.io/uidl-schema/v1/component.json",
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

We also currently support a legacy notation for the dynamic props in the form of
`$props.authorAvatarUrl` but we plan to stop supporting it in future versions.

#### Element node type

An image is an element. We expect the generator to know how to produce a image in
the final generated code. A custom component like a author card is also an element,
and we expect the generator to find a definition for the author card and genereate
code for it, or import it from a third party code package.

When we assign a new instance of a component to a key, we define the type of element
via an element node. This node appears most of the time in children arrays, or as the
main node of a ComponentUIDL.

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

The element node can contain other element nodes as children, and the `elementType`
must exist either in the mappings used by the generator or it should be defined as
one of the components of the project.

The example below is a component node which is of type element. The child of this
component node is also an element, the image of the author which is dynamically
set based on the way `AuthorCard` is used.

```json
{
  "$schema": "https://docs.teleporthq.io/uidl-schema/v1/component.json",
  "name": "ImageElement",
  "node": {
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
}
```

The element node has the most functionality packed into it. Elements can
have styles, attributes, npm/local dependencies and event handlers.

The full interface for this node is:

```ts
interface UIDLElement {
  elementType: string;
  name?: string;
  dependency?: ComponentDependency;
  style?: UIDLStyleDefinitions;
  attrs?: Record<string, UIDLAttributeValue>;
  events?: EventDefinitions;
  children?: UIDLNode[];
}
```

Meaning of fields:

- `elementType` is a required string that indicates what tag or instance of
  component we will create when the generator builds the code for this component.
- `name` MUST be unique in the entire project or component that is being generated.
  It is used to define names of variables, exports and so on.
- `dependency` is a optional object that specifies if the given component comes
  with any type of dependency from npm or local.
- `style` defines the visual aspect of the element, with css-like properties
- `attrs` defines any properties that this instance of the element receives.
  Components declare prop definitions to receive props, and attrs is the object thru
  which parent components send values into those props.
- `events` defines any interaction handlers between the component and the user.
  For now this is a primitive implementation with limited capabilities.
- `children` is the array of nodes that this element instantiates. These could
  all node types that are assignable to children (right now the nested style is the
  exception).

It makes much more sense to talk about the way these keys are used in the context
of a component, as components have local data (state), props and other entities
that make the element node shine. Check the [component element usage](/uidl#component-element-usage)
to see how these are used on a component.

- TODO resolver / mapping influence of `elementType`

#### Conditional node type

In order to provide conditional rendering functionality for situation where
a component has different "states" in which it can be rendered, we introduced
the concept of a **conditional**. This type of node will render different content
based on a simple condition, like the value of a boolean variable being true or
false.

The conditional node needs to read a dynamic content via the `reference`, check
if the equality between the `reference` and the `value` key is set to true,
and if it is, it will render the content from `node`.

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

#### Repeat node type

A common pattern in front end development is mapping multiple entities of the same
type, usually provided in a data array, to a set of identical or similar visual
elements.

The repeat node type allows us to do exactly this. It allows us to take in a
dynamic or static data node and for each item that data source, render a element
node type, preferably with different attributes, as rendering the same thing
over and over again would not make much sense.

The repeat node needs to read a dynamic content via the `dataSource`, iterate
it and expose a new variable named `meta.iteratorName` which is availalbe for
addressing like any other dynamic node. This local data is then used by the
element nodes and presented accordingly.

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

#### Slot node type

This node type is exclusive to arrays of children in element nodes. Because a component
can have some children declared inline and other children passed from parents we need
a way to specify where these parent-provided-children get to be placed in relation with
the other elements of the component. The concept of **slot** from web components allows
us to do exactly this.

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

#### Nested-style node type

Styles are css-like properties that are applied directly on the root node of a component.
With this approach alone we cannot define responsive styles. In order to do so we allowed
one key in the [style](/uidl#style) object to be the media query string and the
content to be a set of css-like properties that only get applied when that media query
is active.

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

## Deep dive

Modern web interfaces are build with atomic building blocks commonly referred to as
**components**. A component is a composed of on one or more elements and/or other components.

Our philosophy for generating websites is to ensure that the codebase you end up with
is as close as possible, if not even better than a codebase that is 100% build by humans.
There are two types of UIDL structures we will talk about. The first one is the structure
for **component UIDL** which defines a single UI component. This structure contains most
of the component details. The second one is the structure for **project UIDL** which
represents a collection of components plus some extra information specific about the project.
Understanding the core elements of the component UIDL is the key to understanding how we
represent user interfaces in the **JSON format**.

Component UIDLs, like any JSONs, are made up of key value pairs. Because we have
many keys that receive the same type of values, we defined the concept of `Node Types`
which describe what type of values we assign.

### Component UIDL

A single component is represented like a recursive structure. You can pretty much see
the correlation between the **UIDL** and the **HTML** document from the beginning.

The advantage of keeping the information in a JSON format, rather than XML, is that we
can easily extend the structure with additional sub-structures which are not relevant
from a visual perspective. Also, JSON manipulation is significantly easier in the realm
of JavaScript.

As you can see from the example below, a component can be easily understand just by
reading the JSON document. As we will go over the separate parts and subsections in the
entire spec, you will notice that the UIDL is also constructed as a human readable document.

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

The most basic UIDL component requires a just a few **fields** at the root level:

- `name` - **unique string** name identifier of the component. The name is required as it
  becomes more relevant in the project UIDL and it also serves as the generated component name by default.
- `node` - recursive **object** structure. The UIDL for a components starts from a single **root node**
  which becomes the root node of the component.

Additionally, depending on the context you can use one of the following **optional fields**:

- `$schema` - **url** pointing to the exact version of the component UIDL schema.
- `meta` - **object** containing dynamic values, also used at other levels throughout the UIDL.
- `stateDefinitions` - **object** containing information used to define the state of a component.
  For more details about props definition structure check below the [State Definitions](/uidl#state-definitions) dedicated section.
- `propDefinitions` - **object** with information used as a content for the component.
  For more details about state definition structure check below the [Prop Definitions](/uidl#prop-definitions) dedicated section.

A more **complex example** of a UIDL component would be this:

```json
{
  "$schema": "https://raw.githubusercontent.com/teleporthq/teleport-code-generators/master/src/uidl-definitions/schemas/component.json",
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

As you can see, a component can describe an entire tree of subcomponents
that work together to build the user interface required for a given functionality.

For more information about the types of children and values a component
can have, check the [node types](/uidl/#basic-node-types) section of the docs.

#### Prop Definitions

Component properties act like the public api of each component. With props, parrent components
can pass down data and preferences to their children. A component must define its own props
via prop definitions in order to be able to use them.

The UIDL prop definitions are structured inside an object where the key-value pairs have the following pattern:

- the key is a string
- the value is an object that must contain a `type` key and with one of enum values:
  "string", "boolean", "number", "array", "func", "object", or "children". Optionally,
  this object can contain **defaultValue** and some **meta** information which are also objects.

For better clarification check below the `patternProperties` we are currently using
and one sample example on how to define your own propDefinitions.

```json
{
  "patternProperties"": {
    ".*": {
      "type": "object",
      "additionalProperties": false,
      "required": ["type"],
      "properties": {
        "type": {
          "type": "string",
          "enum": ["string", "boolean", "number", "array", "func", "object", "children"]
        },
        "defaultValue": {},
        "meta": {"type": "object"}
      }
    }
}
```

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

#### State Definitions

Components which might have local data which changes after they have rendered on the screen
need to declare what data they want to keep locally. In order to alter local data, components
must declare state entities, as in stateful data which can change without any new thing happening
in the parent componets.

The UIDL state definitions are structured inside an object where the key-value pairs have the
following pattern:

- the key is a string
- the value is an object that must contain a `type` key and with one of enum values:
  "string", "boolean", "number", "array", "func", "object", or "children".
  Optionally, this object can contain **defaultValue** and some **meta** information
  which are also objects.

State definitions are identical at this point with [prop definitions](/uidl#prop-definitions).
Sample example of stateDefinitions:

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

#### Component Content Node

Each component UIDL must contain a single content node. This node describes what
this component looks like when it is displayed.

There are many types of values that we can assign to the node, but the most common
node type used by components is the [element type](/uidl#element-node-type).

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

#### Examples

##### Component element with styles and attributes

Components end up having element nodes as leafs most of the time.
These elements have styles, attributes, events and dependencies.

Styles and attributes can receive very similar values. They both
accept nodes of type `static` and `dynamic` while the
`nested-styles` node type is exclusive to style.

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

##### Component element with dependencies

Simply adding primitive elements like containers and images is not enough to build
more complex visual user interfaces. Sometimes we might want to rely on a third party
package for a specific component, or we want to define the components ourselves and
reuse them in multple place.

In order to do so we have the **dependency** key option which will allow us to specify what
import statements need to appear in the component that uses instances of a given element.

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

### Project UIDL

A project written with UIDL is represented by an object containing specific information
i.e. name of the project, meta information, asset storage information, components, etc.

The most basic UIDL structure for a project requires the following **fields** at the root level:

- `name` - **unique string** name identifier of the project.
- `root` - **object** with the component UIDL that is considered to be the entry point in your project.
  For more details check [Root Node](/uidl#root-node)
- `globals` - **object** with project related information. Inside this object, you can nest objects with
  settings, manifest, assets, global variables or other meta information related to your project.
  For more details check [Globals](/uidl#globals)
- `$schema` - **url** pointing to the exact version of the project UIDL schema.

Additionally, depending on the type of project you want to build you can use one of the following **optional fields**:

- `components` - **object** containing other UIDL components. The components should be defined according
  to the pattern defined below.

```json
{
  <!---other UIDL fields -->
  "components": {
  "type": "object",
  "patternProperties": {
    ".*": {
      "$ref": "component.json"
    }
  }
  <!--- other UIDL fields -->
}
```

#### Globals

The **globals** node contains information specific to your project.
The following fields must be configured inside this object:

- `settings` - **object** containing details like **language**, **title**, **paths**, etc.

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

- `manifest` - **object** contaning the information you would usually put in any web app manifest i.e. its name, author, icon, description.

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

- `variables` - **object** containing any other variables you want to consider inside
  your project. The variables are defined as key-value pairs inside the object.

```json
{
  <!---other UIDL fields -->
  "variables": {
    "primaryColor": "#822CEC",
    "secondaryColor": "#414141",
    "spacing": "10px"
  }
  <!---other UIDL fields -->
}
```

#### Root Node

In the **root** field, you should configure the UIDL component that you considered to be the entry point in your project.
The component must have the structure as described in [Component UIDL](/uidl#component-uidl).
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

Note that you can also refer to your already built component like this:

```json
{
  <!---other UIDL fields -->
  "root": {
    "$ref": "component.json"
  }
  <!---other UIDL fields -->
}
```

#### Routing

Navigation from one page (or state) to another in a application depends on the
framework running the app. On the web, the most basic apprpach would be to
hardcode links as `<a/>` tags. However, apps generated with react router, next,
vue or nuxt will benefit from a different kind of routing element.

Since each framework implements its own tricks for navigation, we defined the `nav-link`
special element type which is tranformed by the code generators into the coresponding
framework specific element.

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

When using this element and pointing to a state that the route node has defined,
the teleport code generator will make the corresponding link between navlink and what
would perfrom the navigation for that particular framework.
