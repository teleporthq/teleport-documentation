# Support

## JSON Schema

Our UIDL format is enforced by [JSON Schema](https://json-schema.org/), an open format which allows us to add
constraints, rules and types on our UIDL objects. Based on the JSON schemas, we are
able to perform structural and type validation for both the component and the project
UIDLs. Each UIDL has a `$schema` reference at the root level, based on which we
perform the validation. The advantage on using the JSON Schema format is that we can
easily keep all the different versions of the UIDL schemas, allowing us to maintain
a backwords compatibility in terms of uidl validation and code generation.

You can find here the corresponding JSON Schema objects for the component and for the project UIDLs here:

- [Component UIDL]()
- [Project UIDL]()

## TypeScript Interfaces

Through our writing we will reference the **TypeScript** interfaces that are used
extensively in representing the UIDLs. TypeScript is a great fit for building our
generators because it allows us to easily map the constraints of the UIDL into
typed interfaces. We encourage everyone who wishes to create new plugins and/or
generators based on our architecture and on the UIDL format, to work with TypeScript
to take full advantage of our format and data structures.

Below you can find the TypeScript interfaces that we use for component and project
UIDLs. The other interfaces that are referenced can be found on our [git repository](https://github.com/teleporthq/teleport-code-generators/blob/master/packages/teleport-generator-shared/src/typings/uidl.ts).

```json
interface ComponentUIDL {
  $schema?: string
  name: string
  node: UIDLNode
  meta?: Record<string, any>
  propDefinitions?: Record<string, UIDLPropDefinition>
  stateDefinitions?: Record<string, UIDLStateDefinition>
}
```

```json
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
    variables?: Record<string, string>
  }
  root: ComponentUIDL
  components?: Record<string, ComponentUIDL>
}
```
