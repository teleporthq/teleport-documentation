# Create Your Custom Project Generator
All pre-configured project generators are implemented on top of the `teleport-project-generator` package, which offers the underlying abstractions for processing a `ProjectUIDL` into a structure of in-memory files and folders.

We'll start by installing the `teleport-project-generator` package:
```bash
yarn add @teleporthq/teleport-project-generator
```

which is then used like this:

```javascript
import { createProjectGenerator } from '@teleporthq/teleport-project-generator'

const generator = createProjectGenerator({
  components: ...
  pages: ...
  entry: ...
  static: ...
})
```
