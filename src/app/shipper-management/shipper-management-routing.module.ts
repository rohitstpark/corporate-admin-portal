import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShipperListComponent } from './shipper-list/shipper-list.component';
import { ShipperDetailComponent } from './shipper-detail/shipper-detail.component';

// import { ShipperDriversComponent } from './shipper-drivers/shipper-drivers.component';
import { ShipperShipmentComponent } from './shipper-shipment/shipper-shipment.component';
import { ShipperConnectionsComponent } from './shipper-connections/shipper-connections.component';
import { AuthGuard } from './../common/guard/auth.guard';


const routes: Routes = [
  { path: '', component: ShipperListComponent, canActivate : [AuthGuard] },
  { path: 'view/:shipperId/details', component: ShipperDetailComponent, canActivate : [AuthGuard] },
  // { path: 'view/:shipperId/drivers', component: ShipperDriversComponent, canActivate : [AuthGuard] },
  { path: 'view/:shipperId/shipments', component: ShipperShipmentComponent, canActivate : [AuthGuard] },
  { path: 'view/:shipperId/connections', component: ShipperConnectionsComponent, canActivate : [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ShipperManagementRoutingModule {}
