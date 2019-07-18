# Project Templates
The template is the starting structure of the project generation. It can be an empty folder (default fallback) or it can be a folder with files and subfolders as well. A typical project template might contain predefined folders and configuration files for your project.

You can send the template in two formats:

## Template Folder
You can define a `GeneratedFolder` structure like the following:

```json
{
  "name": "project-name",
  "files": [],
  "subFolders": [
    {
      "name": "components",
      "files": [],
      "subFolders": []
    },
    {
      "name": "pages",
      "files": [],
      "subFolders": []
    },
    {
      "name": "public",
      "files": [],
      "subFolders": []
    }
  ]
}
```
and pass it to the project generator.

## Remote Template
You can also pass a `RemoteTemplateDefinition` structure. You can use this one when the template is stored on your Github account. In order to identify the template, the github `username` and the `repository` name are required.

There's also an *optional* parameter, the `auth`, used for authenticated requests to the Github API (due to the low rate limit of their API).

```ts
interface RemoteTemplateDefinition {
  username: string
  repo: string
  auth?: ServiceAuth
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
The generated pages and components will live in the template under the path you define in the [strategy](/project-generators/project-strategy.html)
:::