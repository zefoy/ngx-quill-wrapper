import Quill from 'quill';

import { Quill as QuillInstance } from 'quill';
import { Sources as QuillSources } from 'quill';
import { RangeStatic as QuillRangeStatic } from 'quill';

import { Directive, Optional, Inject,
  OnInit, DoCheck, OnDestroy, OnChanges,
  Input, Output, EventEmitter, NgZone, ElementRef,
  KeyValueDiffer, KeyValueDiffers, SimpleChanges } from '@angular/core';

import { QuillService } from './quill.service';

import { QUILL_CONFIG, QuillConfig, QuillConfigInterface,
  QuillModulesInterface } from './quill.interfaces';

@Directive({
  selector: '[quill]',
  exportAs: 'ngxQuill'
})
export class QuillDirective implements OnInit, DoCheck, OnDestroy, OnChanges {
  private instance: QuillInstance | null = null;

  private selection: QuillRangeStatic | null = null;

  private hasFocus: boolean = false;
  private showToolbar: boolean = false;

  private configDiff: KeyValueDiffer<string, any> | null = null;

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
  @Input() realToolbar: boolean = false;

  @Input('quill') config?: QuillConfigInterface;

  @Input('modules') modules?: QuillModulesInterface;

  @Output() blur = new EventEmitter<any>();
  @Output() focus = new EventEmitter<any>();

  @Output() editorCreate = new EventEmitter<any>();
  @Output() contentChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any>();

  constructor(private zone: NgZone, private elementRef: ElementRef,
    private differs: KeyValueDiffers, private service: QuillService,
    @Optional() @Inject(QUILL_CONFIG) private defaults: QuillConfigInterface) {}

  ngOnInit(): void {
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
        if (typeof params.modules.toolbar !== 'object' ||
           params.modules.toolbar.container === undefined)
        {
          params.modules.toolbar = {
            container: (params.modules.toolbar === true) ?
              this.defaultToolbarConfig : params.modules.toolbar
          };
        }

        if (this.autoToolbar && !this.showToolbar) {
          params.modules.toolbar = false;
        } else if (this.autoToolbar || !this.realToolbar) {
          const toolbar = params.modules.toolbar.container;

          params.modules.toolbar.container = this.service.getToolbar(toolbar);
        }
      }
    }

    this.zone.runOutsideAngular(() => {
      if (this.modules) {
        Object.keys(this.modules).forEach((path: string) => {
          if (this.modules && this.modules[path]) {
            Quill.register(path, this.modules[path]);
          }
        });
      }

      this.instance = new Quill(this.elementRef.nativeElement, params);

      if (!params.readOnly) {
        this.instance.enable();
      } else {
        this.instance.disable();
      }

      if (this.editorCreate.observers.length) {
        this.editorCreate.emit(this.instance);
      }
    });

    // Reset selection after onDestroy if available

    if (this.instance && this.selection && this.hasFocus === true) {
      this.instance.setSelection(this.selection, 'silent');

      this.instance.focus();
    }

    if (this.instance) {
      // Add handling of text / content change events

      this.instance.on('text-change', (delta: any, oldDelta: any, source: string) => {
        const html = this.elementRef.nativeElement.children[0].innerHTML;

        this.zone.runOutsideAngular(() => {
          if (this.instance && this.contentChange.observers.length) {
            this.contentChange.emit({
              editor: this.instance,
              html: (html === '<p><br></p>') ? null : html,
              text: this.instance.getText(),
              delta: delta,
              oldDelta: oldDelta,
              source: source
            });
          }
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
          this.zone.runOutsideAngular(() => {
            if (this.instance && this.selectionChange.observers.length) {
              this.selectionChange.emit({
                editor: this.instance,
                range: range,
                oldRange: oldRange,
                source: source
              });
            }
          });
        }

        if (resetToolbar) {
          setTimeout(() => {
            this.ngOnDestroy();

            this.ngOnInit();
          }, 0);
        }
      });
    }

    if (!this.configDiff) {
      this.configDiff = this.differs.find(this.config || {}).create();

      this.configDiff.diff(this.config || {});
    }
  }

  ngOnDestroy(): void {
    if (this.instance) {
      const toolbar = this.instance.getModule('toolbar');

      this.selection = this.instance.getSelection();

      if (typeof HTMLElement !== 'undefined' &&
          toolbar && toolbar.options && toolbar.container &&
        !(toolbar.options.container instanceof HTMLElement))
      {
        toolbar.container.remove();
      }

      if (this.elementRef && this.elementRef.nativeElement) {
        const preview = this.elementRef.nativeElement.querySelector('.ql-preview');

        if (preview) {
          preview.innerHTML = '';
        }
      }

      delete this.instance;

      this.instance = null;
    }
  }

  ngDoCheck(): void {
    if (this.configDiff) {
      const changes = this.configDiff.diff(this.config || {});

      if (changes) {
        this.ngOnDestroy();

        this.ngOnInit();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.instance && changes['disabled']) {
      if (changes['disabled'].currentValue !== changes['disabled'].previousValue) {
        this.zone.runOutsideAngular(() => {
          this.ngOnDestroy();

          this.ngOnInit();
        });
      }
    }
  }

  public quill(): QuillInstance | null {
    return this.instance;
  }

  public clear(source?: QuillSources): void {
    if (this.instance) {
      this.instance.deleteText(0, this.instance.getLength(), source);
    }
  }

  public getValue(): string | undefined {
    if (this.instance) {
      return this.instance.getText();
    }
  }

  public setValue(value: string, source?: QuillSources): void {
    if (this.instance) {
      this.clear(source);

      this.instance.clipboard.dangerouslyPasteHTML(value, source);

      this.instance.setSelection(this.instance.getLength(), 1);
    }
  }
}
