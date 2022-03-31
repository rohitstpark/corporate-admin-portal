import { NgModule} from "@angular/core";
import { CommonModule } from '@angular/common';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModuleModule } from '../common/common-module.module';
import { MaterialModule } from '../common/material/material.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../common/services/auth-interceptor';

import { LookupComponent } from "./lookup/lookup.component";
import { PhoneLookupComponent } from "./phone-lookup/phone-lookup.component";
import { LookupRoutingModule } from "./lookup-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    CommonModuleModule,
    NgxDaterangepickerMd,
    LookupRoutingModule,
    HttpClientModule
  ],

  declarations: [
 LookupComponent,
 PhoneLookupComponent
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
export class LookupModule { }
