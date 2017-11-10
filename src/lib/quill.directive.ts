import * as Quill from 'quill';

import { Directive, Optional, Inject,
  OnInit, DoCheck, OnDestroy, OnChanges,
  Input, Output, EventEmitter, NgZone, ElementRef, Renderer2,
  KeyValueDiffer, KeyValueDiffers, SimpleChanges } from '@angular/core';

import { QuillService } from './quill.service';

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

  private configDiff: KeyValueDiffer<string, any>;

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

  constructor(private zone: NgZone, private elementRef: ElementRef,
    private renderer: Renderer2, private differs: KeyValueDiffers, private service: QuillService,
    @Optional() @Inject(QUILL_CONFIG) private defaults: QuillConfigInterface) {}

  ngOnInit() {
    const params = new QuillConfig(this.defaults);

    params.assign(this.config); // Custom configuration

    if (this.disabled) {
      params.readOnly = true;

      params.modules = { toolbar: false }; // Disable toolbar
    } else {
      params.theme = params.theme || 'snow';

      params.modules = params.modules || { toolbar: true };

      params.modules.toolbar = params.modules.toolbar || false;

      if (params.modules.toolbar) {
        if (params.modules.toolbar !== Object(params.modules.toolbar)) {
          params.modules.toolbar = {
            container: (params.modules.toolbar === true) ?
              this.defaultToolbarConfig : params.modules.toolbar
          };
        }

        if (this.autoToolbar && !this.showToolbar) {
          params.modules.toolbar = false;
        } else {
          const toolbar = params.modules.toolbar.container;

          params.modules.toolbar.container = this.service.getToolbar(toolbar);
        }
      }
    }

    this.zone.runOutsideAngular(() => {
      this.instance = new Quill(this.elementRef.nativeElement, params);

      if (!params.readOnly) {
        this.instance.enable();
      } else {
        this.instance.disable();
      }
    });

    this.editorCreate.emit(this.instance);

    // Reset selection after onDestroy if available

    if (this.hasFocus === true && this.selection != null) {
      this.instance.setSelection(this.selection, 'silent');

      this.instance.focus();
    }

    // Add handling of text / content change events

    this.instance.on('text-change', (delta: any, oldDelta: any, source: string) => {
      const html = this.elementRef.nativeElement.children[0].innerHTML;

      this.contentChange.emit({
        editor: this.instance,
        html: (html === '<p><br></p>') ? null : html,
        text: this.instance.getText(),
        delta: delta,
        oldDelta: oldDelta,
        source: source
      });
    });

    // Add handling of blur / focus and selection events

    this.instance.on('selection-change', (range: any, oldRange: any, source: string) => {
      let resetToolbar = false;

      if (!range && this.hasFocus) {
        this.hasFocus = false;

        this.blur.emit(this.instance);

        if (this.autoToolbar && this.showToolbar) {
          this.showToolbar = false;
        }
      } else if (range && !this.hasFocus) {
        this.hasFocus = true;

        this.focus.emit(this.instance);

        // Check if reset is needed to update toolbar

        if (this.autoToolbar && !this.showToolbar) {
          resetToolbar = true;

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

      if (resetToolbar) {
        setTimeout(() => {
          this.ngOnDestroy();

          this.ngOnInit();
        }, 0);
      }
    });

    if (!this.configDiff) {
      this.configDiff = this.differs.find(this.config || {}).create();

      this.configDiff.diff(this.config || {});
    }
  }

  ngDoCheck() {
    if (this.configDiff) {
      const changes = this.configDiff.diff(this.config || {});

      if (changes) {
        this.ngOnDestroy();

        this.ngOnInit();
      }
    }
  }

  ngOnDestroy() {
    if (this.instance) {
      const toolbar = this.instance.getModule('toolbar');

      this.selection = this.instance.getSelection();

      if (toolbar && toolbar.options && toolbar.container &&
        !(toolbar.options.container instanceof HTMLElement))
      {
        toolbar.container.remove();
      }

      delete this.instance;

      this.instance = null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance && changes['disabled']) {
      if (changes['disabled'].currentValue !== changes['disabled'].previousValue) {
        this.zone.runOutsideAngular(() => {
          this.ngOnDestroy();

          this.ngOnInit();
        });
      }
    }
  }

  public quill() {
    return this.instance;
  }

  public clear(source?: string) {
    this.instance.deleteText(0, this.instance.getLength(), source);
  }
}
