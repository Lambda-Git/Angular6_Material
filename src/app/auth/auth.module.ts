import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthComponent } from "./auth.component";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatListModule } from "@angular/material/list";
import { MatInputModule } from "@angular/material/input";
import { MatChipsModule } from "@angular/material/chips";
import { MatTableModule } from "@angular/material/table";
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import { NgxEchartsModule } from 'ngx-echarts';
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
  MatNativeDateModule,
  MatDatepickerModule,
  MatExpansionModule
} from "@angular/material";

import { MatCardModule } from "@angular/material/card";

import { FlexLayoutModule } from "@angular/flex-layout";

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

import { appRoutes } from "./lazyloader.routes";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

export function getChinesePaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  /*自定义--分页标签提示信息*/
  paginatorIntl.itemsPerPageLabel = '每页:';
  paginatorIntl.nextPageLabel = '下一页';
  paginatorIntl.previousPageLabel = '上一页';
  paginatorIntl.firstPageLabel = '第一页';
  paginatorIntl.lastPageLabel = '最后一页';

  return paginatorIntl;
}


import { PipesModule } from "../modules/pipes/pipes.module";
import { CoreModule } from "../core/core.module";
import { OverviewComponent } from "./overview/overview.component";
import { UsersComponent } from "./system/users/users.component";
import { UserAddComponent } from "./system/users/user-add/user-add.component";
import { ABCIComponent } from "./config/abci/abci.component";
import { AbciAddComponent } from "./config/abci/abci-add.component";
import { MdbservComponent } from "./config/mdbserv/mdbserv.component";
import { MdbservEditComponent } from "./config/mdbserv/mdbserv-edit.component";
import { MdbuserComponent } from "./config/mdbuser/mdbuser.component";
import { MdbuserEditComponent } from "./config/mdbuser/mdbuser-edit.component";
import { DistributednodeComponent } from './config/distributednode/distributednode.component';
import { DistributednodeaddComponent } from './config/distributednode/distributednodeadd.component';
import { ChainnodeaddComponent } from './config/distributednode/chainnodeadd.component';
import { AboutusComponent } from './system/aboutus/aboutus.component';
import { BlockComponent } from './search/block/block.component';
import { AssetsComponent } from './search/assets/assets.component';
import { AssetsDealComponent } from './search/assets-deal/assets-deal.component';
import { BlockDealComponent } from './search/block-deal/block-deal.component';
import { BlockDealDetailComponent } from './search/block-deal-detail/block-deal-detail.component';
import { OverviewChart1Component } from './overview/overview-chart1/overview-chart1.component';

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
    NgxEchartsModule,
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
    MatGridListModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatSelectModule,
    MatCardModule,
    MatMenuModule,
    MatBottomSheetModule,
    MatDialogModule,
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
    ABCIComponent,
    AbciAddComponent,
    MdbservComponent,
    MdbservEditComponent,
    MdbuserComponent,
    MdbuserEditComponent,
    MdbuserComponent,
    MdbuserEditComponent,
    DistributednodeComponent,
    DistributednodeaddComponent,
    BlockComponent,
    AssetsComponent,
    AssetsDealComponent,
    BlockDealComponent,
    BlockDealDetailComponent,
    OverviewChart1Component,
    ChainnodeaddComponent,
    AboutusComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: MatPaginatorIntl,
      useValue: getChinesePaginatorIntl()
    },
    MatDatepickerModule,
    MatNativeDateModule
  ],
  entryComponents: [UserAddComponent, AbciAddComponent, MdbservEditComponent,
    MdbuserEditComponent,DistributednodeaddComponent,ChainnodeaddComponent]
})
export class AuthModule {}
