import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';

import {
  MatPaginatorModule,
  MatSortModule,
  MatCheckboxModule,
  MatRadioModule,
  MatPaginatorIntl,
  MatTooltipModule,
  MatButtonToggleModule,
  MatMenuModule,
  MatBottomSheetModule,
  MatDialogModule,
  MatSelectModule
} from '@angular/material';

import {MatCardModule} from '@angular/material/card';

import {FlexLayoutModule} from '@angular/flex-layout';

import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

import {appRoutes} from './lazyloader.routes';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

export function getChinesePaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  /*Material 分页标签提示功能*/
  paginatorIntl.itemsPerPageLabel = '每页:';
  paginatorIntl.nextPageLabel = '下一页';
  paginatorIntl.previousPageLabel = '上一页';
  paginatorIntl.firstPageLabel = '第一页';
  paginatorIntl.lastPageLabel = '最后一页';

  return paginatorIntl;
}

import {PipesModule} from '../modules/pipes/pipes.module';
import {CoreModule} from '../core/core.module';
import {OverviewComponent} from './overview/overview.component';
import {UsersComponent} from './system/users/users.component';
import {UserAddComponent} from './system/users/user-add/user-add.component';
import {HostManagentComponent} from './config/host-managent/host-managent.component';
import {ContainerManagentComponent} from './config/container-managent/container-managent.component';
import {NewsManagentComponent} from './config/news-managent/news-managent.component';
import {PassagewayManagentComponent} from './config/passageway-managent/passageway-managent.component';
import {StrategyManagentComponent} from './config/strategy-managent/strategy-managent.component';
import {HostManagentAddComponent} from './config/host-managent/host-managent-add/host-managent-add.component';
import {PassagewayManagentAddComponent} from './config/passageway-managent/passageway-managent-add/passageway-managent-add.component';
import {NewsManagentEditComponent} from './config/news-managent/news-managent-edit/news-managent-edit.component';
import {IdentityManagentComponent} from './config/identity-managent/identity-managent.component';
import {IdentityManagentEditComponent} from './config/identity-managent/identity-managent-edit/identity-managent-edit.component';
import {StrategyManagentEditComponent} from './config/strategy-managent/strategy-managent-edit/strategy-managent-edit.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {HostContainerComponent} from './config/host-managent/host-container/host-container.component';

import {CaEditComponent} from './config/container-managent/ca-edit/ca-edit.component';
import {PeerEditComponent} from './config/container-managent/peer-edit/peer-edit.component';
import {CouchdbEditComponent} from './config/container-managent/couchdb-edit/couchdb-edit.component';
import { StartContainerComponent } from './config/container-managent/start-container/start-container.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(appRoutes),
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatListModule,
    MatInputModule,
    MatChipsModule,
    MatTableModule,
    MatExpansionModule,
    MatCardModule,
    MatMenuModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatSelectModule,
    FlexLayoutModule,
    CoreModule,
    MatSidenavModule,
    PerfectScrollbarModule,
    PipesModule.forRoot()
  ],
  declarations: [
    AuthComponent,
    OverviewComponent,
    UsersComponent,
    UserAddComponent,
    HostManagentComponent,
    ContainerManagentComponent,
    NewsManagentComponent,
    PassagewayManagentComponent,
    StrategyManagentComponent,
    HostManagentAddComponent,
    PassagewayManagentAddComponent,
    NewsManagentEditComponent,
    IdentityManagentComponent,
    IdentityManagentEditComponent,
    StrategyManagentEditComponent,
    ChangePasswordComponent,
    HostContainerComponent,
    CaEditComponent,
    PeerEditComponent,
    StartContainerComponent,
    CouchdbEditComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: MatPaginatorIntl,
      useValue: getChinesePaginatorIntl()
    }
  ],
  entryComponents: [
    UserAddComponent,
    HostManagentAddComponent,
    PassagewayManagentAddComponent,
    NewsManagentEditComponent,
    IdentityManagentEditComponent,
    StrategyManagentEditComponent,
    ChangePasswordComponent,
    UsersComponent,
    HostContainerComponent,
    CaEditComponent,
    PeerEditComponent,
    CouchdbEditComponent,
    StartContainerComponent
  ]
})
export class AuthModule {
}
