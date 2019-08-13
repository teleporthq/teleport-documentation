# UI Representation

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

