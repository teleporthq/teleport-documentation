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
        children: ["guides/getting-started", "guides/custom-generator"]
      },
      {
        title: "UIDL",
        children: ["uidl/", "uidl/examples", "uidl/support"]
      },
      {
        title: "Component Generators",
        children: [
          "component-generators/",
          "component-generators/flavors",
          "component-generators/plugins",
          "component-generators/post-processors"
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
          "community/oss",
          "community/howTo",
          "community/missing",
          "community/stuck"
        ]
      },
      {
        title: "Team",
        children: [
          "team/about-us",
          "team/vision",
          "team/funding",
          "team/privacy-policy"
        ]
      },
      "/links/",
      "/glossary/"
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
