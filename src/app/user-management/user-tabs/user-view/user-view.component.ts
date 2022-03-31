import { Component, OnInit } from '@angular/core';
import * as APIURL from '../../../common/config/api-endpoints';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../common/services/http.service';
import { sharedService } from '../../../common/services/shared.service';
import $ from 'jquery';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  userId:any;
  userDetail:any;
  showLoader:boolean = false;
  isEditEnabled:boolean=false;
  editUserDetailForm: FormGroup;
  profileImage: any;

  constructor(private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    private sharedService: sharedService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params.userId;
      this.showLoader = true;
      this.getUserDetails();
   });


  }
  getUserDetails(){
    const url = APIURL.envConfig.USERMGMNTENDPOINTS.getUserDetails + '?id=' + this.userId;
    this.httpService.get(url).subscribe(resp => {
      if(resp['response']){
        this.showLoader = false;
        this.userDetail = resp['response'][0];
        this.userDetail.registrationDate = this.userDetail.registrationDate ? new Date(this.userDetail.registrationDate +' '+'UTC') : null;
        this.userDetail.firstLogin = this.userDetail.firstLogin ? new Date(this.userDetail.firstLogin +' '+'UTC') : null;
        this.userDetail.lastLogin = this.userDetail.lastLogin ? new Date(this.userDetail.lastLogin +' '+'UTC') : null;
        if(this.userDetail.name){
          const splitNames = this.userDetail.name.split(' ');
          this.userDetail['firstName'] = splitNames[0];
          this.userDetail['lastName'] =splitNames[1];
        }

        if(this.activatedRoute.snapshot.queryParamMap){
          const isEdit = this.activatedRoute.snapshot.queryParamMap.get('isEdit');
          if(isEdit){
             this.openEditForm();
          }
        }
      }
    }, (err) => {
      this.showLoader = false;
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
      ],
      status: [
        this.userDetail.status,
        Validators.compose([
          Validators.required
        ]),
      ]
    });
    this.isEditEnabled=true;
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

   updateDetails() {
    if (this.editUserDetailForm.valid) {
     this.showLoader = true;
     const url = APIURL.envConfig.USERENDPOINTS.updateProfile;
     const formVal = Object.assign({}, this.editUserDetailForm.value);
     const formData = new FormData();
     let status = formVal.status == 'active' ? '1' : '0';
     if(this.profileImage){
        formData.append('profileImage', this.profileImage);
     }
     formData.append('firstName', formVal.firstName);
     formData.append('lastName', formVal.lastName);
     if(this.userDetail.email != formVal.email){
        formData.append('emailAddress', formVal.email);
     }
     if(this.userDetail.phone != formVal.phone){
      formData.append('phone', formVal.phone);
     }
     formData.append('status', status);
     formData.append('id', this.userDetail.id);

     this.httpService.put(url, formData).subscribe(resp => {
        this.showLoader = false;
        if (resp['success']) {
          this.sharedService.openMessagePopup('Success - Profile Updated Successfully');
            this.getUserDetails();
            this.isEditEnabled = false;
          }
        }, (err) => {
          this.showLoader = false;
        });
      }
   }

  getInitials(name) {
    return this.sharedService.getInitials(name);
  }

  cancel(query?){
    this.isEditEnabled = false
    query = '';
      this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams: query
        });
  }
  


}
