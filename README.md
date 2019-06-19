---
home: true
heroImage: /hero.png
actionText: Get Started →
actionLink: /guides/getting-started.html
features:
  - title: Platform Independent
    details: Using the same UI representation, you can build modern Web & Mobile applications.
  - title: Plugable Architecture
    details: Our plugin system allows you to customize your exported code to the last detail.
  - title: An Open Community
    details: We open-sourced our entire ecosystem and we invite everyone to contribute to it!
footer: MIT Licensed | Copyright © 2019-teleport
---

### Welcome to our docs site!

You'll find here all the necessary information about our universal format for describing user interfaces (UIDL) and about our [**open-source code generators**](https://github.com/teleporthq/teleport-code-generators). They are the underlying infrastructure on top of which we're constructing our **ecosystem** of automated user interface building tools.

### UIDL

All user interfaces serve the same purpose: allow for an interaction between a human and a machine.

Functionally speaking, the vocabulary of human-machine interaction is well defined. No matter the medium or the technology used behind it, a user interface will likely be built with a dozen atomic visual **elements** such as: _titles_, _paragraphs_, _inputs_, _images_, _videos_, _links_, _buttons_, etc., and a couple of meaningful **compositions** of these elements such as _lists_, _tables_, _forms_ and _menus_.

However, over time the number of channels has increased dramatically (web, mobile, tablets, tv, AR/VR) and the number of technologies used for each of those channels as well. This has resulted in an increased human time cost of building a user interface and distributing it to each channel while providing no extra value for the end user.

This is why we have decided to search for a solution which would allow us to focus more on the **what** and worry less about the **how**.

Like others before us, we decided to work on a **universal format** that could describe all the possible scenarios for a given user interface. This format allows us to:

- generate the same user interface with various tools and frameworks
- transition from one code output to another without effort
- enable efficient and advanced programmatic manipulation

We have named our universal format **"User Interface Definition Language" (UIDL)**. It is represented by a human-readable JSON document, a format supported natively by many programming languages, and easy to manipulate.

:::warning
The UIDL format is intended to be an intermediary format between creation tools and the teleport code generators. While the JSON format is editable and writable by humans, this is not the intended use.
:::

Although at the beginning the role of the UIDL seemed to be limited to describing the UI elements and their relationship, we are now confident that we can use it also to describe user interactions, flows, events, and more complicated UI patterns based on component architectures and dynamic data driven applications.

For more details, [jump to the UIDL section of the docs](/uidl/).

### Code Generators

The web platform did not embrace visual editors as the standard way of building UIs. However, we believe code generation is the future and we're dedicating a lot of effort in engineering **scalable**, **extensible** and **reusable** code generation tools.

The teleport code generators output modern code in files linked together by with the `ES Modules` standard. The philosophy of code generation revolves around the idea of splitting the interface into **components**, a common approach of structuring modern interfaces.

For more details, [jump to the generators section of the docs](/component-generators/).

### REPL

We developed a small [REPL online tool](https://repl.teleporthq.io/), where you can play around with various examples of UIDLs and check the generated code in different flavors.

### Get Involved 💕

This is an open invitation to the entire community to join us in exploring the future of building interfaces!

Keep in mind that there's a lot of work in progress, and many things still need to be done. Our roadmap is public and you can follow it on the [Github repo](https://github.com/teleporthq/teleport-code-generators/issues).

We're also super interested in listening to your feedback and suggestions. Please feel free to get in touch with us on [Twitter](https://twitter.com/teleporthqio) or over [email](mailto:hello@teleporthq.io). Even better, if you are in love with the topic, you could join our wonderful group of OSS contributors and build magic with us!
