# Pack and Publish Your Project

When used standalone, a [project generator's](/project-generators/flavors.html) output is an in-memory folder structure. This allows you to run the generator in any environment without depending on the ability to write to the disk.

If you want to have a running app and, you can use the [project packer](/project-generators/project-packer.html).

In this tutorial, we'll use the **Next project generator** and the **Now publisher**.

```
npm install @teleporthq/teleport-project-generator-react-next
npm install @teleporthq/teleport-project-packer
npm install @teleporthq/teleport-publisher-now
```

To create a `now` publisher, you first need to create a Zeit deploy token from your [account settings](https://zeit.co/account/tokens).
After you have your **zeit deploy token**, you can begin to create the packer and pack your project:

```js
import ProjectPacker from "@teleport/teleport-project-packer"
import ReactNextGenerator from "@teleporthq/teleport-project-generator-react-next"
import NowPublisher from "@teleport/teleport-publisher-now"

const ZEIT_TOKEN = "YOUR_ZEIT_DEPLOY_HERE"
const projectUidl: ProjectUIDL = {
  /* ... */
}

NowPublisher.setAccessToken(ZEIT_TOKEN)

ProjectPacker.setPublisher(NowPublisher)
ProjectPacker.setGenerator(ReactNextGenerator)

const result = await ProjectPacker.pack(projectUidl)

console.log(result)
```

The result will be an object of type `PublisherResponse`

Sample output:

```js
{
  success: true
  payload: "https://teleport-project-template-react-next.now.sh"
}
```
