module.exports = {
    title: 'Teleport documentation',
    description: 'A collection of code generators for modern JavaScript applications',
    dest: 'dist',
    serviceWorker: true,
    evergreen: true,
    themeConfig: {
        nav: [
            { text: 'REPL', link: 'https://repl.teleporthq.io' },
            {
                text: 'Versions',
                items: [
                    { text: 'v7.0', link: 'https://v7.docs.teleporthq.io' },
                    { text: 'v8.0', link: 'https://v8.docs.teleporthq.io' }
                ]
            }
        ],
        logo: '/logo.svg',
        sidebar: [
            '/uidl/',
            '/generators/',
            '/plugins/'
        ],
        sidebarDepth: 1,
        displayAllHeaders: true,
        lastUpdated: 'Last Updated',
        repo: 'teleporthq/teleport-code-generators',
        repoLabel: 'Contribute!',
        docsRepo: 'teleporthq/teleport-documentation',
        editLinks: true,
        editLinkText: 'Help us improve this page!'
    }
}