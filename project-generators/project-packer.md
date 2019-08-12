# Project Packer

The project packer is a bundle that encapsulates a project generator together with a [publisher](/project-generators/publishers.html) and executes in a pipeline all the necessary steps so as to have a working project.

## Arguments

```typescript
export interface PackerFactoryParams {
  publisher?: Publisher
  generator?: ProjectGenerator
  template?: GeneratedFolder
  remoteTemplateDefinition?: RemoteTemplateDefinition
  assets?: AssetsDefinition
}
```

## API reference

#### `setPublisher(publisher)`
Sets the publisher for all subsequent calls of the pack function
- **Arguments:** `(Publisher) publisher`
- **Returns:** `void`
- **Usage:**

```ts
import ProjectPacker from "@teleporthq/teleport-project-packer"
import NowPublisher from "@teleporthq/teleport-publisher-now"

const deployToken = "YOUR_DEPLOY_TOKEN_HERE"
NowPublisher.setAccessToken(deployToken)

ProjectPacker.setPublisher(NowPublisher)
```

#### `setGenerator(generator)`
Sets the generator for all subsequent calls of the pack function
- **Arguments:** `(ProjectGenerator) generator`
- **Returns:** `void`
- **Usage:**
```ts
import ProjectPacker from "@teleporthq/teleport-project-packer"
import NextGenerator from "@teleporthq/teleport-project-generator-next"

ProjectPacker.setGenerator(NextGenerator)
```

#### `setAssets(assets)`
Sets the static assets collection for all subsequent calls of the pack function
- **Arguments:** `(AssetsDefinition) assets`
- **Returns:** `void`
- **Usage:**
```ts
import ProjectPacker from "@teleporthq/teleport-project-packer"

const assets: AssetsDefinition = {
  /* ... */
}

ProjectPacker.setAssets(assets)
```

#### `setTemplate(template)`
You can define the template in which the generated pages and components will be injected and set it to the packer before running the main `pack` method
- **Arguments:** `(GeneratedFolder) template`
- **Returns:** `void`
- **Usage:**
```ts
import ProjectPacker from "@teleporthq/teleport-project-packer"

const template: GeneratedFolder = {
  /* ... */
}

ProjectPacker.setTemplate(template)
```

#### `loadTemplate(remoteTemplate)`
In case you want to use a remote template (a github repository), you can load it before running the main method
- **Arguments:** `(RemoteTemplateDefinition) remoteTemplate`
- **Returns:** `Promise<void>`
- **Usage:**
```ts
import ProjectPacker from "@teleporthq/teleport-project-packer"

const remoteTemplate: RemoteTemplateDefinition = {
  /* ... */
}

await ProjectPacker.loadTemplate(remoteTemplate)
```

#### `pack(projectUidl, packParams)`

- **Arguments:**

  - `(ProjectUIDL) projectUidl`
  - `(PackerFactoryParams) packParams`

- **Returns:** `Promise<PublisherResponse>`
  - will have the same return type as the chosen publisher
- **Usage:**

  ```ts
  import ProjectPacker from "@teleporthq/teleport-project-packer"
  import NowPublisher from "@teleporthq/teleport-publisher-now"
  import NextGenerator from "@teleporthq/teleport-project-generator-next"

  const projectUidl: ProjectUIDL = {
    /* ... */
  }

  // # Setup the publisher
  const deployToken = "YOUR_DEPLOY_TOKEN_HERE"
  NowPublisher.setAccessToken(deployToken)

  // # Setup the packer
  ProjectPacker.setGenerator(NextGenerator)
  ProjectPacker.setPublisher(NowPublisher)

  const result = await ProjectPacker.pack(project)
  ```

## Example

```ts
import ProjectPacker from "@teleporthq/teleport-project-packer"
import NowPublisher from "@teleporthq/teleport-publisher-now"
import NextGenerator from "@teleporthq/teleport-project-generator-next"

const projectUidl: ProjectUIDL = {
  /* ... */
}

const assets: AssetsDefinition = {
  /* ... */
}

const remoteTemplateDefinition: RemoteTemplateDefinition = {
  provider: "github",
  username: "teleporthq",
  repo: "teleport-project-template-next",
  auth: {
    token: "YOUR_GITHUB_TOKEN"
  }
}

// # Setup the publisher
const deployToken = "YOUR_DEPLOY_TOKEN_HERE"
NowPublisher.setAccessToken(deployToken)

// # Setup the packer
ProjectPacker.setGenerator(NextGenerator)
ProjectPacker.setPublisher(NowPublisher)

const result = ProjectPacker.pack(project, {
  remoteTemplateDefinition,
  assets
})

console.log(result)
```
Result:
```json
{
  success: true
  payload: "https://teleport-project-template-next.now.sh"
}
```
