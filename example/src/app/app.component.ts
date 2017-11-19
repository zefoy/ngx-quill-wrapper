import { Component, ViewChild } from '@angular/core';

import { QuillComponent, QuillDirective, QuillConfigInterface } from 'ngx-quill-wrapper';

@Component({
  selector: 'my-app',
  moduleId: 'src/app/app.component',
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.css' ]
})
export class AppComponent {
  public show: boolean = true;

  public type: string = 'component';

  public disabled: boolean = false;

  public config: QuillConfigInterface = {
    theme: 'snow',
    readOnly: false
  };

  private toolbar: any = [
    [{ 'size': ['small', false, 'large'] }],

    ['bold', 'italic'],

    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }, { 'list': 'bullet' }]
  ];

  @ViewChild(QuillComponent) componentRef: QuillComponent;
  @ViewChild(QuillDirective) directiveRef: QuillDirective;

  constructor() {
    this.config.modules = { toolbar: this.toolbar };
  }

  toggleType() {
    this.type = (this.type === 'component') ? 'directive' : 'component';
  }

  toggleTheme() {
    this.config.theme = (this.config.theme === 'snow') ? 'bubble' : 'snow';
  }

  toggleToolbar() {
    this.config.modules = (this.config.modules.toolbar) ?
      { toolbar: false } : { toolbar: this.toolbar };
  }

  toggleDisabled() {
    this.disabled = !this.disabled;
  }

  toggleReadonly() {
    this.config.readOnly = (this.config.readOnly === true) ? false : true;
  }

  clearEditorContent() {
    if (this.type === 'directive') {
      this.directiveRef.clear();
    } else if (this.type === 'component') {
      this.componentRef.directiveRef.clear();
    }
  }

  onEditorBlur(event: any) {
    console.log('Editor blur:', event);
  }

  onEditorFocus(event: any) {
    console.log('Editor focus:', event);
  }

  onEditorCreate(event: any) {
    console.log('Editor create:', event);
  }

  onValueChange(value: string) {
    console.log('Value change:', value);
  }

  onContentChange(event: any) {
    console.log('Content change:', event);
  }

  onSelectionChange(event: any) {
    console.log('Selection change:', event);
  }
}
