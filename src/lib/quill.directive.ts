import * as Quill from 'quill';

import { NgZone, SimpleChanges, KeyValueDiffer, KeyValueDiffers,
  Directive, Optional, Inject, OnInit, DoCheck, OnDestroy, OnChanges,
  Input, HostBinding, Output, EventEmitter, ElementRef } from '@angular/core';

import { QUILL_CONFIG } from './quill.interfaces';

import { QuillConfig, QuillConfigInterface } from './quill.interfaces';

@Directive({
  selector: '[quill]',
  exportAs: 'ngxQuill'
})
export class QuillDirective implements OnInit, DoCheck, OnDestroy, OnChanges {
  private instance: any = null;

  private selection: any = null;

  private hasFocus: boolean = false;
  private showToolbar: boolean = false;

  private configDiff: KeyValueDiffer<any, any>;

  private defaultToolbarConfig: any = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],

    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']
  ];

  @Input() disabled: boolean = false;

  @Input() autoToolbar: boolean = false;

  @Input('quill') config: QuillConfigInterface;

  @Output() blur = new EventEmitter<any>();
  @Output() focus = new EventEmitter<any>();

  @Output() editorCreate = new EventEmitter<any>();
  @Output() contentChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any>();

  constructor(private zone: NgZone, private elementRef: ElementRef, private differs: KeyValueDiffers,
    @Optional() @Inject(QUILL_CONFIG) private defaults: QuillConfigInterface) {}

  ngOnInit() {
    const params = new QuillConfig(this.defaults);

    params.assign(this.config); // Custom configuration

    if (this.autoToolbar && !this.showToolbar) {
      params.modules.toolbar = false;
    } else if (params.modules && params.modules.toolbar === true) {
      params.modules.toolbar = this.defaultToolbarConfig;
    }

    this.zone.runOutsideAngular(() => {
      this.instance = new Quill(this.elementRef.nativeElement, params);
    });

    this.editorCreate.emit(this.instance);

    if (this.hasFocus === true) {
      this.instance.focus();

      this.instance.setSelection(this.selection);
    }

    this.instance.on('text-change', (delta: any, oldDelta: any, source: string) => {
      let html: (string | null) = this.elementRef.nativeElement.children[0].innerHTML;

      const text = this.instance.getText();

      if (html === '<p><br></p>') {
          html = null;
      }

      this.contentChange.emit({
        editor: this.instance,
        html: html,
        text: text,
        delta: delta,
        oldDelta: oldDelta,
        source: source
      });
    });

    this.instance.on('selection-change', (range: any, oldRange: any, source: string) => {
      const showToolbar = this.showToolbar;

      if (!range && this.hasFocus) {
        this.hasFocus = false;

        this.blur.emit(this.instance);

        if (this.autoToolbar === true && this.showToolbar === true) {
          this.showToolbar = false;
        }
      } else if (range && !this.hasFocus) {
        this.hasFocus = true;

        this.focus.emit(this.instance);

        if (this.autoToolbar === true && this.showToolbar === false) {
          this.showToolbar = true;
        }
      } else {
        this.selectionChange.emit({
          editor: this.instance,
          range: range,
          oldRange: oldRange,
          source: source
        });
      }

      if (showToolbar !== this.showToolbar) {
        this.ngOnDestroy();

        // Timeout is needed for the styles to update properly
        setTimeout(() => {
          this.ngOnInit();
        }, 0);
      }
    });

    if (!this.configDiff) {
      this.configDiff = this.differs.find(this.config || {}).create();
    }
  }

  ngDoCheck() {
    if (this.configDiff) {
      const changes = this.configDiff.diff(this.config || {});

      if (changes) {
        this.ngOnDestroy();

        // Timeout is needed for the styles to update properly
        setTimeout(() => {
          this.ngOnInit();
        }, 0);
      }
    }
  }

  ngOnDestroy() {
    if (this.instance) {
      this.selection = this.instance.getSelection();

      const toolbar = this.instance.getModule('toolbar');

      if (toolbar && toolbar.container &&
          Array.isArray(toolbar.options.container))
      {
        toolbar.container.remove();
      }

      delete this.instance;

      this.instance = null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    /*if (this.instance && changes['disabled']) {
      if (changes['disabled'].currentValue !== changes['disabled'].previousValue) {
        if (changes['disabled'].currentValue === true) {
          this.zone.runOutsideAngular(() => {
            this.instance.disable();
          });
        } else if (changes['disabled'].currentValue === false) {
          this.zone.runOutsideAngular(() => {
            this.instance.enable();
          });
        }
      }
    }*/
  }

  public quill() {
    return this.instance;
  }

  public clear(source?: string) {
    this.instance.deleteText(0, this.instance.getLength(), source);
  }
}
