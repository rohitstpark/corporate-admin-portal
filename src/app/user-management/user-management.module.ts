import { NgModule} from "@angular/core";
import { CommonModule } from '@angular/common';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { CommonModuleModule } from '../common/common-module.module';
import { MaterialModule } from '../common/material/material.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../common/services/auth-interceptor';

import { UserListComponent } from './user-list/user-list.component';
import { UserViewComponent } from './user-tabs/user-view/user-view.component';
// import { DriverDocumentComponent } from './driver-tabs/driver-document/driver-document.component';
// import { DriverShipmentComponent } from './driver-tabs/driver-shipment/driver-shipment.component';
import { UserTabComponent } from './user-tabs/user-tab/user-tab.component';
import { UserCreateComponent } from './user-create/user-create.component';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
      MaterialModule,
      UserManagementRoutingModule,
      CommonModuleModule,
      NgxDaterangepickerMd
    ],

    declarations: [
      UserListComponent,
      UserViewComponent,
      // DriverDocumentComponent,
      // DriverShipmentComponent,
      UserTabComponent,
      UserCreateComponent
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
export class UserManagementModule {
}
