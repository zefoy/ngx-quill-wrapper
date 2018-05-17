import { InjectionToken } from '@angular/core';

export const QUILL_CONFIG = new InjectionToken<QuillConfigInterface>('QUILL_CONFIG');

export interface QuillConfigInterface {
  theme?: string,

  debug?: string,
  strict?: boolean,

  formats?: string[],
  modules?: any,

  readOnly?: boolean,
  placeholder?: string,

  bounds?: string | HTMLElement,
  scrollingContainer?: string | HTMLElement
}

export interface QuillModulesInterface {
  [path: string]: any
}

export class QuillConfig implements QuillConfigInterface {
  theme?: string;

  debug?: string;
  strict?: boolean;

  formats?: string[];
  modules?: any;

  readOnly?: boolean;
  placeholder?: string;

  bounds?: string | HTMLElement;
  scrollingContainer?: string | HTMLElement;

  constructor(config: QuillConfigInterface = {}) {
    this.assign(config);
  }

  assign(config: QuillConfigInterface | any = {}, target?: any) {
    target = target || this;

    for (const key in config) {
      if (config[key] != null && !Array.isArray(config[key]) && typeof config[key] === 'object' &&
         (typeof HTMLElement === 'undefined' || !(config[key] instanceof HTMLElement)))
      {
        target[key] = {};

        this.assign(config[key], target[key]);
      } else {
        target[key] = config[key];
      }
    }
  }
}
