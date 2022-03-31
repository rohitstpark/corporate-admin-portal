import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonRoutingModule } from './common-routing.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { TabHeaderComponent } from '../carrier-management/tab-header/tab-header.component';
import { ConnectinsComponent } from './tabs/connections/connections.component';
import { DriversComponent } from './tabs/drivers/drivers.component';
import { ShipmentsComponent } from './tabs/shipments/shipments.component';
import { ProgressComponent } from './../common/progress/progress.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './services/http.service';
import { AuthGuard } from './guard/auth.guard';
import { AgmCoreModule } from '@agm/core';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';

@NgModule({
  declarations: [LeftMenuComponent,
    TabHeaderComponent,
     ConnectinsComponent,
     DriversComponent,
     ShipmentsComponent, 
     ProgressComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    CommonRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAMMBwZYg03hSwJEnODnIWf14YJKjWz_2A',
      libraries:['places']
      }),
    MatGoogleMapsAutocompleteModule
  ],
  providers:[HttpService, AuthGuard],
  exports : [LeftMenuComponent, 
    TabHeaderComponent,
    ConnectinsComponent, DriversComponent, ShipmentsComponent, ProgressComponent]
})
export class CommonModuleModule { }
