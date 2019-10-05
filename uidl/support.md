# Support

## JSON Schema

The **UIDL** format is enforced by [JSON Schema](https://json-schema.org/), an open format that adds constraints, rules and types on top of a JSON structure. Each UIDL has a `$schema` reference at the root level, based on which we perform the structural and type validation.

You can find the corresponding JSON Schema objects for the **component** and for the **project** UIDLs here:

- [Component UIDL](/uidl-schema/v1/component.json)
- [Project UIDL](/uidl-schema/v1/project.json)

## TypeScript Interfaces

:::tip
We encourage everyone who wishes to create new plugins and/or generators based on the proposed architecture and on the UIDL format, to work with TypeScript to take full advantage of the format and data structures.
:::

Here are the interfaces for components and projects:

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
    variables?: Record<string, string>
  }
  root: ComponentUIDL
  components?: Record<string, ComponentUIDL>
}
```

The other interfaces that make up the UIDL typing system can be found [on the git repository](https://github.com/teleporthq/teleport-code-generators/blob/master/packages/teleport-generator-shared/src/typings/uidl.ts).
