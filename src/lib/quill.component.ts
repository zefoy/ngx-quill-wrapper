import { Component,
  AfterViewInit, Input, Output, EventEmitter,
  ViewChild, HostBinding, ViewEncapsulation } from '@angular/core';

import { QUILL_CONFIG } from './quill.interfaces';

import { QuillDirective } from './quill.directive';

import { QuillConfigInterface } from './quill.interfaces';

@Component({
  selector: 'quill',
  exportAs: 'ngxQuill',
  templateUrl: './lib/quill.component.html',
  styleUrls: [ './lib/quill.component.css' ],
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

  @Output() blur = new EventEmitter<any>();
  @Output() focus = new EventEmitter<any>();

  @Output() valueChange = new EventEmitter<string>();

  @Output() editorCreate = new EventEmitter<any>();
  @Output() contentChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any>();

  @ViewChild(QuillDirective) directiveRef: QuillDirective;

  constructor() {}

  ngAfterViewInit() {
    if (this.content != null) {
      this.setContent(this.content, true);
    }
  }

  private setContent(value: string, force?: boolean) {
    if (force || value !== this.content) {
      if (this.directiveRef && this.directiveRef.quill()) {
        const contents = this.directiveRef.quill().clipboard.convert(value);

        this.directiveRef.quill().setContents(contents, 'silent');
      }

      this.content = value;
    }
  }

  public onContentChange(event: any) {
    this.content = event.html;

    this.contentChange.emit(event);

    this.valueChange.emit(event.html);
  }
}
