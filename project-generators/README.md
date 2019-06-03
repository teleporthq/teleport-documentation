# Architecture

Project generation is completely different compared to component generation. From
a high level perspective it is composed of the following:

- creation of the generator function via a factory provided by our packages or by
  user configuration
- passing of json data to the created function
- project uidl data parsing and validation
- splittig the UDIL content into multiple components
- delegatig the generation of each component to specialized component generators
  inside the project generator
- accumulating the content form each component generator into a single strucutre
- merging in the boilerplate content (like package.json and config files)
- writing either to disk or (in the future) to clouds the final generated project

> UNDER CONSTRUCTION

## Routing Components

## Common flows: entry files, manifest

## Project Templates

## Asset Management