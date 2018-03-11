declare var Focus: any;

import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { QuillComponent, QuillDirective,
  QuillConfigInterface, QuillModulesInterface } from 'ngx-quill-wrapper';

@Component({
  selector: 'my-app',
  moduleId: 'src/app/app.component',
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.css' ]
})
export class AppComponent implements AfterViewInit {
  public show: boolean = true;

  public type: string = 'component';

  public disabled: boolean = false;

  public config: QuillConfigInterface = {
    theme: 'snow',
    readOnly: false
  };

  public modules: QuillModulesInterface = {};

  private toolbar: any = [
    [{ 'size': ['small', false, 'large'] }],

    ['bold', 'italic'],

    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }, { 'list': 'bullet' }]
  ];

  @ViewChild(QuillComponent) componentRef: QuillComponent;
  @ViewChild(QuillDirective) directiveRef: QuillDirective;

  constructor() {
    this.modules = { 'modules/focus': Focus };

    this.config.modules = { toolbar: this.toolbar, focus: { focusClass: 'focused' } };
  }

  ngAfterViewInit(): void {
    // To get the Quill instance:

    // this.directiveRef.quill();
    // this.componentRef.directiveRef.quill();
  }

  public toggleType(): void {
    this.type = (this.type === 'component') ? 'directive' : 'component';
  }

  public toggleTheme(): void {
    this.config.theme = (this.config.theme === 'snow') ? 'bubble' : 'snow';
  }

  public toggleToolbar(): void {
    this.config.modules = (this.config.modules.toolbar) ?
      { toolbar: false } : { toolbar: this.toolbar };
  }

  public toggleDisabled(): void {
    this.disabled = !this.disabled;
  }

  public toggleReadonly(): void {
    this.config.readOnly = (this.config.readOnly === true) ? false : true;
  }

  public clearEditorContent(): void {
    if (this.type === 'directive') {
      this.directiveRef.clear();
    } else if (this.type === 'component') {
      this.componentRef.directiveRef.clear();
    }
  }

  public onEditorBlur(event: any): void {
    console.log('Editor blur:', event);
  }

  public onEditorFocus(event: any): void {
    console.log('Editor focus:', event);
  }

  public onEditorCreate(event: any): void {
    console.log('Editor create:', event);
  }

  public onValueChange(value: string): void {
    console.log('Value change:', value);
  }

  public onContentChange(event: any): void {
    console.log('Content change:', event);
  }

  public onSelectionChange(event: any): void {
    console.log('Selection change:', event);
  }
}
