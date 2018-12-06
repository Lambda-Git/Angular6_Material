import {Routes} from '@angular/router';
import {AuthComponent} from './auth.component';
import {OverviewComponent} from './overview/overview.component';
import {UsersComponent} from './system/users/users.component';
import {HostManagentComponent} from './config/host-managent/host-managent.component';
import {ContainerManagentComponent} from './config/container-managent/container-managent.component';
import {PassagewayManagentComponent} from './config/passageway-managent/passageway-managent.component';
import {NewsManagentComponent} from './config/news-managent/news-managent.component';
import {StrategyManagentComponent} from './config/strategy-managent/strategy-managent.component';
import {IdentityManagentComponent} from './config/identity-managent/identity-managent.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {path: 'overview', component: OverviewComponent},
      {path: 'system/users', component: UsersComponent},
      {
        path: 'config/identity-managent',
        component: IdentityManagentComponent
      },
      {path: 'config/host-managent', component: HostManagentComponent},
      {
        path: 'config/container-managent',
        component: ContainerManagentComponent
      },
      {
        path: 'config/passageway-managent',
        component: PassagewayManagentComponent
      },
      {path: 'config/news-managent', component: NewsManagentComponent},
      {
        path: 'config/strategy-managent',
        component: StrategyManagentComponent
      },
    ]
  }
];
