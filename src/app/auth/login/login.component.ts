import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../common/services/http.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import  * as APIURL  from '../../common/config/api-endpoints';
declare var require: any
const { version: appVersion } = require('../../../../package.json');
import { sharedService } from '../../common/services/shared.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  isLoginFormSubmitted = false;
  setActiveClass = 'signIn';
  // adminEmail = 'admin@laneaxis.com';
  // adminPassword = '123456';
  adminEmail = '';
  adminPassword = '';
  showLoader:boolean = false;
  unAuthorisedUser: any =''
  loginmessageError:any='';
  hide: boolean = false;

  constructor(private fb: FormBuilder,
  private httpService: HttpService,
  private router:Router,
  private sharedService: sharedService) { }

  ngOnInit() {
    localStorage.clear();
    this.loginForm = this.fb.group({
      username: [
        '',
        Validators.compose([
          Validators.required, Validators.email
        ]),
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  onSignIn(event:any) {
    this.loginmessageError = '';
    this.unAuthorisedUser = '';
    if ((event && event.keyCode && event.keyCode !== 13)) {
      return;
    }
    this.isLoginFormSubmitted = true;
    if (this.loginForm.valid) {
      this.showLoader = true;
      const formVal = Object.assign({}, this.loginForm.value);
      const url = APIURL.envConfig.AUTHENDPOINTS.login;
      const reqBody =
      {
        'username': formVal.username, //'akankshacarrier@mailinator.com',
        'password': formVal.password, //'12345678',
        'os_version': navigator.userAgent, //'windows-10',
        'app_version':  appVersion
      }
      this.httpService.post(url, reqBody).subscribe(resp => {
        console.log('resp');
        console.log(resp);
        console.log(resp['success']);
        console.log("resp");
        if(resp['success']){
          const loginResponse = resp['response'];
          if(loginResponse.userType === 'SUPER_ADMIN' || loginResponse.userType === 'ADMIN'){
            localStorage.setItem('access_token', loginResponse.access);
            localStorage.setItem('email_verified', loginResponse.emailVerified);
            localStorage.setItem('refresh_token', loginResponse.refresh);
            localStorage.setItem('user_id', loginResponse.userId);
            localStorage.setItem('user_type', loginResponse.userType);
            this.router.navigate(['carrier']);
          }
          else{
            this.showLoader = false;
            this.unAuthorisedUser = 'You are not allowed to use this portal.'
          }
        }
        else{
          this.showLoader = false;
          console.log('ifharr')
        }
      },(err) => {
        this.showLoader = false;
        if(err.status == 401){
          this.loginmessageError = 'Invalid Email/Password';
          
        }
        else if(err.status == 405){
          this.sharedService.openMessagePopup('Error - You are not authorized to login please contact with support team');
          
        }
        else{
          this.loginmessageError = 'Something went wrong. Try again later.';
        }
      })
    }
  }


}
