# Publishers

A publisher is an utility package that takes as input the [custom format](../guides/generate-your-first-project.html) result of a project generator and helps you get a running application faster, either by:

- **deploying** the running app on 3rd party services like *Vercel* or *Netlify*
- **exporting** the code directly in the *browser*, on the *disk*, or pushing it to a *remote* location.

The official `teleport` publishers are described in this section:
* [Vercel](/project-generators/publishers.html#vercel)
* [Netlify](/project-generators/publishers.html#netlify)
* [GitHub](/project-generators/publishers.html#github)
* [Zip](/project-generators/publishers.html#zip)
* [Disk](/project-generators/publishers.html#disk)

Each publisher expects the output of a project generator (a `GeneratedFolder` type) as an argument. Additionally, you may be required to provide different input data, depending on what task is your selected publisher supposed to do (authentication metadata, output paths, deploy tokens)

Having a generated project, you can use a publisher in three ways. The first one is to import the factory function and create a publisher instance like this:

```typescript
import { createPublisher } from "@teleporthq/teleport-publisher..."

const project: GeneratedFolder = {
  /* ... */
}

const publisher = createPublisher({ project })

const result = await publisher.publish()
```

The second option is to import an already created instance of the publisher and set the project using a specific defined function:

```typescript
import PublisherInstance from "@teleporthq/teleport-publisher..."

const project: GeneratedFolder = {
  /* ... */
}

PublisherInstance.setProject(project)

const result = await PublisherInstance.publish()
```

The third option is to send the project as argument only at the `publish` method:

```typescript
import PublisherInstance from "@teleporthq/teleport-publisher..."

const project: GeneratedFolder = {
  /* ... */
}

const result = await PublisherInstance.publish({ project })
```

We'll use the third version of defining and using a publisher through this tutorial.

The result of the `publish` method is of generic type `PublisherResponse` and it's payload is different from one publisher to another.

```typescript
interface PublisherResponse<T> {
  success: boolean
  payload: T
}
```

## Vercel

Install the Vercel publisher using the following command

```
npm install @teleporthq/teleport-publisher-vercel
```

### Arguments

```typescript
interface PublisherFactoryParams {
    project?: GeneratedFolder;
}

interface VercelPublisherParams extends PublisherFactoryParams {
    accessToken: string;
    projectSlug: string;
    domainAlias?: string;
    teamId?: string;
    version?: number;
    public?: boolean;
    target?: string;
    alias?: string[];
    individualUpload?: boolean;
    framework?: string;
}
```

:::tip
You can create a Vercel deploy token from your [account settings](https://vercel.com/account/tokens).
:::

### Response

```typescript
interface PublisherResponse<T> {
    success: boolean;
    payload?: T;
}

export interface VercelDeployResponse {
    id: string;
    url: string;
    alias: string[];
    readyState?: string;
}
```

### API reference

#### `publish(options)`

- **Arguments:** `(VercelPublisherParams) options`
- **Returns:** `PublisherResponse<VercelDeployResponse>`
- **Usage:**

  ```typescript
  import {createVercelPublisher} from "@teleporthq/teleport-publisher-vercel"

  const publisher = createVercelPublisher({ accessToken: VERCEL_TOKEN })

  const result = await publisher.publish({
    project: /*..*/,
    accessToken: /*..*/
  })
  ```

#### `getProject()`

- **Returns:** (GeneratedFolder) the project used by the publisher instance (if any)
- **Usage:**
  When your publisher factory was initialized with a project as argument or it has been previously set, you have the possiblity to query for it

  ```typescript
  import { createVercelPublisher } from "@teleporthq/teleport-publisher-vercel"

  const publisher = createVercelPublisher({ project: /*...*/ })

  const project = publisher.getProject()

  ```

#### `setProject(project)`

- **Arguments:** (GeneratedFolder) project
- **Returns:** (void)
- **Usage:**
  You can set the project to the publisher before running the actual `publish` method

  ```typescript
  import { createVercelPublisher } from "@teleporthq/teleport-publisher-vercel"

  const project: GeneratedFolder = {
    /*..*/
  }
  const publisher = createVercelPublisher()
  publisher.setProject(project)
  ```

#### `getDeployToken()`

- **Returns:** (string) the deploy token used by the publisher instance (if any)
- **Usage:**
  When your publisher factory was initialized with a deploy token as argument or it has been previously set, you have the possiblity to query for it

  ```typescript
  import { createVercelPublisher } from "@teleporthq/teleport-publisher-vercel"

  const publisher = createVercelPublisher({ accessToken: "MY_DEPLOY_TOKEN" })

  const deployToken = publisher.getAccessToken()
  ```

#### `setDeployToken(token)`

- **Arguments:** (string) token
- **Returns:** (void)
- **Usage:**
  You can set the deploy token to the publisher before running the actual `publish` method

  ```typescript
  import { createVercelPublisher } from "@teleporthq/teleport-publisher-vercel"

  const token = "YOUR_DEPLOY_TOKEN"
  const publisher = createVercelPublisher()
  publisher.setAccessToken(token)
  ```

### Example

```typescript
import { createVercelPublisher } from "@teleporthq/teleport-publisher-vercel"

const accessToken = "YOUR_DEPLOY_TOKEN_HERE"
const project: GeneratedFolder = {
  /* ... */
}

const publisher = createVercelPublisher({ project, accessToken})

const result = await publisher.publish()

console.log(result)
```

Sample output:

```json
{
  success: true,  
  payload: {
    id: 'dpl_8pLBsefg4YFYMuxx3wqv2MRefy',
    url: 'teleport-project-template-next.vercel.app',
    alias: [ 'teleport-project-template-next.vercel.app' ]
  }
}
```

## Netlify

Install the netlify publisher using the following command

```
npm install @teleporthq/teleport-publisher-netlify
```

### Arguments

```typescript
interface NetlifyFactoryParams {
  project: GeneratedFolder
  accessToken: string
}
```

:::tip
You can create a Netlify access token from your [account settings](https://app.netlify.com/user/applications#oauth).
:::

### API reference

#### `publish(options)`

- **Arguments:** `(NetlifyFactoryParams) options`
- **Returns:** `PublisherResponse<string>`
- **Usage:**

  ```typescript
  import NetlifyPublisher from "@teleporthq/teleport-publisher-netlify"

  const result = await NetlifyPublisher.publish({
    project: /*..*/,
    accessToken: /*..*/
  })
  ```

#### `getProject()`

- **Returns:** (GeneratedFolder) the project used by the publisher instance (if any)
- **Usage:**
  When your publisher factory was initialized with a project as argument or it has been previously set, you have the possiblity to query for it

  ```typescript
  import { createNetlifyPublisher } from "@teleporthq/teleport-publisher-netlify"

  const publisher = createNetlifyPublisher({ project: /*...*/ })

  const project = publisher.getProject()

  ```

#### `setProject(project)`

- **Arguments:** (GeneratedFolder) project
- **Returns:** (void)
- **Usage:**
  You can set the project to the publisher before running the actual `publish` method

  ```typescript
  import NetlifyPublisher from "@teleporthq/teleport-publisher-netlify"

  const project: GeneratedFolder = {
    /*..*/
  }
  NetlifyPublisher.setProject(project)
  ```

#### `getAccessToken()`

- **Returns:** (string) the access token used by the publisher instance (if any)
- **Usage:**
  When your publisher factory was initialized with an access token as argument or it has been previously set, you have the possiblity to query for it

  ```typescript
  import { createNetlifyPublisher } from "@teleporthq/teleport-publisher-netlify"

  const publisher = createNetlifyPublisher({ accessToken: "MY_DEPLOY_TOKEN" })

  const deployToken = publisher.getAccessToken()
  ```

#### `setAccessToken(token)`

- **Arguments:** (string) token
- **Returns:** (void)
- **Usage:**
  You can set the access token to the publisher before running the actual `publish` method

  ```typescript
  import NetlifyPublisher from "@teleporthq/teleport-publisher-netlify"

  const token = "YOUR_ACCESS_TOKEN"
  NetlifyPublisher.setAccessToken(token)
  ```

### Example

```typescript
import NetlifyPublisher from "@teleporthq/teleport-publisher-netlify"

const accessToken = "YOUR_ACCESS_TOKEN"
const project: GeneratedFolder = {
  /* ... */
}

const result = await NetlifyPublisher.publish({ project, accessToken })
console.log(result)
```

Sample output:

```json
{
  success: true
  payload: "https://teleport-project-template-next.netlify.com"
}
```

## GitHub

Install the github publisher using the following command

```
npm install @teleporthq/teleport-publisher-github
```

### Arguments

```typescript
interface GithubFactoryParams {
  project: GeneratedFolder
  authMeta?: ServiceAuth
  repositoryOwner?: string
  repository?: string
  masterBranch?: string // default to 'master'
  commitBranch?: string // default to 'master'
  commitMessage?: string
}

interface ServiceAuth {
  basic?: {
    username: string
    password: string
  }
  token?: string
}
```

:::tip
As the Github API only allows a limited number of requests/hour for non-authenticated users, it is recommended to use one of the authentication methods that are exposed by the publisher. You can either use your Github username and password or you can create an access token from your [account settings](https://github.com/settings/tokens) and use it when you publish a project.
:::

### Default values

**repositoryOwner**

- if you choose to authenticate using your username and password, the given username will be used as default for `repositoryOwner`, representing the Github account name where the project will be created or updated (in case it already exists)

**masterBranch**

- `master` will be used as default

**commitBranch**

- `master` will be used as default

**commitMessage**

- `Commit made using TeleportHQ` will be used as default

### API reference

#### `publish(options)`

- **Arguments:** `(GithubFactoryParams) options`
- **Returns:** `PublisherResponse<string>`
- **Usage:**

  ```typescript
  import GithubPublisher from "@teleporthq/teleport-publisher-github"

  const result = await GithubPublisher.publish({
    project: /*..*/,
    authMeta: /*..*/,
  })
  ```

#### `getProject()`

- **Returns:** (GeneratedFolder) the project used by the publisher instance (if any)
- **Usage:**
  When your publisher factory was initialized with a project as argument or it has been previously set, you have the possiblity to query for it

  ```typescript
  import { createGithubPublisher } from "@teleporthq/teleport-publisher-github"

  const publisher = createGithubPublisher({ project: /*...*/ })

  const project = publisher.getProject()
  ```

#### `setProject(project)`

- **Arguments:** (GeneratedFolder) project
- **Returns:** (void)
- **Usage:**
  You can set the project to the publisher before running the actual `publish` method

  ```typescript
  import GithubPublisher from "@teleporthq/teleport-publisher-github"

  const project: GeneratedFolder = {
    /*..*/
  }
  GithubPublisher.setProject(project)
  ```

#### `getMasterBranchName()`

- **Returns:** (string) the master branch name used by the publisher instance (if any)
- **Usage:**
  When your publisher factory was initialized with a master branch name as argument or it has been previously set, you have the possiblity to query for it

  ```typescript
  import { createGithubPublisher } from "@teleporthq/teleport-publisher-github"

  const publisher = createGithubPublisher({ masterBranch: /*...*/, })

  const project = publisher.getMasterBranchName()
  ```

#### `setMasterBranchName(branch)`

- **Arguments:** (string) branch
- **Returns:** (void)
- **Usage:**
  You can set the master branch name to the publisher before running the actual `publish` method

  ```typescript
  import GithubPublisher from "@teleporthq/teleport-publisher-github"

  const branch: string = {
    /*..*/
  }
  GithubPublisher.setMasterBranchName(branch)
  ```

#### `getCommitBranchName()`

- **Returns:** (string) the commit branch name used by the publisher instance (if any)
- **Usage:**
  When your publisher factory was initialized with a commit branch name as argument or it has been previously set, you have the possiblity to query for it

  ```typescript
  import { createGithubPublisher } from "@teleporthq/teleport-publisher-github"

  const publisher = createGithubPublisher({ commitBranch: /*...*/, })

  const project = publisher.getCommitBranchName()
  ```

#### `setCommitBranchName(branch)`

- **Arguments:** (string) branch
- **Returns:** (void)
- **Usage:**
  You can set the commit branch name to the publisher before running the actual `publish` method

  ```typescript
  import GithubPublisher from "@teleporthq/teleport-publisher-github"

  const branch: string = {
    /*..*/
  }
  GithubPublisher.setCommitBranchName(branch)
  ```

#### `getCommitMessage()`

- **Returns:** (string) the commit message used by the publisher instance (if any)
- **Usage:**
  When your publisher factory was initialized with a commit message as argument or it has been previously set, you have the possiblity to query for it

  ```typescript
  import { createGithubPublisher } from "@teleporthq/teleport-publisher-github"

  const publisher = createGithubPublisher({ commitMessage: /*...*/, })

  const project = publisher.getCommitMessage()
  ```

#### `setCommitMessage(message)`

- **Arguments:** (string) message
- **Returns:** (void)
- **Usage:**
  You can set the commit message to the publisher before running the actual `publish` method

  ```typescript
  import GithubPublisher from "@teleporthq/teleport-publisher-github"

  const message: string = {
    /*..*/
  }
  GithubPublisher.setCommitMessage(message)
  ```

#### `getRepositoryOwner()`

- **Returns:** (string) the repository owner used by the publisher instance (if any)
- **Usage:**
  When your publisher factory was initialized with a repository owner as argument or it has been previously set, you have the possiblity to query for it

  ```typescript
  import { createGithubPublisher } from "@teleporthq/teleport-publisher-github"

  const publisher = createGithubPublisher({ repositoryOwner: /*...*/, })

  const project = publisher.getRepositoryOwner()
  ```

#### `setRepositoryOwner(owner)`

- **Arguments:** (string) owner
- **Returns:** (void)
- **Usage:**
  You can set the repository owner to the publisher before running the actual `publish` method

  ```typescript
  import GithubPublisher from "@teleporthq/teleport-publisher-github"

  const owner: string = {
    /*..*/
  }
  GithubPublisher.setRepositoryOwner(owner)
  ```

### Example

```typescript
import GithubPublisher from "@teleporthq/teleport-publisher-github"

const repositoryOwner = "owner_name"
const repository = "repository_name"

const authMeta = { token: "YOUR_TOKEN_HERE" }
const project: GeneratedFolder = {
  /* ... */
}

const publisher = createGithubPublisher({
  project,
  authMeta,
  repositoryOwner,
  repository
})

const result = await publisher.publish()

console.log(result)
```

```json
{
  success: true
  payload: "https://github.com/owner_name/repository_name"
}
```

## Zip

Install the zip publisher using the following command

```
npm install @teleporthq/teleport-publisher-zip
```

### Arguments

```typescript
interface ZipFactoryParams {
  project: GeneratedFolder
  // if provided, the result will be written on your disk at this location
  outputPath?: string
  // if provided, the zip file will be named after this property
  outputZipName?: string
}
```

:::tip
You can use the Zip publisher without providing an output path and only get a `Buffer` as result. This way you can manipulate the project content as you desire.
:::

### API reference

#### `publish(options)`

- **Arguments:** `(ZipFactoryParams) options`
- **Returns:** `PublisherResponse<Buffer>`
- **Usage:**

  ```typescript
  import ZipPublisher from "@teleporthq/teleport-publisher-zip"

  const result = await ZipPublisher.publish({
    project: /*..*/
  })
  ```

#### `getProject()`

- **Returns:** (GeneratedFolder) the project used by the publisher instance (if any)
- **Usage:**
  When your publisher factory was initialized with a project as argument or it has been previously set, you have the possiblity to query for it

  ```typescript
  import { createZipPublisher } from "@teleporthq/teleport-publisher-zip"

  const publisher = createZipPublisher({ project: /*...*/ })

  const project = publisher.getProject()
  ```

#### `setProject(project)`

- **Arguments:** (GeneratedFolder) project
- **Returns:** (void)
- **Usage:**
  You can set the project to the publisher before running the actual `publish` method

  ```typescript
  import ZipPublisher from "@teleporthq/teleport-publisher-zip"

  const project: GeneratedFolder = {
    /*..*/
  }
  ZipPublisher.setProject(project)
  ```

#### `getOutputPath()`

- **Returns:** (string) the output path used by the publisher instance (if any)
- **Usage:**
  When your publisher factory was initialized with an output path name as argument or it has been previously set, you have the possiblity to query for it

  ```typescript
  import { createZipPublisher } from "@teleporthq/teleport-publisher-zip"

  const publisher = createZipPublisher({ outputPath: /*...*/ })

  const project = publisher.getOutputPath()
  ```

#### `setOutputPath(path)`

- **Arguments:** (string) path
- **Returns:** (void)
- **Usage:**
  You can set output path to the publisher before running the actual `publish` method

  ```typescript
  import ZipPublisher from "@teleporthq/teleport-publisher-zip"

  const path: string = {
    /*..*/
  }
  ZipPublisher.setOutputPath(path)
  ```

#### `getOutputZipName()`

- **Returns:** (string) the output zip name used by the publisher instance (if any)
- **Usage:**
  When your publisher factory was initialized with an output zip name as argument or it has been previously set, you have the possiblity to query for it

  ```typescript
  import { createZipPublisher } from "@teleporthq/teleport-publisher-zip"

  const publisher = createZipPublisher({ outputZipName: /*...*/ })

  const project = publisher.getOutputZipName()
  ```

#### `setOutputZipName(zipName)`

- **Arguments:** (string) zipName
- **Returns:** (void)
- **Usage:**
  You can set output zip name to the publisher before running the actual `publish` method

  ```typescript
  import ZipPublisher from "@teleporthq/teleport-publisher-zip"

  const zipName: string = {
    /*..*/
  }
  ZipPublisher.setOutputZipName(zipName)
  ```

### Example

```typescript
import ZipPublisher from "@teleporthq/teleport-publisher-zip"

const outputPath = "YOUR_LOCAL_DISK_PATH"
const outputZipName = "ZIP_NAME"
const project: GeneratedFolder = {
  /* ... */
}

const result = await ZipPublisher.publish({
  project,
  outputPath,
  outputZipName
})

console.log(result)
```

```json
{
  success: true
  payload: Buffer<...>
}
```

:::tip
If an `outputPath` is provided, the zip containing all the project files will be written on your disk.
:::

## Disk

Install the disk publisher using the following command

```
npm install @teleporthq/teleport-publisher-disk
```

### Arguments

```typescript
interface DiskFactoryParams {
  project: GeneratedFolder
  // The result will be written on your disk at this location
  outputPath: string
}
```

### API reference

#### `publish(options)`

- **Arguments:** `(DiskFactoryParams) options`
- **Returns:** `PublisherResponse<string>`
- **Usage:**

  ```typescript
  import DiskPublisher from "@teleporthq/teleport-publisher-disk"

  const result = await DiskPublisher.publish({
    project: /*..*/,
    outputPath: /*..*/
  })
  ```

#### `getProject()`

- **Returns:** (GeneratedFolder) the project used by the publisher instance (if any)
- **Usage:**
  When your publisher factory was initialized with a project as argument or it has been previously set, you have the possiblity to query for it

  ```typescript
  import { createDiskPublisher } from "@teleporthq/teleport-publisher-disk"

  const publisher = createDiskPublisher({ project: /*...*/ })

  const project = publisher.getProject()
  ```

#### `setProject(project)`

- **Arguments:** (GeneratedFolder) project
- **Returns:** (void)
- **Usage:**
  You can set the project to the publisher before running the actual `publish` method

  ```typescript
  import DiskPublisher from "@teleporthq/teleport-publisher-disk"

  const project: GeneratedFolder = {
    /*..*/
  }
  DiskPublisher.setProject(project)
  ```

#### `getOutputPath()`

- **Returns:** (string) the output path used by the publisher instance (if any)
- **Usage:**
  When your publisher factory was initialized with an output path name as argument or it has been previously set, you have the possiblity to query for it

  ```typescript
  import { createDiskPublisher } from "@teleporthq/teleport-publisher-disk"

  const publisher = createDiskPublisher({ outputPath: /*...*/ })

  const project = publisher.getOutputPath()
  ```

#### `setOutputPath(path)`

- **Arguments:** (string) path
- **Returns:** (void)
- **Usage:**
  You can set output path to the publisher before running the actual `publish` method

  ```typescript
  import DiskPublisher from "@teleporthq/teleport-publisher-disk"

  const path: string = {
    /*..*/
  }
  DiskPublisher.setOutputPath(path)
  ```

### Example

```typescript
import DiskPublisher from "@teleporthq/teleport-publisher-disk"

const outputPath = "YOUR_LOCAL_DISK_PATH"
const project: GeneratedFolder = {
  /* ... */
}

const result = await DiskPublisher.publish({ project, outputPath })

console.log(result)
```

```json
{
  success: true
  payload: "YOUR_LOCAL_DISK_PATH"
}
```
