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

  assign(config: QuillConfigInterface | any = {}, target?: any) {
    target = target || this;

    for (const key in config) {
      if (config[key] && !Array.isArray(config[key]) && typeof config[key] === 'object') {
        target[key] = {};

        this.assign(config[key], target[key]);
      } else {
        target[key] = config[key];
      }
    }
  }
}
