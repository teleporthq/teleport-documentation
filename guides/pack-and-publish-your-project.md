# Pack and Publish Your Project

When used standalone, a [project generator's](/project-generators/flavors.html) output is an in-memory folder structure. This allows you to run the generator in any environment without depending on the ability to write to the disk.

If you want to have a running app and, you can use the [project packer](/project-generators/project-packer.html).

In this tutorial, we'll use the **Next project generator** and the **Vercel publisher**.

:::tip
There are [multiple publishers available](/project-generators/publishers.html), part of the **teleportHQ** ecosystem. The setup is similar and you can find the [complete API documentation](/project-generators/publishers.html) in the corresponding section of the docs.
:::

Now, let's start our project packer setup. First, install the dependencies: the **project generator**, the **project-packer** package as well as the **now** publisher.

```
npm install @teleporthq/teleport-project-generator-next
npm install @teleporthq/teleport-project-packer
npm install @teleporthq/teleport-publisher-vercel
```

To create a `now` publisher, you first need to create a Vercel deploy token from your [account settings](https://vercel.com/account/tokens).
After you have your **vercel deploy token**, you can begin to create the packer and pack your project:

```js
import { createProjectPacker } from "@teleporthq/teleport-project-packer"
import {createNextProjectGenerator} from "@teleporthq/teleport-project-generator-next"
import { createVercelPublisher } from "@teleporthq/teleport-publisher-vercel"

const VERCEL_TOKEN = "YOUR_VERCEL_DEPLOY_TOKEN_HERE"
const projectUidl: ProjectUIDL = {
  /* ... */
}

NowPublisher.setAccessToken(Vercel_TOKEN)

const vercelPublisher = createVercelPublisher({accessToken: VERCEL_TOKEN})
const projectPacker = createProjectPacker()
projectPacker.setPublisher(vercelPublisher)
const nextGenerator = createNextProjectGenerator()
projectPacker.setGenerator(nextGenerator)

const result = await projectPacker.pack(projectUidl)

console.log(result)
```

The result will be an object of type `PublisherResponse`

Sample output:

```js
{
  success: true
  payload: {
    id: 'dpl_8pLBsefg4YFYMuxx3wqv2MRefy',
    url: 'teleport-project-template-next.vercel.app',
    alias: [ 'teleport-project-template-next.vercel.app' ]
  }
}
```
