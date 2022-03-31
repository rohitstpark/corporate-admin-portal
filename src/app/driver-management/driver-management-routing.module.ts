import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../common/guard/auth.guard';

import { DriverListComponent } from './driver-list/driver-list.component';
import { DriverViewComponent } from './driver-tabs/driver-view/driver-view.component';
import { DriverDocumentComponent } from './driver-tabs/driver-document/driver-document.component';
import { DriverShipmentComponent } from './driver-tabs/driver-shipment/driver-shipment.component';


const routes: Routes = [
  { path: '', component: DriverListComponent, canActivate : [AuthGuard] },
  { path: 'view/:driverId/details', component: DriverViewComponent, canActivate : [AuthGuard] },
  { path: 'view/:driverId/documents', component: DriverDocumentComponent, canActivate : [AuthGuard] },
  { path: 'view/:driverId/shipments', component: DriverShipmentComponent, canActivate : [AuthGuard] },


]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DriverManagementRoutingModule {}
