# Publishers

A publisher is an utility package that takes as input the [custom format](guides/generate-your-first-project.html) result of a project generator and helps you get a running application faster, by:

- deploying it on **Zeit** or **Netlify**
- creating a **zip** file containing the entire project
- writing the project files to a **disk** path of your choice
- pushing the project files to a new or an existing **github** repository

Each publisher expects the output of a project generator (a `GeneratedFolder` type) as an argument. Additionally, you may be required to provide different input data, depending on what task is your selected publisher supposed to do (authentication metadata, output paths, deploy tokens)

Having a generated project, you can use a publisher in three ways.
The first one is to import the factory function and create a publisher instance like this:

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

## Now

Install the now publisher using the following command

```
npm install @teleporthq/teleport-publisher-now
```

### Arguments

```typescript
interface NowFactoryParams {
  project: GeneratedFolder
  deployToken: string
}
```

:::tip
You can create a Zeit deploy token from your [account settings](https://zeit.co/account/tokens).
:::

### API reference

#### `publish(options)`

- **Arguments:** `(NowFactoryParams) options`
- **Returns:** `PublisherResponse<string>`
- **Usage:**

  ```typescript
  import NowPublisher from "@teleporthq/teleport-publisher-now"

  const result = await NowPublisher.publish({
    project: /*..*/,
    deployToken: /*..*/
  })
  ```

#### `getProject()`

- **Returns:** (GeneratedFolder) the project used by the publisher instance (if any)
- **Usage:**
  When your publisher factory was initialized with a project as argument or it has been previously set, you have the possiblity to query for it

  ```typescript
  import { createNowPublisher } from "@teleporthq/teleport-publisher-now"

  const publisher = createNowPublisher({ project: /*...*/ })

  const project = publisher.getProject()

  ```

#### `setProject(project)`

- **Arguments:** (GeneratedFolder) project
- **Returns:** (void)
- **Usage:**
  You can set the project to the publisher before running the actual `publish` method

  ```typescript
  import NowPublisher from "@teleporthq/teleport-publisher-now"

  const project: GeneratedFolder = {
    /*..*/
  }
  NowPublisher.setProject(project)
  ```

#### `getDeployToken()`

- **Returns:** (string) the deploy token used by the publisher instance (if any)
- **Usage:**
  When your publisher factory was initialized with a deploy token as argument or it has been previously set, you have the possiblity to query for it

  ```typescript
  import { createNowPublisher } from "@teleporthq/teleport-publisher-now"

  const publisher = createNowPublisher({ deployToken: "MY_DEPLOY_TOKEN" })

  const deployToken = publisher.getDeployToken()
  ```

#### `setDeployToken(token)`

- **Arguments:** (string) token
- **Returns:** (void)
- **Usage:**
  You can set the deploy token to the publisher before running the actual `publish` method

  ```typescript
  import NowPublisher from "@teleporthq/teleport-publisher-now"

  const token = "MY_DEPLOY_TOKEN"
  NowPublisher.setToken(token)
  ```

### Usage

```typescript
import NowPublisher from "@teleporthq/teleport-publisher-now"

const project: GeneratedFolder = {
  /* ... */
}

const deployToken = "YOUR_DEPLOY_TOKEN_HERE"

const result = await NowPublisher.publish({ project, deployToken })

console.log(result)
```

Sample output:

```json
{
  success: true
  payload: "https://teleport-project-template-react-next.now.sh"
}
```

## Netlify

Install the netlify publisher using the following command

```
npm install @teleporthq/teleport-publisher-netlify
```

```typescript
import { createNetlifyPublisher } from "@teleporthq/teleport-publisher-netlify"

const project: GeneratedFolder = {
  /* ... */
}

const publisher = createNetlifyPublisher({ project })

const result = await publisher.publish()
```

## GitHub

Install the github publisher using the following command

```
npm install @teleporthq/teleport-publisher-github
```

```typescript
import { createGithubPublisher } from "@teleporthq/teleport-publisher-github"

const project: GeneratedFolder = {
  /* ... */
}

const publisher = createGithubPublisher({ project })

const result = await publisher.publish()
```

## Zip

Install the zip publisher using the following command

```
npm install @teleporthq/teleport-publisher-zip
```

```typescript
import { createZipPublisher } from "@teleporthq/teleport-publisher-zip"

const project: GeneratedFolder = {
  /* ... */
}

const publisher = createZipPublisher({ project })

const result = await publisher.publish()
```

## Disk

Install the disk publisher using the following command

```
npm install @teleporthq/teleport-publisher-disk
```

```typescript
import { createDiskPublisher } from "@teleporthq/teleport-publisher-disk"

const project: GeneratedFolder = {
  /* ... */
}

const publisher = createDiskPublisher({ project })

const result = await publisher.publish()
```
