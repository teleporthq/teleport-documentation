# Features
Here's a quick reference to all the features that are supported by project generators and a quick explanation for the specific implementation in each framework flavor:

|                    |     react-basic     |    react-next    |   vue-basic   |    vue-nuxt   |
|--------------------|:-------------------:|:----------------:|:-------------:|:-------------:|
| comp generator     |        react        |       react      |      vue      |      vue      |
| page generator     |        react        |       react      |      vue      |      vue      |
| page name routing  |         n/a         |         x        |      n/a      |       x       |
| custom title       |          -          |         -        |       -       |       -       |
| custom meta        |          -          |         -        |       -       |       -       |
| router file        |       index.js      |        n/a       |   router.js   |      n/a      |
| navlink            | Link - react-router | Link - next/link |  router-link  |   nuxt-link   |
| entry file         |      index.html     |   _document.js   |   index.html  |   index.html  |
| global meta/assets |          x          |         x        |       x       |       x       |
| web manifest file  |    manifest.json    |   manifest.json  | manifest.json | manifest.json |
| package.json       |          x          |         x        |       x       |       x       |
| assets             |          x          |         x        |       x       |       x       |