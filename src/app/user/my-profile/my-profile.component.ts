import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../common/services/http.service';
import * as APIURL from '../../common/config/api-endpoints';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import $ from 'jquery';
import { sharedService } from '../../common/services/shared.service';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { AlertMessageComponent } from '../../common/alert-message/alert-message.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class myProfileComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  hideEditProfile = true;
  userDetail: any;
  showLoader= false;
  editUserDetailForm: FormGroup;
  profileImage: any;
  firstName: String;
  lastName: String;
  userType: String;
  errorFirstName = false;
  errorLastName = false;
  constructor(private httpService: HttpService,
     private fb: FormBuilder, 
     private sharedService: sharedService,
     private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.showLoader = true;
    if (localStorage.getItem('user_type')) {
      this.userType = localStorage.getItem('user_type');
    }
    this.getUserDetail();

    
  }

  getUserDetail() {
    this.hideEditProfile = true;
    const url = APIURL.envConfig.USERENDPOINTS.getAdminUserDetail;
    this.httpService.get(url).subscribe(resp => {
      this.showLoader = false;
      if (resp['success']) {
          const userResponse = resp['response'][0];
          this.userDetail = userResponse;
          this.firstName = userResponse.firstName;
          this.lastName = userResponse.lastName;
          this.sharedService.userUpdate$.next(this.userDetail);
        }
      }, (err) => {
        this.showLoader = false;
        // console.log('err', err);
        // this.showLoader = false;
        // this.oppsError = 'Something went wrong. Try again later.';
      });
  }

  openEditForm(){
    this.editUserDetailForm = this.fb.group({
      firstName: [
        this.userDetail.firstName,
        Validators.compose([
          Validators.required, Validators.maxLength(25)
        ]),
      ],
      lastName: [
        this.userDetail.lastName,
        Validators.compose([
          Validators.required, Validators.maxLength(25)
        ]),
      ],
      email: [
        this.userDetail.email,
        Validators.compose([
          Validators.required
        ]),
      ],
      phone: [
        this.userDetail.phone,
        Validators.compose([
          Validators.required
        ]),
      ]
    });
    this.hideEditProfile = !this.hideEditProfile;
  }

  openDialogBox() {
    document.getElementById('my_file').click();
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.profileImage = file;
      const reader = new FileReader();
      reader.onload = function(e) {
            $('#imgFilter')
          .attr('src', e.target['result']);
      };
      reader.readAsDataURL(event.target.files[0]);
     }
   }

   onSubmit(event) {
    if (event && event.keyCode && event.keyCode !== 13) {
      return;
    }
    if (this.editUserDetailForm.valid) {
     this.showLoader = true;
     const url = APIURL.envConfig.USERENDPOINTS.updateProfile;
     const formVal = Object.assign({}, this.editUserDetailForm.value);
     const formData = new FormData();
     if(this.profileImage){
        formData.append('profileImage', this.profileImage);
     }
     formData.append('firstName', formVal.firstName);
     formData.append('lastName', formVal.lastName);
     formData.append('id', this.userDetail.id);

     this.httpService.put(url, formData).subscribe(resp => {
        this.showLoader = false;
        if (resp['success']) {
          this.snackBar.openFromComponent(AlertMessageComponent, {
            data : 'Profile Update - Profile updated Successfully',
            duration: 1500,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
            this.getUserDetail();
            this.hideEditProfile = true;
          }
        }, (err) => {
          this.showLoader = false;
          // console.log('err', err);
          // this.showLoader = false;
          // this.oppsError = 'Something went wrong. Try again later.';
        });
      }
   }

   getInitials(){
    const name = this.userDetail.firstName + ' '+ this.userDetail.lastName;
    return this.sharedService.getInitials(name);
  }



}
