# Pack and Publish Your Project

When used standalone, a [project generator's](/project-generators/flavors.html) output is an in-memory folder structure. This allows you to run the generator in any environment without depending on the ability to write to the disk.

If you want to have a running app and, you can use the [project packer](/project-generators/project-packer.html).

In this tutorial, we'll use the **Next project generator** and the **Now publisher**.

:::tip
There are [multiple publishers available](/project-generators/publishers.html), part of the **teleportHQ** ecosystem. The setup is similar and you can find the [complete API documentation](/project-generators/publishers.html) in the corresponding section of the docs.
:::

Now, let's start our project packer setup. First, install the dependencies: the **project generator**, the **project-packer** package as well as the **now** publisher.

```
npm install @teleporthq/teleport-project-generator-next
npm install @teleporthq/teleport-project-packer
npm install @teleporthq/teleport-publisher-now
```

To create a `now` publisher, you first need to create a Zeit deploy token from your [account settings](https://zeit.co/account/tokens).
After you have your **zeit deploy token**, you can begin to create the packer and pack your project:

```js
import ProjectPacker from "@teleport/teleport-project-packer"
import NextGenerator from "@teleporthq/teleport-project-generator-next"
import NowPublisher from "@teleport/teleport-publisher-now"

const ZEIT_TOKEN = "YOUR_ZEIT_DEPLOY_HERE"
const projectUidl: ProjectUIDL = {
  /* ... */
}

NowPublisher.setAccessToken(ZEIT_TOKEN)

ProjectPacker.setPublisher(NowPublisher)
ProjectPacker.setGenerator(NextGenerator)

const result = await ProjectPacker.pack(projectUidl)

console.log(result)
```

The result will be an object of type `PublisherResponse`

Sample output:

```js
{
  success: true
  payload: "https://teleport-project-template-next.now.sh"
}
```
