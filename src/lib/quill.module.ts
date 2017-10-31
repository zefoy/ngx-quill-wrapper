import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { QuillComponent } from './quill.component';
import { QuillDirective } from './quill.directive';

import { QuillConfig, QuillConfigInterface} from './quill.interfaces';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ QuillComponent, QuillDirective ],
  exports: [ CommonModule, QuillComponent, QuillDirective ]
})
export class QuillModule {
}
