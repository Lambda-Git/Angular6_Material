import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './auth.guard';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', loadChildren: '../login/login.module#LoginModule'},
  {path: 'auth', loadChildren: '../auth/auth.module#AuthModule'}, /*登录拦截：  , canActivate: [AuthGuard]*/
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class LazyLoadModule {
}
