module.exports = {
  head: [
    ["link", { rel: "icon", href: "/icons/icon-96x96.png" }],
    ["link", { rel: "manifest", href: "/manifest.json" }],
    ["meta", { name: "theme-color", content: "#822cec" }],
    ["link", { rel: "apple-touch-icon", href: "/icons/icon-152x152.png" }],
  ],
  title: "teleportHQ Code Generators",
  description:
    "Building the infrastructure for the next generation of web and mobile interfaces",
  dest: "dist",
  plugins: [
    [
      "@vuepress/pwa",
      {
        updatePopup: true,
      },
    ],
    [
      "vuepress-plugin-google-tag-manager",
      {
        gtm: "GTM-5HFFGVX",
      },
    ],
  ],
  evergreen: true,
  themeConfig: {
    nav: [
      { text: "Try our Playground", link: "https://play.teleporthq.io" },
      { text: "REPL", link: "https://repl.teleporthq.io" },
    ],
    logo: "/logo.svg",
    sidebar: [
      {
        title: "Guides",
        children: [
          "guides/what-is-this",
          "guides/getting-started",
          "guides/custom-component-generator",
          "guides/generate-your-first-project",
          "guides/customize-your-project-generator",
          "guides/pack-and-publish-your-project",
          "guides/glossary",
        ],
      },
      {
        title: "UIDL",
        children: ["uidl/", "uidl/structure", "uidl/examples", "uidl/support"],
      },
      {
        title: "Component Generators",
        children: [
          "component-generators/",
          "component-generators/flavors",
          "component-generators/features",
          "component-generators/mappings",
          "component-generators/plugins",
          "component-generators/post-processors",
        ],
      },
      {
        title: "Project Generators",
        children: [
          "project-generators/",
          "project-generators/flavors",
          "project-generators/features",
          "project-generators/project-strategy",
          "project-generators/project-template",
          "project-generators/project-packer",
          "project-generators/publishers",
        ],
      },
      {
        title: "Community",
        children: [
          "community/",
          "community/contact-us",
          "community/contributors",
        ],
      },
      {
        title: "Team",
        children: ["team/", "team/vision"],
      },
    ],
    sidebarDepth: 3,
    displayAllHeaders: false,
    lastUpdated: "Last Updated",
    repo: "teleporthq/teleport-code-generators",
    repoLabel: "Contribute on GitHub!",
    docsRepo: "teleporthq/teleport-documentation",
    editLinks: true,
    editLinkText: "Help us improve this page!",
  },
};
