import { Component, ViewChild } from '@angular/core';

import { QuillComponent, QuillDirective, QuillConfigInterface } from 'ngx-quill-wrapper';

@Component({
  selector: 'my-app',
  moduleId: module.id.toString(),
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.css' ]
})
export class AppComponent {
  public show: boolean = true;

  public type: string = 'component';

  public config: QuillConfigInterface = {
    theme: 'snow',
    readOnly: false,
    modules: {
      toolbar: [
        [{ 'size': ['small', false, 'large'] }],

        ['bold', 'italic'],

        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }, { 'list': 'bullet' }]
      ]
    }
  };

  @ViewChild(QuillComponent) componentRef: QuillComponent;
  @ViewChild(QuillDirective) directiveRef: QuillDirective;

  constructor() {}

  toggleType() {
    this.type = this.type === 'component' ? 'directive' : 'component';
  }

  toggleTheme() {
    this.config.theme = (this.config.theme === 'snow') ? 'bubble' : 'snow';
  }

  toggleReadonly() {
    this.config.readOnly = (this.config.readOnly === true) ? false : true;
  }

  onEditorCreate(event: any) {
    console.log('Editor create: ', event);
  }

  onContentChange(event: any) {
    console.log('Content change: ', event);
  }

  onSelectionChange(event: any) {
    console.log('Selection change: ', event);
  }
}
