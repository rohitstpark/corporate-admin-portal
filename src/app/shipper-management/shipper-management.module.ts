import { NgModule} from "@angular/core";
import { CommonModule } from '@angular/common';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShipperManagementRoutingModule } from './shipper-management-routing.module';
import { CommonModuleModule } from './../common/common-module.module';
import { MaterialModule } from './../common/material/material.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './../common/services/auth-interceptor';

import { ShipperListComponent } from './shipper-list/shipper-list.component';
import { ShipperDetailComponent } from './shipper-detail/shipper-detail.component';
import { ShipperShipmentComponent } from './shipper-shipment/shipper-shipment.component';
import { ShipperConnectionsComponent } from './shipper-connections/shipper-connections.component';
import { ShipperTabComponent } from './shipper-tab/shipper-tab.component';
// import * as moment from 'moment';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
      MaterialModule,
      ShipperManagementRoutingModule,
      CommonModuleModule,
      NgxDaterangepickerMd
    ],

    declarations: [
      ShipperListComponent,
      ShipperDetailComponent,
      ShipperShipmentComponent,
      ShipperConnectionsComponent,
      ShipperTabComponent,
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
export class ShipperManagementModule {
}
