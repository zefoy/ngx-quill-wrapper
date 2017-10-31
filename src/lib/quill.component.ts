import { Component, Input, Output, EventEmitter,
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
export class QuillComponent {
  @Input() disabled: boolean = false;

  @Input() config: QuillConfigInterface;

  @HostBinding('class.quill')
  @Input() useQuillClass: boolean = true;

  @ViewChild(QuillDirective) directiveRef: QuillDirective;

  @Output() blur = new EventEmitter<any>();
  @Output() focus = new EventEmitter<any>();

  @Output() editorCreate = new EventEmitter<any>();
  @Output() contentChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any>();

  constructor() {}
}
