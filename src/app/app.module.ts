import { BrowserModule } from '@angular/platform-browser';
import { NgModule , APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LazyLoadModule } from './lazy-load/lazy-load.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { ServiceModule } from './services/service.module';
import { NgxSpinnerModule } from 'ngx-spinner';


import { McConfirmModule } from './modules/mc-confirm/mc-confirm.module';

import { AppComponent } from './app.component';
import {CdkIconsModule, SvgIconsService} from './modules/cdk-icons/cdk-icons.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    LazyLoadModule,
    CoreModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ServiceModule,
    McConfirmModule,
    CdkIconsModule,

    BrowserAnimationsModule,
    NgxSpinnerModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (si: SvgIconsService) =>
        function () {
          return si.init();
        },
      deps: [SvgIconsService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
