import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './common/guard/auth.guard';
import { myProfileComponent } from './user/my-profile/my-profile.component';
import { changePasswordComponent } from './user/change-password/change-password.component';
import { ShipmentViewComponent } from './shipment-management/shipment-view/shipment-view.component';
import { ShipmentLoadHistoryComponent } from './shipment-management/shipment-load-history/shipment-load-history.component';
import { ShipmentBidHistoryComponent } from './shipment-management/shipment-bid-history/shipment-bid-history.component';

export const appRoutes: Routes = [
  { path: 'forgot', component: ForgotPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate : [AuthGuard] },
  {
    path: 'carrier',  canActivate : [AuthGuard],
    loadChildren: () => import('./carrier-management/carrier-management.module').then(mod => mod.CarrierManagementModule)
  },
  {
    path: 'shipper',  canActivate : [AuthGuard],
    loadChildren: () => import('./shipper-management/shipper-management.module').then(mod => mod.ShipperManagementModule)
  },
  {
    path: 'dispute',  canActivate : [AuthGuard],
    loadChildren: () => import('./dispute/dispute.module').then(mod => mod.DisputeModule)
  },
  {
    path: 'driver',  canActivate : [AuthGuard],
    loadChildren: () => import('./driver-management/driver-management.module').then(mod => mod.DriverManagementModule)
  },
  {
    path: 'user',  canActivate : [AuthGuard],
    loadChildren: () => import('./user-management/user-management.module').then(mod => mod.UserManagementModule)
  },
  {
    path: 'shipment',  canActivate : [AuthGuard],
    loadChildren: () => import('./shipment-management/shipment-management.module').then(mod => mod.ShipmentManagementModule)
  },
  {
    path: 'lookup',  canActivate : [AuthGuard],
    loadChildren: () => import('./phone-look/lookup.module').then(mod => mod.LookupModule)
  },

  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'my-profile', component: myProfileComponent, canActivate : [AuthGuard] },
  { path: 'change-password', component: changePasswordComponent, canActivate : [AuthGuard] },
  
  { path: 'shipment-view', component: ShipmentViewComponent, canActivate : [AuthGuard] },
  { path: 'shipment-load-history', component: ShipmentLoadHistoryComponent, canActivate : [AuthGuard] },
  { path: 'shipment-bid-history', component: ShipmentBidHistoryComponent, canActivate : [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)]
})
export class AppRoutingModule { }
