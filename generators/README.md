# TeleportHQ Code Generators

The web platform did not embrace visual editors as the standard way of building UIs. However, we believe code generation is the future and we're dedicating a lot of effort in engineering **scalable**, **extensible** and **reusable** code generation tools. Our code generators output **modern JavaScript** in files linked together by with the `ES Modules` standard. We also believe in the modern approach of **component** driven **architecture**, so we worked around the `React` and `Vue` ecosystems. This does not mean that we are neglecting other output targets, but it was easier for us to start with just a few popular options. We also picked two different types of output to show that we can easily switch from one target to another, while building the same functionality from the UI perspective.

## Quality First

It is our strong belief that visual editor tools should generate the best possible quality from the point of view of machine generated code. Developers should be able to open a project that they generate with our tool and instantly feel like home. The user interfaces should be clearly separated into components and each component should reflect the common good practices and patterns that are popular in the community. Hence, our effort in that direction is significant. This also means that we are open to improvements at all times, since we are fully aware of the everchanging landscape of frontend development.

## Transparent Process and Planning

Technical decisions were made and will be made in the future. Our process will be as transparent as possible as we strongly believe in open source and transparency. Hence, we will slowly move our entire planning and thinking process towards github, where we will invite the community to join, in an effort to develop the code generators ecosystem as reliably and as stable as possible. Considering that our aim is to build a community around our open source code, we decided to build a modular architecture and a plugin based system that allows us to decompose our code generators into smaller parts that can be re-assembled in new ways.

## High level architecture

### Element mapping (incl attr references, children and repeat)

### Component Assembly Line

### Plugins

### Chunks and Builder

## API

## Internals

### ASTs - Babel Types

### XML

### JSS

### Prettier

## Official Component Generators

### Common flow and plugins

### API

### React

### Vue

### Routing Components

## Official Project Generators

### Common flows: entry files, manifest

### Project Templates

### Asset Management

### React

### Next

### Vue

### Nuxt

## Limitations and future explorations
