# Support

## Deprecated nodes

[Code-Generators](https://github.com/teleporthq/teleport-code-generators) are designed to support old `ComponentUIDL` and `ProjectUIDL`. But, some un-stable nodes
tend to change, all the details of those un-stable nodes are mentioned here.

### Nested-style Node

:::warning
Support for nested-style is dropped after the `v0.13.0` release.
:::

Styles are css-like properties that are applied directly on the root node of a component.
With this approach alone you cannot define responsive styles. Using the nested-style node,
you can define a sub-section instead of a single static / dynamic value for a give style key.

```json
{
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

## TypeScript Interfaces

:::tip
We encourage everyone who wishes to create new plugins and/or generators based on the proposed architecture and on the UIDL format, to work with TypeScript to take full advantage of the format and data structures.
:::

Here are the interfaces for components and projects:

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

```typescript
interface ProjectUIDL {
  name: string;
  globals: {
    settings: {
      title: string;
      language: string;
    };
    customCode?: {
      head?: string;
      body?: string;
    };
    meta: Array<Record<string, string>>;
    assets: UIDLGlobalAsset[];
    manifest?: WebManifest;
    variables?: Record<string, string>;
  };
  root: ComponentUIDL;
  components?: Record<string, ComponentUIDL>;
}
```

The other interfaces that make up the UIDL typing system can be found [on the git repository](https://github.com/teleporthq/teleport-code-generators/blob/master/packages/teleport-generator-shared/src/typings/uidl.ts).
