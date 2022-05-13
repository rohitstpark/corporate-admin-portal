import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../common/guard/auth.guard';
import { ShipmentListComponent } from './shipment-list/shipment-list.component';
import { ShipmentBidHistoryComponent } from './shipment-bid-history/shipment-bid-history.component';
import { ShipmentLoadHistoryComponent } from './shipment-load-history/shipment-load-history.component';
import { ShipmentViewComponent } from './shipment-view/shipment-view.component';
import { ShipmentDriverComponent } from './shipment-driver/shipment-driver.component';
import { ShipmentDocumentComponent } from './shipment-document/shipment-document.component';
import { ShipmentPaymentsComponent } from './shipment-payments/shipment-payments.component';


const routes: Routes = [
  { path: '', component: ShipmentListComponent, canActivate : [AuthGuard] },
  { path: 'view/:shipmentId/details', component: ShipmentViewComponent, canActivate : [AuthGuard] },
  { path: 'view/:shipmentId/bidhistory', component: ShipmentBidHistoryComponent, canActivate : [AuthGuard] },
  { path: 'view/:shipmentId/loadhistory', component: ShipmentLoadHistoryComponent, canActivate : [AuthGuard] },
  { path: 'view/:shipmentId/driver', component: ShipmentDriverComponent, canActivate : [AuthGuard] },
  { path: 'view/:shipmentId/documents', component: ShipmentDocumentComponent, canActivate : [AuthGuard] },
  { path: 'view/:shipmentId/payments', component: ShipmentPaymentsComponent, 
  children: [
    {
        path: 'shipperTransaction',
        component: ShipmentPaymentsComponent
    },
    {
        path : 'carrierTransaction',
        component : ShipmentPaymentsComponent
    },
], canActivate : [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ShipmentManagementRoutingModule {}
