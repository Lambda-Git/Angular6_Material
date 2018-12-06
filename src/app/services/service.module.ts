import {NgModule} from '@angular/core';
import {RestfulService} from './restful.service';
import {CookieModule} from 'ngx-cookie';

@NgModule({
  imports: [CookieModule.forRoot()],
  declarations: [],
  providers: [
    RestfulService
  ]
})
export class ServiceModule {
}

