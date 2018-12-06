import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeysPipe } from './pipes/keys.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { StatusPipe } from './pipes/status.pipe';
import { ValuesPipe } from './pipes/values.pipe';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    KeysPipe,
    SortPipe,
    StatusPipe,
    ValuesPipe
  ],
  exports: [
    KeysPipe,
    SortPipe,
    StatusPipe,
    ValuesPipe
  ],

})

export class PipesModule {
  static forRoot() {
    return {
        ngModule: PipesModule,
        providers: [],
    };
 }
}

export {KeysPipe} from './pipes/keys.pipe';
export {SortPipe} from './pipes/sort.pipe';
export {ValuesPipe} from './pipes/values.pipe';
export {StatusPipe} from './pipes/status.pipe';


