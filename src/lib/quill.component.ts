import { Component, AfterViewInit, Input, Output, EventEmitter,
  HostBinding, ViewChild, ViewEncapsulation } from '@angular/core';

import { QUILL_CONFIG } from './quill.interfaces';

import { QuillDirective } from './quill.directive';

import { QuillConfigInterface } from './quill.interfaces';

@Component({
  selector: 'quill',
  templateUrl: './quill.component.html',
  styleUrls: [ './quill.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class QuillComponent implements AfterViewInit {
  private content: string = null;

  @Input()
  set value(value: string) {
    this.setContent(value);
  }

  @Input() disabled: boolean = false;

  @Input() autoToolbar: boolean = false;

  @Input() config: QuillConfigInterface;

  @HostBinding('class.quill')
  @Input() useQuillClass: boolean = true;

  @ViewChild(QuillDirective) directiveRef: QuillDirective;

  @Output() blur = new EventEmitter<any>();
  @Output() focus = new EventEmitter<any>();

  @Output() valueChange = new EventEmitter<string>();

  @Output() editorCreate = new EventEmitter<any>();
  @Output() contentChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any>();

  constructor() {}

  ngAfterViewInit() {
    if (this.content != null) {
      this.setContent(this.content);
    }
  }

  private setContent(value: string) {
    if (!this.directiveRef || !this.directiveRef.quill()) {
      this.content = value;
    } else {
      const contents = this.directiveRef.quill().clipboard.convert(value);

      this.directiveRef.quill().setContents(contents, 'silent');
    }
  }

  public onContentChange(event: any) {
    this.contentChange.emit(event);

    this.valueChange.emit(event.html);
  }
}
