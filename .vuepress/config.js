module.exports = {
  title: "teleportHQ Code Generators",
  description:
    "Building the infrastructure for the next generation of web and mobile interfaces",
  dest: "dist",
  serviceWorker: true,
  evergreen: true,
  themeConfig: {
    nav: [
      { text: "REPL", link: "https://repl.teleporthq.io" }
    ],
    logo: "/logo.svg",
    sidebar: [
      {
        title: "Guides",
        children: [
          "guides/what-is-this",
          "guides/getting-started",
          "guides/custom-generator",
          "guides/glossary"
        ]
      },
      {
        title: "UIDL",
        children: [
          "uidl/",
          "uidl/examples",
          "uidl/support"
        ]
      },
      {
        title: "Component Generators",
        children: [
          "component-generators/",
          "component-generators/flavors",
          "component-generators/mappings",
          "component-generators/plugins",
          "component-generators/post-processors",
          "component-generators/api-reference"
        ]
      },
      {
        title: "Project Generators",
        children: [
          "project-generators/",
          "project-generators/flavors",
          "project-generators/project-packer",
          "project-generators/publishers",
        ]
      },
      {
        title: "Community",
        children: [
          "community/",
          "community/contact-us",
          "community/contributors"
        ]
      },
      {
        title: "Team",
        children: [
          "team/",
          "team/vision",
          "team/funding",
          "team/privacy-policy"
        ]
      }
    ],
    sidebarDepth: 3,
    displayAllHeaders: false,
    lastUpdated: "Last Updated",
    repo: "teleporthq/teleport-code-generators",
    repoLabel: "Contribute on GitHub!",
    docsRepo: "teleporthq/teleport-documentation",
    editLinks: true,
    editLinkText: "Help us improve this page!"
  }
};
