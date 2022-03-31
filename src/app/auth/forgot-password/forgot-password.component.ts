import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../common/services/http.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import  * as APIURL  from '../../common/config/api-endpoints';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  showPasswordSend= true;
  isForgotPasswordSubmit = false;
  isOtpVerificationSubmit = false;
  forgotForm!: FormGroup;
  createNewPasswordForm!: FormGroup;
  otpVerificationForm!: FormGroup;
  failureMsg: any;
  isEmailSelected: any;
  otpEnterShow = false;
  oldPassword: any;
  isResetPwdSubmit = false;
  createPasswordShow = false;
  thankyouMsg = false;
  resendmessage: any = '';
  oppsError: any = '';
  paswwordNotMatch = false;
  showLoader = false;
  spinnerLoading = false;
  resendOTPSuccess:any;

  hide1: boolean = false;
  hide2: boolean = false;
  constructor(private fb: FormBuilder,
              private httpService: HttpService,
              private router: Router) { }

  ngOnInit() {
    localStorage.clear();
    this.forgotForm = this.fb.group({
      username: ['',
        Validators.compose([
          Validators.required, Validators.email
        ]),
      ]
    });
    this.otpVerificationForm = this.fb.group({
      emailOtp: [
        '',
        Validators.compose([
          Validators.required, Validators.minLength(6), Validators.pattern('^[0-9]*$')
        ]),
      ]
    });

    this.createNewPasswordForm = this.fb.group({
      newPassword: [
        '',
        Validators.compose([
          Validators.required
        ]),
      ],
      confirmPassword: [
        '',
        Validators.compose([
          Validators.required
        ]),
      ]
    });

    // this.forgotForm.get('username').valueChanges.subscribe(val => {
    //   this.failureMsg = '';
    // });

    // this.otpVerificationForm.get('emailOtp').valueChanges.subscribe(val => {
    //   this.failureMsg = '';
    //   this.resendOTPSuccess = '';
    // });

    // this.createNewPasswordForm.get('newPassword').valueChanges.subscribe(val => {
    //   this.oppsError = '';
    // });

  }

  sendOTP(event:any, isresend?:any) {
    if (event && event.keyCode && event.keyCode !== 13) {
      return;
    }
    this.isForgotPasswordSubmit = true;
    if (this.forgotForm.valid) {
     if (!isresend) { this.showLoader = true; } else { this.spinnerLoading = true;}
     const formVal = Object.assign({}, this.forgotForm.value);
     this.isEmailSelected = formVal.username;
     const url = APIURL.envConfig.AUTHENDPOINTS.forgotPwd;
     const reqBody = {
        username: formVal.username,
      };
     this.httpService.post(url, reqBody).subscribe(resp => {
        this.showLoader = false;
        this.spinnerLoading = false;
          this.showPasswordSend = false;
          this.otpEnterShow = true;
          if (isresend) { this.resendOTPSuccess = 'Verification code sent successfully';}
      }, (err) => {
        this.showLoader = false;
        this.spinnerLoading = false;
        this.oppsError = 'Something went wrong. Try again later.';
      });
    }
  }

  sendEmailOTP(event:any) {
    if (event && event.keyCode && event.keyCode !== 13) {
      return;
    }
    this.isOtpVerificationSubmit = true;
    if (this.otpVerificationForm.valid) {
      this.showLoader = true;
      const formVal = Object.assign({}, this.otpVerificationForm.value);
      const url = APIURL.envConfig.AUTHENDPOINTS.verifyOTP;
      const reqBody = {
        'email_otp': formVal.emailOtp,
        'email': this.isEmailSelected
      };
      this.httpService.post(url,reqBody).subscribe(resp => {
        this.showLoader = false;
        if (resp['success']) {
          this.createPasswordShow = true;
          this.otpEnterShow = false;
         
          const currentPassword = resp['response']['current_password'];
          this.oldPassword = currentPassword;
          console.log(currentPassword);
        } else {
          this.failureMsg = resp['message'];
        }
      }, (err) => {
        console.log('err', err)
        this.showLoader = false;
        this.failureMsg = err.error['message'];
        // this.oppsError = 'Something went wrong. Try again later.'
      });
    }
  }

  resetPassword(event:any) {
    this.paswwordNotMatch = false;
    if (event && event.keyCode && event.keyCode !== 13) {
      return;
    }
    this.isResetPwdSubmit = true;
    if (this.createNewPasswordForm.valid) {
      this.showLoader = true;
      const formVal = Object.assign({}, this.createNewPasswordForm.value);
      if (formVal.newPassword != formVal.confirmPassword) {
        this.paswwordNotMatch = true;
        this.showLoader = false;
        return false;
      }
      const url = APIURL.envConfig.AUTHENDPOINTS.resetPwd;
      const reqBody = {
        'email': this.isEmailSelected,
        'oldPassword': this.oldPassword,
        'newPassword': formVal.newPassword

      };
      this.httpService.post(url, reqBody).subscribe(resp => {
        this.showLoader = false;
        if (resp['success']) {
          this.createPasswordShow = false;
          this.thankyouMsg = true;
        } else {
          this.oppsError = resp['message'];
        }
      }, (err) => {
        console.log('err', err)
        this.showLoader = false;
        this.oppsError = 'Something went wrong. Try again later.';
      });
    }
  }

  goToSignIn() {
    this.router.navigate(['']);
  }

}
