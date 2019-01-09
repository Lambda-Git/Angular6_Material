import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule } from '@angular/router';

import { AuthModule } from '../auth/auth.module';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'}, /* http://localhost:4201 */
    {path: 'login', loadChildren: '../login/login.module#LoginModule'},
    {path: 'auth', loadChildren: '../auth/auth.module#AuthModule'},
]



/*
 const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', loadChildren: '../login/login.module#LoginModule'},
  {path: 'auth', loadChildren: '../auth/auth.module#AuthModule', canActivate: [AuthGuard]},
]
*/

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class LazyLoadModule { }
