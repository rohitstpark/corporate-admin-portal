import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarrierListComponent } from './carrier-list/carrier-list.component';
import { CarrierDetailComponent } from './carrier-detail/carrier-detail.component';
import { CarrierDriversComponent } from './carrier-drivers/carrier-drivers.component';
import { CarrierShipmentComponent } from './carrier-shipment/carrier-shipment.component';
import { CarrierConnectionsComponent } from './carrier-connections/carrier-connections.component';
import { AddDotNumberComponent } from './add-dot-number/add-dot-number.component';
import { AuthGuard } from './../common/guard/auth.guard';
import { CarrierEditComponent } from './carrier-edit/carrier-edit.component';



const routes: Routes = [
  { path: '', component: CarrierListComponent, canActivate : [AuthGuard] },
  { path: 'view/:carrierId/details', component: CarrierDetailComponent, canActivate : [AuthGuard] },
  { path: 'edit/:carrierId', component: CarrierEditComponent, canActivate : [AuthGuard] },
  { path: 'view/:carrierId/drivers', component: CarrierDriversComponent, canActivate : [AuthGuard] },
  { path: 'view/:carrierId/shipments', component: CarrierShipmentComponent, canActivate : [AuthGuard] },
  { path: 'view/:carrierId/connections', component: CarrierConnectionsComponent, canActivate : [AuthGuard] },
  { path: 'add-dot-number', component: AddDotNumberComponent, canActivate : [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes),
    
  ],
  exports: [RouterModule]
})

export class CarrierManagementRoutingModule {}
