import { NgModule} from "@angular/core";
import { CommonModule } from '@angular/common';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DriverManagementRoutingModule } from './driver-management-routing.module';
import { CommonModuleModule } from '../common/common-module.module';
import { MaterialModule } from '../common/material/material.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../common/services/auth-interceptor';

import { DriverListComponent } from './driver-list/driver-list.component';
import { DriverViewComponent } from './driver-tabs/driver-view/driver-view.component';
import { DriverDocumentComponent } from './driver-tabs/driver-document/driver-document.component';
import { DriverShipmentComponent } from './driver-tabs/driver-shipment/driver-shipment.component';
import { DriverTabComponent } from './driver-tabs/driver-tab/driver-tab.component';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
      MaterialModule,
      DriverManagementRoutingModule,
      CommonModuleModule,
      NgxDaterangepickerMd
    ],

    declarations: [
      DriverListComponent,
      DriverViewComponent,
      DriverDocumentComponent,
      DriverShipmentComponent,
      DriverTabComponent
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
export class DriverManagementModule {
}
