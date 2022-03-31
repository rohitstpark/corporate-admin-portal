import { NgModule} from "@angular/core";
import { CommonModule } from '@angular/common';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PopupComponent } from 'src/app/carrier-management/popup/popup.component'; 
import { CarrierManagementRoutingModule } from './carrier-management-routing.module';
import { CommonModuleModule } from './../common/common-module.module';
import { MaterialModule } from './../common/material/material.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSkeletonLoaderComponent } from "ngx-skeleton-loader";
import { AgmCoreModule } from '@agm/core';
import { AuthInterceptor } from './../common/services/auth-interceptor';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { CarrierListComponent } from './carrier-list/carrier-list.component';
import { CarrierDetailComponent } from './carrier-detail/carrier-detail.component';
import { CarrierShipmentComponent } from './carrier-shipment/carrier-shipment.component';
import { CarrierConnectionsComponent } from './carrier-connections/carrier-connections.component';
import { CarrierDriversComponent } from './carrier-drivers/carrier-drivers.component';
import { AddDotNumberComponent } from './add-dot-number/add-dot-number.component';
import { CarrierEditComponent } from './carrier-edit/carrier-edit.component'
import { DatePipe } from '@angular/common'
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
// import { CarrierViewComponent } from './carrier-view/carrier-view.component';
// import { CarrierComponent } from './carrier/carrier.component';
// import * as moment from 'moment';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
      MatButtonToggleModule,
      NgxMatSelectSearchModule,
      MatFormFieldModule,
      NgxSkeletonLoaderModule,
      MaterialModule,
      CarrierManagementRoutingModule,
      CommonModuleModule,
      MatSelectModule,
      MatSlideToggleModule,
      NgxDaterangepickerMd,
      MatRadioModule,
      MatDatepickerModule,
      AgmCoreModule.forRoot({
        apiKey: 'AIzaSyAMMBwZYg03hSwJEnODnIWf14YJKjWz_2A',
        libraries:['places']
        }),
      MatGoogleMapsAutocompleteModule
    ],

    declarations: [
      CarrierListComponent,
      CarrierDetailComponent,
      CarrierShipmentComponent,
      CarrierConnectionsComponent,
      CarrierDriversComponent,
      AddDotNumberComponent,
      CarrierEditComponent,
      PopupComponent
    ],
    entryComponents:[PopupComponent],
    providers:[
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
      },
      DatePipe,
    ],
    exports: [PopupComponent],
  })
export class CarrierManagementModule {
}
