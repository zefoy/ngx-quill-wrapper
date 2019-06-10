import { Component,
  AfterViewInit, Input, Output, EventEmitter,
  ViewChild, HostBinding, ViewEncapsulation } from '@angular/core';

import { QuillDirective } from './quill.directive';

import { QuillConfigInterface, QuillModulesInterface } from './quill.interfaces';

@Component({
  selector: 'quill',
  exportAs: 'ngxQuill',
  templateUrl: '../../dist/lib/quill.component.html',
  styleUrls: [ '../../dist/lib/quill.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class QuillComponent implements AfterViewInit {
  private content: string | null = null;

  @Input()
  set value(value: string) {
    this.setContent(value);
  }

  @Input() disabled: boolean = false;

  @Input() autoToolbar: boolean = false;
  @Input() realToolbar: boolean = false;

  @Input() config?: QuillConfigInterface;

  @Input() modules?: QuillModulesInterface;

  @HostBinding('class.quill')
  @Input() useQuillClass: boolean = true;

  @Output() blur = new EventEmitter<any>();
  @Output() focus = new EventEmitter<any>();

  @Output() valueChange = new EventEmitter<string>();

  @Output() editorCreate = new EventEmitter<any>();
  @Output() contentChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any>();

  @ViewChild(QuillDirective, { static: true }) directiveRef?: QuillDirective;

  constructor() {}

  ngAfterViewInit(): void {
    if (this.content != null) {
      this.setContent(this.content, true);
    }
  }

  private setContent(value: string, force?: boolean): void {
    if (force || value !== this.content) {
      if (this.directiveRef) {
        this.directiveRef.setValue(value, 'silent');
      }

      this.content = value;
    }
  }

  public onContentChange(event: any): void {
    this.content = event.html;

    this.contentChange.emit(event);

    this.valueChange.emit(event.html);
  }
}
