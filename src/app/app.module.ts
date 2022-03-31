import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AuthGuard } from './common/guard/auth.guard';
import { appRoutes } from './app-routing.module';
import { AuthInterceptor  } from './common/services/auth-interceptor';
import { MaterialModule  } from './common/material/material.module';
import { AlertMessageComponent } from './common/alert-message/alert-message.component';
import { CommonModuleModule } from './common/common-module.module';

/* Component */
import { LoginComponent } from './auth/login/login.component';
import { myProfileComponent } from './user/my-profile/my-profile.component';
import { UserListingComponent } from './user/user-listing/user-listing.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { changePasswordComponent } from './user/change-password/change-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component'; // CLI imports router
import { DashboardComponent } from './dashboard/dashboard.component';
import { AgmCoreModule } from '@agm/core';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    myProfileComponent,
    UserListingComponent,
    AddUserComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    changePasswordComponent,
    AlertMessageComponent
  ],
  
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CommonModuleModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAMMBwZYg03hSwJEnODnIWf14YJKjWz_2A',
      libraries: ['places']
    }),
    MatGoogleMapsAutocompleteModule,
    AgmCoreModule.forRoot(),
    // LookupModule
  ],
  providers: [AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  entryComponents: [
    AlertMessageComponent
  ],
  exports: [RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
