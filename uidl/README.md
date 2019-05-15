# One language for every UI

From the beginning we wanted to create an universal format that can describe all the possible scenarios in a given user interface. The same universal format would help us generate the same visual interface with various tools and frameworks, allowing us to transition from one output type to another. A JSON based document is the obvious choice as it allows us to manipulate the data with no effort at all. Although at the beginning, the role of the UIDL seemed to be limited to describing the UI elements and their relationship, we are now confident that we can use it also to describe: user interactions, flows and events, more complicated UI patterns based on component architectures and dynamic data driven applications.

TODO: UIDL - naming explanation

Modern web interfaces use atomic building blocks commonly referred to as **components**. Our philosophy for generating websites is to ensure that the codebase you end up with is as close as possible, if not even better than a codebase that is 100% build by humans. There are two types of UIDL structures we will talk about. **Component UIDL**s define a single UI component. They contain most of the UIDL details. The **Project UIDL** is represented by a collection of components and some extra information about the project. Understanding the core elements of the component UIDL is the key to understanding how we represent user interfaces in the **JSON format**.

## Component UIDL

A single component is represented like a recursive structure. You can pretty much see the correlation between the **UIDL** and the **HTML** document from the beginning. The advantage of keeping the information in a JSON format, rather than XML, is that we can easily extend the structure with additional sub-structures which are not relevant from a visual perspective. We will see that later when we talk about conditional rendering and state logic. Also, JSON manipulation is significantly easier in the realm of JavaScript. As you can see from the example below, a component makes sense by reading the JSON document. As we will go over the separate parts and subsections in the entire spec, you will notice that the UIDL is also constructed as a human readable document.

```json
{
  "$schema": "https://raw.githubusercontent.com/teleporthq/uidl-definitions/master/component.json",
  "name": "Message",
  "content": {
    "type": "container",
    "key": "message",
    "children": [
      {
        "type": "textblock",
        "key": "text",
        "children": ["Hello World"]
      },
      {
        "type": "button",
        "key": "button",
        "children": ["Click me!"]
      }
    ]
  }
}
```

### Root Level

The most basic UIDL component requires a just a few **fields** at the root level and a single node inside the `content` field:

- `$schema` - **url** pointing to the exact version of the component UIDL schema
- `name` - **unique string** name identifier of the component. The name becomes more relevant in the project UIDL and also serves as the generated component name by default.
- `content` - recursive **object** structure. starts from a single **root node** that becomes the root node of the component (see [Content Node](TODO: link) for more details)
- `meta` - optional **object**, containing dynamic values, also used at other levels throughout the UIDL

```json
{
  "$schema": "https://raw.githubusercontent.com/teleporthq/uidl-definitions/master/component.json",
  "name": "Message",
  "content": {
    "type": "text",
    "key": "message",
    "children": ["Hello World!!"]
  },
  "meta": {
    "options": "yes"
  }
}
```

### Props (def, using)

### State Definitions?

### Content Node

As a **recursive** structure, the content nodes defines the entire content of the component. Based on the content node, we generate the `JSX`/`HTML` for the corresponding target as well as `JavaScript` code that either computes some values or defines some constraints (ex: `PropTypes`)

```json
{ 
  "content": {
  "type": "container",
  "key": "message",
  "attrs": {
    "data-attr": "test"
  },
  "children": [{
    "type": "textblock",
    "key": "text",
    "style": {
      "color": "purple",
      "fontSize": "18px"
    },
    "children": ["Hello World"]
  },{
    "type": "button",
    "key": "button",
    "children": ["Click me!"]
  }]
}
```

Inside `content` we have two **mandatory** fields:

- `type` - a **string** representing the **abstract** node type (see [Node Types](TODO: link) below)
- `key` - a **unique string** identifier across the entire component. This field will alows us to generate a unique class name for styling purposes and will be used internally for referencing this particular node.

We also have the possibility to define additional information for each content node:

- `children` - **array** of children node. The nodes can be of type `content` as a recursive structure or can be simple text elements represented as **strings** (which will be translated into text nodes inside HTML)
- `attrs` - an **object** of `key`-`value` pairs representing all the **attributes** for the current node (ex: image/link url, input name, etc.)
- `style` - an **object** representing all the **style** rules that will be applied to this specific node
- `states` - an **array** of possible content that is conditioned by a **state value** (see the [State](TODO: link) section below)
- `events` - an object of type `key`-`object` where each `key` is an event and each `object` is the event handler definition (see the [Events](TODO: link) section below)
- `repeat` - an alternative to **children**, an object representing a single **content node**, which will be rendered inside a **repeat loop** (ex: lists) based on some given data sources
- `dependency` - an **object** representing the definition of a node dependency. Needed when a component is used inside another one or when an external dependency is introduced in the project (ex: external component from npm)

The complete content node definition in `TypeScript`:

```typescript
export interface ContentNode {
  type: string
  key: string
  states?: Array<StateBranch>
  repeat?: RepeatDefinition
  dependency?: ComponentDependency
  style?: Record<string, any>
  attrs?: Record<string, any>
  events?: EventDefinitions
  children?: Array<ContentNode | string>
}
```

### Node Types

For storing the node information we decided to use **abstract** node types (ex: text, image, link) and not the standard `HTML` tags (ex: span, img, a). Our initial idea is to build code generation tools for the web, but we want to make sure our solution is scalable for mobile and other native interfaces. Hence, our decision to work with abstract types. This does not apply only to the node types, but also to common attributes and other substructures of the UIDL. All in all, you won't find platform specific information in the component UIDLs. The only noteworthy exception is the **styling** objects, which are a 1:1 mapping of the standard style object in JavaScript. Here, we're counting on the similarities between the mobile and web platforms in terms of styling elements.

### Attributes

### Style

### State (def, conditional render, using)

### Events

### Dependencies

### Repeat

## Project UIDL

### Globals

### Root Node

### Routing

## JSON Schema

Our UIDL format is enforced by [JSON Schema], an open format which allows us to add constraints, rules and types on our UIDL objects. Based on the JSON schemas, we are able to perform structural and type validation for both the component and the project UIDLs. Each UIDL has a `$schema` reference at the root level, based on which we perform the validation. The advantage on using the JSON Schema format is that we can easily keep all the different versions of the UIDL schemas, allowing us to maintain a backwords compatibility in terms of uidl validation and code generation.

You can find here the corresponding JSON Schema objects for the component and for the project UIDLs here:

- [Component UIDL]
- [Project UIDL]

## TypeScript Interfaces

Through our writing we will reference the **TypeScript** interfaces that are used extensively in representing the UIDLs. TypeScript is a great fit for building our generators because it allows us to easily map the constraints of the UIDL into typed interfaces. We encourage everyone who wishes to create new plugins and/or generators based on our architecture and on the UIDL format, to work with TypeScript to take full advantage of our format and data structures.

## Limitations and future explorations
