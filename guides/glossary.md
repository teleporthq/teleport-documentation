# Glossary

**A**

---

**_Assembly Line_** - abstraction used to run all the plugins of a component generator in sequence.

**B**

---

**_Builder_** - part of the core component generator, converts all the code chunks (eg: AST, HAST) into strings.

**C**

---

**_Chunk_** - term used to define an isolated part of a future file. Each chunk is transformed into the string representation of the code by the builder, based on its type (eg: AST, HAST)

**_Component UIDL_** - the core element of the teleportHQ ecosystem, represents a single UI component with all its functionality and appearance.

**_Component Generator_** - transforms a Component UIDL into a number of code output files.

**_Conditional Node_** - [UIDL Node Type](/uidl/#node-types) used to represent conditional rendering inside a component.

**_Content Node_** - The content side of each [UIDLNode](/uidl/#node-types), stores all the information inside that node.

**D**

---

**_Dynamic Node_** - [UIDL Node Type](/uidl/#node-types) used to reference values that will supplied at run time by the generated code. Should be used to define the internal state of a component, props or local variables.

**E**

---

**_Element Node_** - [UIDL Node Type](/uidl/#node-types) used to represent visual elements and all their details.

**G**

---

**_Globals_** - node containing project specific information like general settings( i.e. language, title, etc ), specific asset information ( e.g.: style, script, icon, font, path ) or any other meta information needed for the project to run as wanted. Optionally, the node can contain information about the webapp manifest file.

**I**

---

**_Interface_** - refers to a **TypeScript Interface** that has the sole purpose of checking on the shape that values have.

**M**

---

**_Mapping_** - A json structure that translates UIDL elements, attributes and events into technology specific values. A mapping file has 3 areas, each for one of the sub-sections: `elements`, `attributes`, `events`. For example, the UIDL element types are not tied to any specific language, so the `html` mapping will convert `container` to `div`, `text` to `span` and so on. More details about mappings can be found [inside the `component generators` section](/component-generators/mappings.html).

**N**

---

**_Nested Style_** - [UIDL Node Type](/uidl/#node-types) used to define responsive or pseudo-selector styles. This is not stable yet and is subject to changes in the near future.

**_Node Types_** - defines the type used for any section or a sub-section in an UIDL component. The type of the node can be any of the following: static, dynamic, conditional, element, repeat, nested-style, slot.

**P**

---

**_Plugin_** - code that handles a specific part of the component generation process. Plugins are async functions that work around a fixed given `ComponentStructure` and output `Chunks`. Some examples are [here](/component-generators/plugins.html).

**_Project Generator_** - transforms a Project UIDL into a folder structure of `files` and `folders`

**_Project Strategy_** - specifies the file structure and the component generators for a project generator.

**_Prop Definitions_** - object defined inside a Component UIDL used by a parent component to pass values to its children. In order for a component to properly work, its props must be defined in the `propDefinition` field. If a prop is used and it is not defined, the code generators will throw an error. If a prop is defined, but not used, the code generators will log a warning.

**R**

---

**_Repeat Node_** - [UIDL Node Type](/uidl/#node-types) used to define a repetitive structure (eg: v-for in Vue, .map in React). Its purpose is to cover the mapping of multiple entities of the same type, usually provided in a data array, to a set of identical or similar visual elements.

**_Resolver_** - class instance that ensures the generic UIDL definitions are transformed into framework specific information.

**_Root Node_** - element of a Project UIDL structure containing information related to the entry point of the project. It defines a top-level routing mechanism. Its value is a component UIDL. Examples can be found [here](/uidl/#routing).

**_Routing_** - concept that refers to navigation from one page (or state) to another. Modern frameworks implement client side routing via their own libraries. In an UIDL project structure the routing mechanism is described inside `route` field that can be defined in the `stateDefinitions` node. More information and an example can be found [here](/uidl/#routing).

**S**

---

**_Slot Node_** - [UIDL Node Type](/uidl/#node-types) used to specify where children passed from parents get to be placed in relation with other elements/children of the component.

**_State Definitions_** - object defined inside a Component UIDL that contains key-value pairs used internally as state for that component. If a state is used and it is not defined in the `stateDefinition` field, the code generators will throw an error. If a state is defined, but not used, the code generators will log a warning.

**_Static Node_** - [UIDL Node Type](/uidl/#node-types) used for static values (eg: strings, numbers). When this node type is used, the code generator passes the values as they are.

**U**

---

**_UIDL_** - abbr. for User Interface Design Language(UIDL), a standard representation for modern UIs. An UIDL is a structure that describes each element/component used in an UI. More details can be found [here](/uidl/).

**_UIDL Node_** - the most basic building block in an UIDL structure. An UIDL Node contains information about a component used in an UI. When defined, it must contain information about `type` and `content`. The `type` must me a string and must be one of the following values - `static`, `dynamic`, `element`, `conditional`, `repeat`, `slot` or `nested-style`. To learn how to declare a node check [`Node Types`](/uidl/#node-types) section.

**V**

---

**_Validator_** - class instance that ensures the UIDL component and project definition is done properly. Currently, the validator not only ensures the provided JSON file has the correct format i.e. defined according to the latest UIDL schema, but also checks its content i.e. ensures no stateDefinitions, propDefinitions, local variables are used without being defined, no components are referenced without being defined in the project, component names are the same with than component keys referenced in the project, external dependency versions are consistent across the project, the `route` state key is defined inside root, the first level children in the root component are conditionals based on the previously defined `route`, prop and state key are not the same. Besides this, the validator will also give warnings if stateDefinitions, propDefinitions or local variables are defined but not used.
