# Features
Here's a quick reference to all the features that are supported by component generators and a quick explanation for the specific implementation in each framework flavor:

|                      | React                              | Vue                            | Angular                           | Stencil                           | Preact                            |
|----------------------|------------------------------------|--------------------------------|-----------------------------------|-----------------------------------|-----------------------------------|
| Lib Dependencies     | React, { useState }                | n/a                            | { Component, Input }              | { Component, h, Prop, State }     | { Component }                     |
| Import Statements    | import plugin                      | import plugin                  | import plugin                     | import plugin                     | import plugin                     |
| Component Shell      | Arrow function with hooks          | export default Vue obj         | export class + decorator          | export class + decorator          | Arrow func or Class with state    |
| Dependencies Decl.   | n/a                                | components key in Vue obj      | n/a                               | n/a                               | n/a                               |
| Element Node         | JSX Tag                            | HTML Tag                       | HTML Tag                          | JSX Tag                           | JSX Tag                           |
| Static Attr          | JSX Attr                           | HTML Attr                      | HTML Attr                         | JSX Attr                          | JSX Attr                          |
| Static Array Attr    | JSX Expression key={ value }       | :key="value" + add on data     | [key]="value" + add in class      | JSX Expression key={ value }      | :key="value" + add on data        |
| Dynamic Attr         | JSX Expression key={ value }       | :key="value"                   | [key]="value"                     | JSX Expression key={ value }      | :key="value"                      |
| Event Handler        | inline handler event={ () => { } } | @event="handler" + methods obj | (event)="handler" + class prop    | inline handler event={() => { }}  | inline handler event={() => { }}  |
| State Change         | hook call setStateKey(newValue)    | this.stateKey = newValue       | this.stateKey = newValue          | this.stateKey = newValue          | this.setState()                   |
| State Toggle         | hook call setStateKey(!stateKey)   | this.stateKey = !this.stateKey | this.stateKey = !this.stateKey    | this.stateKey = !this.stateKey    | this.setState()                   |
| Prop Call            | props.propKey(args)                | this.$emit(propKey)            | work in progress                  | props.propKey(args)               | props.propKey(args)               |
| Static Style         | CSS plugin - extract to .css       | CSS plugin - extract to .css   | CSS plugin - extract to .css      | CSS plugin - extract to .css      | CSS plugin - extract to .css      |
| Dynamic Style        | InlineStyle with JSX Expression    | Inline Style - :style\="{...}" | Inline Style - [ngStyle]\="{...}" | InlineStyle with JSX Expression   | InlineStyle with JSX Expression   |
| Static Node          | JSX Text                           | HTML Text                      | HTML Text                         | JSX Text                          | JSX Text                          |
| Dynamic Node         | JSX Expression { }                 | Template {{ }}                 | Template {{ }}                    | JSX Expression { }                | JSX Expression { }                |
| Conditional Node     | Conditional Render (cond && value) | v-if attr                      | *ngIf attr                        | Conditional Render(cond && value) | Conditional Render(cond && value) |
| Repeat Node          | array.map with callback            | v-for attr                     | *ngFor attr                       | array.map with callback           | array.map with callback           |
| Repeat Key           | JSX Expression key={ }             | attr :key="key"                | attr [attr.key]="key"             | JSX Expression key={ }            | JSX Expression key={ }            |
| Basic Slot           | { props.children }                 | \<slot\>                       | \<slot\>                          | \<slot\>                          | { props.children }                |
| Named Slot           | n/a                                | \<slot name=""\>               | \<slot name=""\>                  | \<slot name=""\>                  | n/a                               |
| Prop Representation  | props.propKey                      | propKey / this.propKey         | propKey / this.propKey            | this.propKey                      | props.propKey                     |
| State Representation | stateKey (declared with hooks)     | stateKey / this.stateKey       | stateKey / this.stateKey          | this.stateKey                     | this.state.stateKey               |
| Local Representation | localKey                           | localKey / this.localKey       | localKey / this.localKey          | this.localKey                     | localKey                          |
| Prop Definition      | PropTypes plugin                   | props object on component      | class members with types          | class members with types          | PropTypes plugin                  |