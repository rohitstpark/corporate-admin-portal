import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../common/guard/auth.guard';

import { DisputeListComponent } from './dispute-list/dispute-list.component';
import { DisputeViewComponent } from './dispute-view/dispute-view.component';
import { DisputeTabsComponent } from './dispute-tabs/dispute-tabs.component';
import { DisputeTimelineComponent } from './dispute-timeline/dispute-timeline.component';


const routes: Routes = [
  { path: '', component: DisputeListComponent, canActivate : [AuthGuard] },
  { path: 'view/:shipmentId/details', component: DisputeViewComponent, canActivate : [AuthGuard] },
  { path: 'view/:shipmentId/timeline', component: DisputeTimelineComponent, canActivate : [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DisputeRoutingModule {}
