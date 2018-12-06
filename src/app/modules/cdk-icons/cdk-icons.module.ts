import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconsService } from './svg-icons.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [

  ],
  providers: [
    SvgIconsService
  ],
  exports: [
  ]
})
export class CdkIconsModule { }

export { SvgIconsService } from './svg-icons.service';
