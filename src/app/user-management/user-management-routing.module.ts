import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../common/guard/auth.guard';

import { UserListComponent } from './user-list/user-list.component';
import { UserViewComponent } from './user-tabs/user-view/user-view.component';
import { UserCreateComponent } from './user-create/user-create.component';

const routes: Routes = [
  { path: '', component: UserListComponent, canActivate : [AuthGuard] },
  { path: 'view/:userId/details', component: UserViewComponent, canActivate : [AuthGuard] },
  { path: 'create', component: UserCreateComponent, canActivate : [AuthGuard] },
  // { path: 'view/:driverId/documents', component: DriverDocumentComponent, canActivate : [AuthGuard] },
  // { path: 'view/:driverId/shipments', component: DriverShipmentComponent, canActivate : [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UserManagementRoutingModule {}
