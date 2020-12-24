# Support

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
