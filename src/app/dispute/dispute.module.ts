import { NgModule} from "@angular/core";
import { CommonModule } from '@angular/common';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DisputeRoutingModule } from './dispute-routing.module';
import { CommonModuleModule } from '../common/common-module.module';
import { MaterialModule } from '../common/material/material.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../common/services/auth-interceptor';

import { DisputeListComponent } from './dispute-list/dispute-list.component';
import { DisputeTabsComponent } from './dispute-tabs/dispute-tabs.component';
import { DisputeViewComponent } from './dispute-view/dispute-view.component';
import { DisputeTimelineComponent } from './dispute-timeline/dispute-timeline.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    DisputeRoutingModule,
    CommonModuleModule,
    NgxDaterangepickerMd
  ],

  declarations: [
    DisputeListComponent,
    DisputeTabsComponent,
    DisputeViewComponent,
    DisputeTimelineComponent
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
export class DisputeModule { }
