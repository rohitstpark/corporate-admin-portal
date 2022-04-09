import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../common/services/http.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import  * as APIURL  from '../../common/config/api-endpoints';
import {Location} from '@angular/common';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { AlertMessageComponent } from '../../common/alert-message/alert-message.component';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class changePasswordComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  changePasswordForm: FormGroup;
  paswwordNotMatch = false;
  showLoader = false;
  ischangePwdSubmit = true;
  hide: boolean = false;
  hide1: boolean = false;
  hide2: boolean = false;

  constructor(private fb: FormBuilder,
    private _location: Location,
    private httpService: HttpService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      oldPassword: [
        '',
        Validators.compose([
          Validators.required, Validators.minLength(6)
        ]),
      ],
      newPassword: [
        '',
        Validators.compose([
          Validators.required, Validators.minLength(6)
        ]),
      ],
      confirmPassword: [
        '',
        Validators.compose([
          Validators.required, Validators.minLength(6)
        ]),
      ]
    });
  }

  changePassword(event) {
    this.paswwordNotMatch = false;
    this.ischangePwdSubmit = true;
    if (event && event.keyCode && event.keyCode !== 13) {
      return;
    }
    if (this.changePasswordForm.valid) {
      this.showLoader = true;
      const formVal = Object.assign({}, this.changePasswordForm.value);
      if (formVal.newPassword != formVal.confirmPassword) {
        this.paswwordNotMatch = true;
        this.showLoader = false;
        return false;
      }
      const url = APIURL.envConfig.USERENDPOINTS.changePwd;
      const reqBody = {
        'oldPassword': formVal.oldPassword,
        'newPassword': formVal.newPassword,
        'confirmPassword': formVal.confirmPassword

      };
      this.httpService.post(url, reqBody).subscribe(resp => {
        this.showLoader = false;
        if (resp['success']) {
          this.resetForm();
          this.snackBar.openFromComponent(AlertMessageComponent, {
            data : 'Change Password - Password changed Successfully',
            duration: 1500,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }, (err) => {
        console.log('err', err)
        this.showLoader = false;
      });
    }
  }
  
  backClicked() {
    this._location.back();
  }

  resetForm(){
    this.ischangePwdSubmit = false;
    this.changePasswordForm.controls['oldPassword'].setValue(null);
    this.changePasswordForm.controls['newPassword'].setValue(null);
    this.changePasswordForm.controls['confirmPassword'].setValue(null);
  }

}
