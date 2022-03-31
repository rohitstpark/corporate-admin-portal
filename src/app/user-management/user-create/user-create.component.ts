import { Component, OnInit } from '@angular/core';
import * as APIURL from '../../common/config/api-endpoints';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../common/services/http.service';
import { sharedService } from '../../common/services/shared.service';
import $ from 'jquery';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  userId:any;
  userDetail:any;
  showLoader:boolean = false;
  isEditEnabled:boolean=false;
  createUserDetailForm: FormGroup;
  profileImage: any;

  constructor(private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    private sharedService: sharedService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.openCreateForm()


  }

  openCreateForm(){
    this.createUserDetailForm = this.fb.group({
      firstName: [
        null,
        Validators.compose([
          Validators.required, Validators.maxLength(25)
        ]),
      ],
      lastName: [
        null,
        Validators.compose([
          Validators.required, Validators.maxLength(25)
        ]),
      ],
      email: [
        null,
        Validators.compose([
          Validators.required
        ]),
      ],
      phone: [
        null,
        Validators.compose([
          Validators.required, Validators.minLength(10)
        ]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.required
        ]),
      ],
      status: [
        null,
        Validators.compose([
          Validators.required
        ]),
      ]
    });
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
    if (this.createUserDetailForm.valid) {
     this.showLoader = true;
     const url = APIURL.envConfig.USERENDPOINTS.addUser;
     const formVal = Object.assign({}, this.createUserDetailForm.value);
     const formData = new FormData();
     let status = formVal.status == 'active' ? '1' : '0';
     if(this.profileImage){
        formData.append('profileImage', this.profileImage);
     }
     formData.append('firstName', formVal.firstName);
     formData.append('lastName', formVal.lastName);
     formData.append('emailAddress', formVal.email);
     formData.append('phone', formVal.phone);
     formData.append('password', formVal.password);
     formData.append('status', status);

     this.httpService.post(url, formData).subscribe(resp => {
        this.showLoader = false;
        if (resp['success']) {
          this.sharedService.openMessagePopup('Success - Profile Updated Successfully');
          // this.createUserDetailForm.reset();
          // this.createUserDetailForm.updateValueAndValidity();
          }
          else{
            this.sharedService.openMessagePopup('Error - ' +resp['message']);
          }
        }, (err) => {
          this.showLoader = false;
          this.sharedService.openMessagePopup('Error -' +err['message']);
        });
      }
   }


  cancel(){
      this.router.navigate(['user'])
  }

}
