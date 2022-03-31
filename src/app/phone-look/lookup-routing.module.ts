import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../common/guard/auth.guard';
import { LookupModule } from './lookup.module';
import { LookupComponent } from './lookup/lookup.component';
import { PhoneLookupComponent } from './phone-lookup/phone-lookup.component';

const routes: Routes = [
  { path:'', component: LookupComponent, canActivate : [AuthGuard] },
  { path:'new', component: PhoneLookupComponent, canActivate : [AuthGuard] },
]

@NgModule({
  imports:
   [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LookupRoutingModule {}
