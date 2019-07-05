# Project Packer

The project packer as a bundle that encapsulates a project generator together with a [publisher](/project-generators/publishers.html) and executes in a pipeline all the necessary steps so as to have a working project.

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

Besides the project generator and the [publisher](/project-generators/publishers.html), in order to assemble a runnable project, the packer makes use of some additional informations.

## API reference

#### `setPublisher(publisher)`

- **Arguments:** `(Publisher) publisher`

- **Returns:** `void`
  - you can set the publisher to the packer before running the actual `pack` method
- **Usage:**

```ts
import ProjectPacker from "@teleporthq/teleport-project-packer"
import NowPublisher from "@teleporthq/teleport-publisher-now"

const deployToken = "YOUR_DEPLOY_TOKEN_HERE"
NowPublisher.setAccessToken(deployToken)

ProjectPacker.setPublisher(NowPublisher)
```

#### `setGenerator(generator)`

- **Arguments:** `(ProjectGenerator) generator`
- **Returns:** `void`

- you can set the project generator to the packer before running the actual `pack` method

```ts
import ProjectPacker from "@teleporthq/teleport-project-packer"
import ReactNextGenerator from "@teleporthq/teleport"

ProjectPacker.setGenerator(ReactNextGenerator)
```

#### `setAssets(assets)`

- **Arguments:** `(AssetsDefinition) assets`
- **Returns:** `void`

- you can set the assets to the packer before running the `pack` method

```ts
import ProjectPacker from "@teleporthq/teleport-project-packer"

const assets: AssetsDefinition = {
  /* ... */
}

ProjectPacker.setAssets(assets)
```

#### `setTemplate(template)`

- **Arguments:** `(GeneratedFolder) template`
- **Returns:** `void`

- you can define the template in which the generated pages and components will be injected and set it to the packer before running the main `pack` method

```ts
import ProjectPacker from "@teleporthq/teleport-project-packer"

const template: GeneratedFolder = {
  /* ... */
}

ProjectPacker.setTemplate(template)
```

#### `loadTemplate(remoteTemplate)`

- **Arguments:** `(RemoteTemplateDefinition) remoteTemplate`
- **Returns:** `Promise<void>`

- in case you want to use a remote template (a github repository), you can load it before running the main method

```ts
import ProjectPacker from "@teleporthq/teleport-project-packer"

const remoteTemplate: RemoteTemplateDefinition = {
  /* ... */
}

await ProjectPacker.loadTemplate(remoteTemplate)
```

#### `pack(projectUidl, packParams)`

- **Arguments:**

  `(ProjectUIDL) projectUidl`

  `(PackerFactoryParams) packParams`

- **Returns:** `Promise<PublisherResponse>`
  - will have the same return type as the one as the chosen publisher
- **Usage:**

  ```ts
  import ProjectPacker from "@teleporthq/teleport-project-packer"
  import NowPublisher from "@teleporthq/teleport-publisher-now"
  import ReactNextGenerator from "@teleporthq/teleport"

  const projectUidl: ProjectUIDL = {
    /* ... */
  }

  // # Setup the publisher
  const deployToken = "YOUR_DEPLOY_TOKEN_HERE"
  NowPublisher.setAccessToken(deployToken)

  // # Setup the packer
  ProjectPacker.setGenerator(ReactNextGenerator)
  ProjectPacker.setPublisher(NowPublisher)

  const result = await ProjectPacker.pack(project)
  ```

## Usage

```ts
import ProjectPacker from "@teleporthq/teleport-project-packer"
import NowPublisher from "@teleporthq/teleport-publisher-now"
import ReactNextGenerator from "@teleporthq/teleport"

const projectUidl: ProjectUIDL = {
  /* ... */
}

const assets: AssetsDefinition = {
  /* ... */
}

const remoteTemplateDefinition: RemoteTemplateDefinition = {
  provider: "github",
  username: "teleporthq",
  repo: "teleport-project-template-react-next",
  auth: {
    token: "YOUR_GITHUB_TOKEN"
  }
}

// # Setup the publisher
const deployToken = "YOUR_DEPLOY_TOKEN_HERE"
NowPublisher.setAccessToken(deployToken)

// # Setup the packer
ProjectPacker.setGenerator(ReactNextGenerator)
ProjectPacker.setPublisher(NowPublisher)

const result = ProjectPacker.pack(project, {
  remoteTemplateDefinition,
  assets
})

console.log(result)
```

```json
{
  success: true
  payload: "https://teleport-project-template-react-next.now.sh"
}
```
