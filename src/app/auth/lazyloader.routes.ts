import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { OverviewComponent } from './overview/overview.component';
import { UsersComponent } from './system/users/users.component';
import { AboutusComponent } from './system/aboutus/aboutus.component';
import { ABCIComponent } from './config/abci/abci.component';
import { MdbservComponent } from './config/mdbserv/mdbserv.component';
import { MdbuserComponent } from './config/mdbuser/mdbuser.component';
import {DistributednodeComponent} from './config/distributednode/distributednode.component';
import { BlockComponent } from './search/block/block.component';
import { AssetsComponent } from './search/assets/assets.component';
import {AssetsDealComponent} from './search/assets-deal/assets-deal.component';
import {BlockDealComponent} from './search/block-deal/block-deal.component';
import { BlockDealDetailComponent } from './search/block-deal-detail/block-deal-detail.component'

export const appRoutes: Routes = [{
    path: '', component: AuthComponent, children: [
        { path: 'overview', component: OverviewComponent },
        { path: 'system/users', component: UsersComponent },
        { path: 'system/aboutus', component: AboutusComponent},
        { path: 'config/abci', component: ABCIComponent },
        { path: 'config/mdbserv', component: MdbservComponent},
        { path: 'config/mdbuser', component: MdbuserComponent},
        { path: 'config/distributednode', component: DistributednodeComponent},
        { path: 'search/block', component: BlockComponent },
        { path: 'search/assets', component: AssetsComponent },
        { path: 'search/assets-deal/:id', component: AssetsDealComponent},
        { path: 'search/block-deal/:id', component: BlockDealComponent},
        { path: 'search/block-deal/block-deal-detail', component: BlockDealDetailComponent},

        /* { path: 'material-widgets', loadChildren: '../material-widgets/material-widgets.module#MaterialWidgetsModule' },
        { path: 'tables', loadChildren: '../tables/tables.module#TablesModule' },
        { path: 'maps', loadChildren: '../maps/maps.module#MapsModule' },
        { path: 'charts', loadChildren: '../charts/charts.module#ChartsModule' },
        // { path: 'chats', loadChildren: '../chats/chat.module#ChatsModule' }, // fix this
        //{ path: 'mail', loadChildren: '../mail/mail.module#MailModule' }, // fix this
        { path: 'pages', loadChildren: '../pages/pages.module#PagesModule' },
        { path: 'forms', loadChildren: '../forms/forms.module#FormModule' }, //fix this
        { path: 'guarded-routes', loadChildren: '../guarded-routes/guarded-routes.module#GuardedRoutesModule' },
        // { path: 'editor', loadChildren: '../editor/editor.module#EditorModule' },
        { path: 'scrumboard', loadChildren: '../scrumboard/scrumboard.module#ScrumboardModule' }, */
    ]
}];
