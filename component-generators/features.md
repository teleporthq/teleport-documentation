# Features
Here's a quick reference to all the features that are supported by component generators and a quick explanation for the specific implementation in each framework flavor:

|                          | React (with CSSModules)               | Vue                               |
|--------------------------|---------------------------------------|-----------------------------------|
| Lib Dependencies         | React, { useState }                   | n/a                               |
| Import Statements        | import plugin                         | import plugin                     |
| Component Shell          | Arrow function with hooks declaration | export default Vue obj            |
| Dependencies Declaration | n/a                                   | components key in Vue obj         |
| Element Node             | JSX Tag                               | HTML Tag                          |
| Static Attr              | JSX Attr                              | HTML Attr                         |
| Static Array Attr        | JSX Expression key={ value }          | :key="value" + add on data        |
| Dynamic Attr             | JSX Expression key={ value }          | :key="value"                      |
| Event Handler            | inline handler event={ () => { } }    | @event="handler" + add on methods |
| State Change             | hook call setStateKey(newValue)       | this.stateKey = newValue          |
| State Toggle             | hook call setStateKey(!stateKey)      | this.stateKey = !this.stateKey    |
| Prop Call                | props.propKey(args)                   | this.$emit(propKey)               |
| Static Style             | CSSModules plugin - extract to .css   | CSS plugin - extract to .css      |
| Dynamic Style            | Inline Style inside JSX Expression    | Inline Style - :style="{...}"     |
| Static Node              | JSX Text                              | HTML Text                         |
| Dynamic Node             | JSX Expression { }                    | Template {{ }}                    |
| Conditional Node         | Conditional Render (cond && value)    | v-if attr                         |
| Repeat Node              | array.map with callback               | v-for attr                        |
| Repeat Key               | JSX Expression key={ }                | attr :key="key"                   |
| Basic Slot               | { props.children }                    | \<slot\>                          |
| Named Slot               | n/a                                   | \<slot name=""\>                  |
| Prop Representation      | props.propKey                         | propKey / this.propKey            |
| State Representation     | stateKey (declared with hooks)        | stateKey / this.stateKey          |
| Local Representation     | localKey                              | localKey / this.localKey          |
| Prop Definition          | PropTypes plugin                      | props object on component         |