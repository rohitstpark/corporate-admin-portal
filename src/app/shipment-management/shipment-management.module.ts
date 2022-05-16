import { NgModule} from "@angular/core";
import { CommonModule } from '@angular/common';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShipmentManagementRoutingModule } from './shipment-management-routing.module';
import { CommonModuleModule } from '../common/common-module.module';
import { MaterialModule } from '../common/material/material.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../common/services/auth-interceptor';

import { ShipmentListComponent } from './shipment-list/shipment-list.component';
import { ShipmentBidHistoryComponent } from './shipment-bid-history/shipment-bid-history.component';
import { ShipmentLoadHistoryComponent } from './shipment-load-history/shipment-load-history.component';
import { ShipmentTabsComponent } from './shipment-tabs/shipment-tabs.component';
import { ShipmentViewComponent } from './shipment-view/shipment-view.component';
import { ShipmentDocumentComponent } from './shipment-document/shipment-document.component';
import { ShipmentDriverComponent } from './shipment-driver/shipment-driver.component';
import { MapBoxShipmentComponent } from './map-box-shipment/map-box-shipment.component';
import { ShipmentPaymentsComponent } from './shipment-payments/shipment-payments.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    ShipmentManagementRoutingModule,
    CommonModuleModule,
    NgxDaterangepickerMd,
    NgxSkeletonLoaderModule
  ],

  declarations: [
    ShipmentListComponent,
    ShipmentBidHistoryComponent,
    ShipmentLoadHistoryComponent,
    ShipmentTabsComponent,
    ShipmentViewComponent,
    ShipmentDocumentComponent,
    ShipmentDriverComponent,
    MapBoxShipmentComponent,
    ShipmentPaymentsComponent
  ],
  providers:[
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  exports: [],
})
export class ShipmentManagementModule { }
