# Angular Quill Wrapper

<a href="https://badge.fury.io/js/ngx-quill-wrapper"><img src="https://badge.fury.io/js/ngx-quill-wrapper.svg" align="right" alt="npm version" height="18"></a>

This is an Angular wrapper library for the [Quill](http://quilljs.com/).

See a live example application <a href="https://zefoy.github.io/ngx-quill-wrapper/">here</a>.

### Building the library

```bash
npm install
npm run build
npm run inline
```

### Running the example

```bash
cd example
npm install
npm start
```

### Installing and usage

```bash
npm install ngx-quill-wrapper --save
```

##### Load the module for your app (with optional global config):

```javascript
import { QuillModule } from 'ngx-quill-wrapper';
import { QUILL_CONFIG } from 'ngx-quill-wrapper';
import { QuillConfigInterface } from 'ngx-quill-wrapper';

const DEFAULT_QUILL_CONFIG: QuillConfigInterface = {
  theme: 'snow',
  modules: {
    toolbar: true
  }
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

##### Use it in your HTML template (with optional custom config):

This library provides two ways to create a Quill element, simple component and custom directive.

**COMPONENT USAGE**

Simply replace the element that would ordinarily be passed to `Quill` with the quill component.

**NOTE:** Component provides default toolbar element which you can enable by setting the appropriate configuration to 'true' or by providing custom toolbar config. If you want to use custom toolbar then you need to use custom selector / provide the element or use the toolbar attribute.

```html
<quill [config]="config" [(content)]="content">
  <div quillToolbar><!-- Optional custom toolbar --></div>

  <div quillContent><!-- Optional pre-filled content --></div>
</quill>
```

```javascript
[config]           // Custom config to override the global defaults.
[disabled]         // Disables all quill functionality (locks the quill).

[ngModel]          // Set initial value or allow two-way data binding.

[autoToolbar]      // Only show toolbar when the editor is focused.
                   // Allows using same toolbar for multiple editors.

[useQuillClass]    // Use quill class (use provided default styles).

(editorCreate)     // Event handler for the quill editor create event.
(contentChange)    // Event handler for the quill content change event.
(selectionChange)  // Event handler for the quill selection change event.
```

**DIRECTIVE USAGE**

When using only the directive you need to provide your own theming or import the theme:

```css
@import '~quill/dist/quill.snow.css' // Or quill.bubble.css if bubble theme is used
```

Quill directive can be used in correctly structured div element with optional custom config:

```html
<div class="quill-editor" [quill]="config" [(content)]="content">
  <div class="quill-toolbar"><!-- Optional custom toolbar --></div>

  <p>Existing content for the editor</p>
</div>
```

```javascript
[quill]            // Custom config to override the global defaults.
[disabled]         // Disables all quill functionality (locks the quill).

[autoToolbar]      // Only show toolbar when the editor is focused.
                   // Allows using same toolbar for multiple editors.

(editorCreate)     // Event handler for the quill editor create event.
(contentChange)    // Event handler for the quill content change event.
(selectionChange)  // Event handler for the quill selection change event.
```

##### Available configuration options (both custom and global config):

```javascript
theme              // Theme to use: 'snow' or 'bubble' (Default: 'snow').
modules            // Options for the quill modules (Default: {toolbar: true}).
placeholder        // Placeholder text to show when no content (Default: null).
```

For more detailed documentation with all the supported config options see [quill documentation](http://quilljs.com/docs/configuration/).

##### Available control / helper functions (provided by the directive):

```javascript
quill()            // Returns the Quill instance reference for full API access.

clear(source?)     // Clear the editor content (source: 'api', 'user', 'silent').
```

Above functions can be accessed through the directive reference (available as directiveRef in the component).
