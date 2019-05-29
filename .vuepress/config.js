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
        title: "Generators",
        children: [
          "generators/",
          "generators/flavors",
          "generators/plugins",
          "generators/post-processors",
          "generators/project-packer",
          "generators/publishers",
          "generators/api-reference"
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
