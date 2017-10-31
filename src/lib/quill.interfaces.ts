import { InjectionToken } from '@angular/core';

export const QUILL_CONFIG = new InjectionToken<QuillConfigInterface>('QUILL_CONFIG');

export interface QuillConfigInterface {
  theme?: string,

  debug?: boolean,
  strict?: boolean,

  formats?: string[],
  modules?: any,

  readOnly?: boolean,
  placeholder?: string,

  bounds?: string | HTMLElement,
  scrollingContainer?: string | HTMLElement
}

export class QuillConfig implements QuillConfigInterface {
  theme: string;

  debug: boolean;
  strict: boolean;

  formats: string[];
  modules: any;

  readOnly: boolean;
  placeholder: string;

  bounds: string | HTMLElement;
  scrollingContainer: string | HTMLElement;

  constructor(config: QuillConfigInterface = {}) {
    this.assign(config);
  }

  assign(config: QuillConfigInterface = {}) {
    const copy = (JSON.parse(JSON.stringify(config || {})));

    Object.assign(this, copy);
  }
}
