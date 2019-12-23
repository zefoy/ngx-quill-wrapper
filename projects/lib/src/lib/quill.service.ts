import { Injectable } from '@angular/core';

@Injectable()
export class QuillService {
  private toolbar: HTMLElement | null = null;

  constructor() {}

  public getToolbar(toolbarConfig: any): any {
    let toolbar = toolbarConfig;

    if (typeof toolbarConfig === 'string') {
      toolbar = document.querySelector(toolbarConfig);
    }

    if (typeof HTMLElement !== 'undefined' && toolbar instanceof HTMLElement) {
      if (!this.toolbar) {
        this.toolbar = toolbar;
      }

      const clone = this.toolbar.cloneNode(true);

      if (toolbar.parentNode) {
        toolbar.parentNode.replaceChild(clone, toolbar);
      }

      return clone;
    }

    return toolbarConfig;
  }
}
