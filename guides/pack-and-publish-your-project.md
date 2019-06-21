# Pack and Publish Your Project

When used standalone, a [project generator's](/project-generators/flavors.html) output is a custom structure that requires extra parsing in order to build a working project.

If you want to have a running app and don't want to parse the project generator's result yourself, you can use the [project packer](/project-generators/project-packer.html). Think about the packer as a bundle that encapsulates a project generator together with a [publisher](/project-generators/publishers.html) factory and executes in a pipeline all the necessary steps so as to have a working project.

In this tutorial, we'll use the **Next project generator** and the **Now publisher**.

<!-- > UNDER CONSTRUCTION -->

```
npm install @teleporthq/teleport-project-generator-next
npm install @teleporthq/teleport-project-packer
npm install @teleporthq/teleport-publisher-now
```

To create a publisher factory, you first need to create a Zeit deploy token from your [account settings](https://zeit.co/account/tokens).
After you have your zeit deploy token, you can begin to create the packer and pack your project:

```js
import { createReactNextGenerator } from "@teleporthq/teleport-project-generator-react-next"
import { createNowPublisher } from "@teleport/teleport-publisher-now"

import { createProjectPacker } from "@teleport/teleport-project-packer"

const ZEIT_TOKEN = "YOUR_ZEIT_DEPLOY_HERE"

const projectUidl = {
  /* ... */
}

// Create the Now publisher
const publisher = createNowPublisher({
  deployToken: ZEIT_TOKEN
})

// Create the project generator
const generatorFactory = createReactNextGenerator()
const { generateProject } = generatorFactory

// Create the packer
const packer = createProjectPacker({
  publisher,
  generatorFunction: generateProject
})

// Pack the project
const result = await packer.pack(projectUidl)

console.log(result)
```

The result will be an object of type `PublisherResponse`

```js
```

Sample output:

```js
{
  success: true,
  payload: 'test'
}
```
