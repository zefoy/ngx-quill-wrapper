import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuillService } from './quill.service';
import { QuillComponent } from './quill.component';
import { QuillDirective } from './quill.directive';

@NgModule({
  declarations: [ QuillComponent, QuillDirective ],
  imports: [ CommonModule ],
  exports: [ CommonModule, QuillComponent, QuillDirective ],
  providers: [ QuillService ]
})
export class QuillModule {
}
