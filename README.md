# Angular Quill Wrapper

<a href="https://badge.fury.io/js/ngx-quill-wrapper"><img src="https://badge.fury.io/js/ngx-quill-wrapper.svg" align="right" alt="npm version" height="18"></a>

This is an Angular wrapper library for the [Quill](http://quilljs.com/). To use this library you should get familiar with the Quill documentation as well since this documentation only explains details specific to this wrapper.

### Quick links

[Example application](https://zefoy.github.io/ngx-quill-wrapper/)
 |
[StackBlitz example](https://stackblitz.com/github/zefoy/ngx-quill-wrapper/tree/master/example)
 |
[Quill documentation](http://quilljs.com/docs/configuration/)

### Building the library

```bash
npm install
npm start
```

### Running the example

```bash
cd example
npm install
npm start
```

### Library development


```bash
npm link
cd example
npm link ngx-quill-wrapper
```

### Installing and usage

```bash
npm install ngx-quill-wrapper --save
```

##### Load the module for your app (with global configuration):

Providing the global configuration is optional and when used you should only provide the configuration in your root module.

```javascript
import { QuillModule } from 'ngx-quill-wrapper';
import { QUILL_CONFIG } from 'ngx-quill-wrapper';
import { QuillConfigInterface } from 'ngx-quill-wrapper';

const DEFAULT_QUILL_CONFIG: QuillConfigInterface = {
  theme: 'snow',
  modules: {
    toolbar: true
  },
  placeholder: 'Empty canvas'
};

@NgModule({
  ...
  imports: [
    ...
    QuillModule
  ],
  providers: [
    {
      provide: QUILL_CONFIG,
      useValue: DEFAULT_QUILL_CONFIG
    }
  ]
})
```

##### Use it in your HTML template (with custom configuration):

This library provides two ways to create a Quill element, component for simple use cases and directive for more custom use cases.

**COMPONENT USAGE**

Simply replace the element that would ordinarily be passed to `Quill` with the quill component.

**NOTE:** Component provides default toolbar element which you can enable by setting the appropriate configuration to 'true' or by providing custom toolbar config. If you want to use a custom toolbar then you might want to use the directive instead.

```html
<quill [config]="config" [(value)]="value">
  <div quillToolbar><!-- Optional custom toolbar --></div>

  <div quillContent><!-- Optional pre-filled content --></div>
</quill>
```

```javascript
[config]                // Custom config to override the global defaults.

[modules]               // Extra custom modules to register for the Quill.
                        // Formatting example: { 'modules/focus': Focus }

[value]                 // Input value of the Quill editor content (html).

[disabled]              // Disables all functionality of Quill and modules.

[autoToolbar]           // Only show toolbar when the editor is focused.
                        // Allows using same toolbar for multiple editors.

[realToolbar]           // Use toolbar as it is without cloning the node.

[useQuillClass]         // Use quill class (use provided default styles).

(valueChange)           // Event handler for the input value change event.

(editorCreate)          // Event handler for the Quill editor create event.
(contentChange)         // Event handler for the Quill content change event.
(selectionChange)       // Event handler for the Quill selection change event.
```

**DIRECTIVE USAGE**

When using only the directive you need to provide your own theming or import the theme:

```css
@import '~quill/dist/quill.snow.css' // Or quill.bubble.css if bubble theme is used
```

Quill directive can be used in correctly structured div element with optional custom configuration:

```html
<div class="quill" [quill]="config" (contentChange)="onContentChange($event)">
  <div class="quill-toolbar"><!-- Optional custom toolbar --></div>

  <p>Existing content for the editor</p>
</div>
```

```javascript
[quill]                      // Custom config to override the global defaults.

[modules]                    // Extra custom modules to register for the Quill.
                             // Formatting example: { 'modules/focus': Focus }

[disabled]                   // Disables all functionality of Quill and modules.

(editorCreate)               // Event handler for the Quill editor create event.
(contentChange)              // Event handler for the Quill content change event.
(selectionChange)            // Event handler for the Quill selection change event.
```

##### Available configuration options (custom / global configuration):

```javascript
theme                        // Theme to use: 'snow' or 'bubble' (Default: 'snow').
modules                      // Options for the Quill modules (Default: {toolbar: true}).
placeholder                  // Placeholder text to show when no content (Default: null).
```

For more detailed documentation with all the supported config options see the Quill documentation.

##### Available control / helper functions (provided by the directive):

```javascript
quill()                      // Returns the Quill instance reference for full API access.

clear(source?)               // Clear the editor content (source: 'api', 'user', 'silent').

getValue()                   // Returns the current text content of the editor document.

setValue(value, source?)     // Updates the editor content (source: 'api', 'user', 'silent').
```

Above functions can be accessed through the directive reference (available as directiveRef in the component).
