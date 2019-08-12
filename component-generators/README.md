# Core

A component generator converts a [ComponentUIDL](/uidl/#component-uidl) into a list of in-memory files. The core package that implements the component generation algorithm is `teleport-component-generator`. This section of the docs is dedicated to explaining the internals of the component generation process and specifying [the interface](/component-generators/#api-reference) of the component generator object.

The first major area of responsability is the generation of one single component entity, with all the complexities and particularities that it presents.

Component generation could be broken into the following high level steps:
- creation of the generator function via a factory provided by our packages or by user configuration
- passing of json data to the created function
- component uidl data parsing and validation
- generator function execution

The execution of the component generator function can be borken down into the following steps:
- resolving generic UIDL content into framework specific content
- creation of a basic component entity in the form of one or more abstract syntax trees
- running a sequence of additional operation over the abstract syntax trees from the base component
- gathering all results and returning the standard format of a component generator (presented below)

## Data Driven Code Generation

This section outlines the various steps needed to generate the code of one component. This section is theoretical, and will explain into more detail how the generator function looks and how it works.

The [UIDL](/#uidl) is the intermediary data format we use to represent structure and behavior for our components. This universal language has no opinion on how the structure and behaviour need to look like in actual code.

A component generator takes in the data (the UIDL) for a component and outputs the resulting code as a string.

```js
udilDataContent => someStringResult;
```

In other words, component generators are functions that receive UIDL data and returns code content. But this is not enough. We need a bit more information about the component apart from the genereated code. What happens if:

- we have additional files or assets that need to be shipped with the main code file
- we have dependecies, like additional components to exist and be importable when this component is used in a project.
- the code of the component is split into multiple files for some reason

In order to accomodate the situations mentioned above, we have expanded the component function to return a set of "files" which contain not just the content but also the intended type of content that they contain, as well as a set of additional instructions to be used by a project generator or whoever uses the component generator.

```ts
type GenerateComponentFunction = (
  input: Record<string, unknown>,
  options: GeneratorOptions
) => Promise<CompiledComponent>;

interface CompiledComponent {
  files: GeneratedFile[];
  dependencies: Record<string, string>;
}

interface GeneratedFile {
  name: string;
  fileType: string;
  content: string;
}
```

With this interface, a component generator needs to implement the `GenerateComponentFunction` and return an array of "files" - which are basically just JSON object with a type, name and string content - and a map of dependecies (for now) which indicate what external dependecies we need to handle.

A very useless but valid generator would be the one below:

```typescript
const generateComponent: GenerateComponentFunction = async (
  input,
  options = {}
): Promise<CompiledComponent> => {
  return {
    files: [],
    dependencies: {},
  }
}
```

If we would like to return a **Hello World** javascript file without anything we could:

```typescript
const generateComponent: GenerateComponentFunction = async (
  input,
  options = {}
): Promise<CompiledComponent> => {
  return {
    files: [{
      name: "HelloWorldFile"
      fileType: "js"
      content: "console.log("hello world");"
    }],
    dependencies: {},
  }
}
```

Now, if we would want to actual generate real components, we would need to read the input data.

Let's consider the following basic UIDL structure of a component:

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

We would like to generate something similar to the React or Vue components seen in the generated content tabs of the example above.

While this example is simple, it allows us to introduce the concept of mapping of content. Let's consider the following question:

**How do we decide to transform `text` to `span`?**

Well, for a React or Vue application, this would be a span. But for a react-native app, this would be a `<Text>` tag. We need to specify a way to map universal node types into framework (and language) specific content.

This requirement introduces the next utility in the component generator toolbelt: the `resolver` which need to be configured to transform generic types into framework specific types.

The resolver also transforms attributes of generic nodes:

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

As you can see in the example above, the `url` attribute becomes a `src` for the web. It might not be the case for other environments, or maybe it could become a srcset with a default src via a plugin.

## Validation

> UNDER CONSTRUCTION

## Resolver

The concept of element mapping comes from the need to generate code specific to components of various frameworks from uidl definitions that are generic.

For example, a static text content needs to be wrapped into a `<span>` in react or vue, but for react native we need a `<Text>` tag.

In a similar way, a link between two pages the application is defined by a NextLink, a RouterLink, or simple `<a>` depending on the implementaion of the target generators.

One of the first steps we need to supply to a generator is a way of mapping generic nodes to specific implmenetation dependend ones.

Mappings are added to the core resolver class instances. This object is used by the pipeline plugins to transform uidl chunk from generic to framework specific.

```js
const myMapping = {
  elements: {
    container: {
      elementType: "div"
    }
  },
  events: {
    click: "onclick"
  }
};

const resolver = new Resolver();
resolver.addMapping(myMapping);

const resolvedUIDL = resolver.resolveUIDL(
  {
    node: {
      type: "element",
      content: {
        elementType: "container"
      }
    }
  },
  options
);
```

In the above exmaple, the `resolvedUIDL` would contain a "div" node, not a "container".

The above definition will be used to map any container element type to a div, and any click event listener to a onclick bind. This is a basic html mapping.

We provide a set of defaults mappings to be used for generators. The most common html, react and vue mappings are availalbe for use.

Mappings merge together, so we can add multiple mappings with even overlapping content. This allows us to use default mappings as well as overwrite and add more specific mapping functionality.

```js
const resolver = new Resolver()
resolver.addMapping(htmlMapping as Mapping)
resolver.addMapping(reactMapping as Mapping)
resolver.addMapping(customMapping)
```

In the example above, both `htmlMapping` and `reactMapping` define the `click` event, but since react is the last one that is registered, it will overwrite the existing html mapping. The generator using the resolver will now transform `click` events to the specific `onClick` binding.

## Component Assembly Line

The component assembly line is the abstraction that is used to allow plugging in more functionality on top of a base component. The base component is enhanced, plugin by plugin with additoinal code and features.

Good examples of plugins are additions of prop definitons, typescript interfaces, style flavors or extractors to css files. This also allows plugin authors to build more specialised plugins in the future and opens the generator to community driven extensibility.

An assembly line can be configured like in the example below:

```ts
const assemblyLine = new AssemblyLine();
assemblyLine.addPlugin(reactComponentPlugin);
assemblyLine.addPlugin(stylePlugin);
assemblyLine.addPlugin(jsxPropTypesPlugin);
assemblyLine.addPlugin(importStatementsPlugin);
```

Each `plugin` takes in the UIDL and the content created by plugins before it in the assemblyLine and is expected to return the UIDL and a updated structure which will be passed to the next plugin in line.

The process is similar to the unix pipeing of command like `ls -la | grep my-project` where we list the current directory and pass in the entire list to the next command which will search only for the relevant lines that interest us.

In a similar way, a `jsxPropTypesPlugin` will only work on some parts of the base component generated by `reactComponentPlugin`.

```ts
const { chunks, externalDependencies } = await assemblyLine.run(resolvedUIDL);
```

The assembly line runs and returns chunks and external dependency information. The chunks will be used by the builder to generate code. The dependencies will be used by project generators or something else to assure that other modules needed by this component are provided.

Plugins are used in the Assembly Line. They enhance the basic component that is generated by the first plugin in the chain. The first plugin in the chain should be the main skeleton generator on top of which the other plugins start running.

The plugin structure implements the following interface:

```ts
interface ComponentStructure {
  chunks: ChunkDefinition[];
  uidl: ComponentUIDL;
  dependencies: Record<string, ComponentDependency>;
}

type ComponentPlugin = (
  structure: ComponentStructure
) => Promise<ComponentStructure>;
```

A plugin basically is a async function that takes in the component structure and is expected to make alterations to it. When it finished, the resolved content is taken by the assembly line and passed to the next plugin in line.

## Builder and the Link Process

The assembly line and the plugins running inside it work with syntax trees and other intermediary structures. They don't work with code. At the end of the pipeline we get these syntax trees in entities called `chunks`. These chunks are of type:

```ts
interface ChunkDefinition {
  type: string;
  name: string;
  meta?: any;
  content: ChunkContent;
  linkAfter: string[];
}

// TO BE REVISED
type ChunkContent = string | any | any[];
```

The chunk content is subject to change and become better defined in the comming updates. The idea of chunks is that they will be consumed by syntax tree to code constructors based on the type of chunk.

For example, we expect the javascript chunk type to contain content which the babel javascript code generator can handle. This content happens to be a syntax tree object.

After the assembly line has finihsed running, we get the resulting chunks. These chunks are then transformed into string content representing the code of the component.

```ts
const { chunks, externalDependencies } = await assemblyLine.run(resolvedUIDL);

const chunksLinker = new Builder();
const jsCode = chunksLinker.link(chunks.default);
const file = createFile(fileName, FILE_TYPE.JS, jsCode);
```

The code above instantiates a builder which will get the default chunk from the assembly line and generate the code for it.

We know the name default and the fact that this will be a javascript code because we configured the assemblyLine and the plugins to generate this kind of content.

The name `default` and the fact that this is `javascript` are not general. They are a particular case of react component generator. If we would generate vue, we would have to know about other chunk names, not just the default.

## Post Processing

## Internal Structures

> UNDER CONSTRUCTION

### ASTs - Building with Babel Types

### HAST - Representing HTML

### JSS - Compiling Style Sheets

## API Reference

> UNDER CONSTRUCTION

#### generateComponent

#### linkCodeChunks

#### resolveElement

#### addMapping

#### addPlugin

#### addPostProcessor