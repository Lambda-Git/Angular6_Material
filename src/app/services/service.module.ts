import { NgModule, ModuleWithProviders } from '@angular/core';
import { RestfulService } from './restful.service';
import { UserService } from './user.service';
import { ConfigService } from './config.service';
@NgModule({
    imports: [
    ],
    declarations: [
    ],
    providers: [
        UserService,
        RestfulService,
        ConfigService
    ],
})
export class ServiceModule {
}

export { RestfulService } from './restful.service';
export { ConfigService } from './config.service';