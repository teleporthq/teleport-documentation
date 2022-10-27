# Project Packer

The project packer is a bundle that encapsulates a project generator together with a [publisher](/project-generators/publishers.html) and executes in a pipeline all the necessary steps so as to have a working project.

## Arguments

```typescript
interface PackerFactoryParams {
    publisher?: Publisher<unknown, unknown>;
    generator?: ProjectGenerator;
    template?: GeneratedFolder;
    remoteTemplateDefinition?: RemoteTemplateDefinition;
    assets?: AssetsDefinition;
}
```

## API reference

#### `setPublisher(publisher)`
Sets the publisher for all subsequent calls of the pack function
- **Arguments:** `(Publisher) publisher`
- **Returns:** `void`
- **Usage:**

```ts
import { createProjectPacker } from "@teleporthq/teleport-project-packer"
import { createVercelPublisher } from "@teleporthq/teleport-publisher-vercel"


const deployToken = "YOUR_DEPLOY_TOKEN_HERE"
const publisher = createVercelPublisher()

publisher.setAccessToken(deployToken)
const projectPacker = createProjectPacker()

projectPacker.setPublisher(publisher)
```

#### `setGenerator(generator)`
Sets the generator for all subsequent calls of the pack function
- **Arguments:** `(ProjectGenerator) generator`
- **Returns:** `void`
- **Usage:**
```ts
import { createProjectPacker } from "@teleporthq/teleport-project-packer"
import { createNextProjectGenerator } from "@teleporthq/teleport-project-generator-next"

const projectPacker = createProjectPacker()
const nextGenerator = createNextProjectGenerator()
projectPacker.setGenerator(nextGenerator)
```

#### `setAssets(assets)`
Sets the static assets collection for all subsequent calls of the pack function
- **Arguments:** `(AssetsDefinition) assets`
- **Returns:** `void`
- **Usage:**
```ts
import { createProjectPacker } from "@teleporthq/teleport-project-packer"

const assets: AssetsDefinition = {
  /* ... */
}
const projectPacker = createProjectPacker()
projectPacker.setAssets(assets)
```

#### `setTemplate(template)`
You can define the template in which the generated pages and components will be injected and set it to the packer before running the main `pack` method
- **Arguments:** `(GeneratedFolder) template`
- **Returns:** `void`
- **Usage:**
```ts
import { createProjectPacker } from "@teleporthq/teleport-project-packer"

const template: GeneratedFolder = {
  /* ... */
}

const projectPacker = createProjectPacker()
projectPacker.setTemplate(template)
```

#### `loadTemplate(remoteTemplate)`
In case you want to use a remote template (a github repository), you can load it before running the main method
- **Arguments:** `(RemoteTemplateDefinition) remoteTemplate`
- **Returns:** `Promise<void>`
- **Usage:**
```ts
import { createProjectPacker } from "@teleporthq/teleport-project-packer"

const remoteTemplate: RemoteTemplateDefinition = {
  /* ... */
}

const projectPacker = createProjectPacker()
await projectPacker.loadTemplate(remoteTemplate)
```

#### `pack(projectUidl, packParams)`

- **Arguments:**

  - `(ProjectUIDL) projectUidl`
  - `(PackerFactoryParams) packParams`

- **Returns:** `Promise<PublisherResponse>`
  - will have the same return type as the chosen publisher
- **Usage:**

  ```ts
  import { createProjectPacker } from "@teleporthq/teleport-project-packer"
  import { createVercelPublisher } from "@teleporthq/teleport-publisher-vercel"
  import { createNextProjectGenerator } from "@teleporthq/teleport-project-generator-next"

  import NextGenerator from "@teleporthq/teleport-project-generator-next"

  const projectUidl: ProjectUIDL = {
    /* ... */
  }

  // # Setup the publisher
  const deployToken = "YOUR_DEPLOY_TOKEN_HERE"
  const vercelPublisher = createVercelPublisher({ accessToken: deployToken })

  // # Setup the packer
  const projectPacker = createProjectPacker()
  const nextGenerator = createNextProjectGenerator()
  projectPacker.setGenerator(nextGenerator)
  projectPacker.setPublisher(vercelPublisher)

  const result = await projectPacker.pack(projectUidl)
  ```

## Example

```ts
import { createProjectPacker } from "@teleporthq/teleport-project-packer"
import { createVercelPublisher } from "@teleporthq/teleport-publisher-vercel"
import { createNextProjectGenerator } from "@teleporthq/teleport-project-generator-next"

const projectUidl: ProjectUIDL = {
  /* ... */
}

const assets: AssetsDefinition = {
  /* ... */
}

const remoteTemplateDefinition: RemoteTemplateDefinition = {
  provider: "github",
  owner: "teleporthq",
  repo: "teleport-project-template-next",
  auth: {
    token: "YOUR_GITHUB_TOKEN"
  }
}

// # Setup the publisher
const deployToken = "YOUR_DEPLOY_TOKEN_HERE"
const vercelPublisher = createVercelPublisher({ accessToken: deployToken })


// # Setup the packer
  const projectPacker = createProjectPacker()
  const nextGenerator = createNextProjectGenerator()
  projectPacker.setGenerator(nextGenerator)
  projectPacker.setPublisher(vercelPublisher)

const result = await projectPacker.pack(project, {
  remoteTemplateDefinition,
  assets
})

console.log(result)
```
Result:
```json
{
  success: true
  payload: {
    id: 'dpl_8pLBsefg4YFYMuxx3wqv2MRefy',
    url: 'teleport-project-template-next.vercel.app',
    alias: [ 'teleport-project-template-next.vercel.app' ]
  }
}
```
