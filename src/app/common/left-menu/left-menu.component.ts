import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpService } from '../../common/services/http.service';
import * as APIURL from '../../common/config/api-endpoints';
import { sharedService } from '../services/shared.service';
@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent implements OnInit {
	status: boolean = false;
  mobileMnue: boolean = true;
  userDetail:any;
  userType: String;

  constructor(private router: Router, private sharedService: sharedService, private httpService: HttpService) { }

  ngOnInit() {
    this.getUserDetail();
    if(localStorage.getItem('user_type')){
      this.userType = localStorage.getItem('user_type');
      this.userType = this.userType.replace('_',' ');
    }
    this.sharedService.userUpdate$.subscribe((userData) => {
      this.getUserDetail();
    });
  }

  getUserDetail(){
    const url = APIURL.envConfig.USERENDPOINTS.getAdminUserDetail;
    this.httpService.get(url).subscribe(resp => {
      // this.showLoader = false;
      if (resp['success']) {
          const userResponse = resp['response'][0];
          this.userDetail = userResponse;
        }
      }, (err) => {
        // this.showLoader=false;
        // console.log('err', err);
        // this.showLoader = false;
        // this.oppsError = 'Something went wrong. Try again later.';
      });
  }

  menuToggleEvent() {
  	this.status = !this.status;
  }
  mobileMenuToggleEvent() {
    this.mobileMnue = !this.mobileMnue;
  }
  
  logout(){
    const url = APIURL.envConfig.USERENDPOINTS.logout;
    const reqBody = {
      'deviceId':'e32cfc3c-8cae-bc44-1b2b-4134c4e8c60f',
      'token':'f4wmryzMga0:APA91bG6rTWJBEnKf7zgGZL8Mdrwum8jkLCJ0Ca4cFbIk-9A2-H4KXq6kWtaX1YBjbrjaVt4LCMFXNaLYxGLEEH1n2LnjsHxSFWOu3GQ3j6Zq4e3C_beoMmAq6Jmb_w3ctvYmiyiSLeU'
    }
    this.httpService.post(url,reqBody).subscribe(resp => {
      // this.showLoader = false;
      if (resp['success']) {
        localStorage.clear();
        this.router.navigate(['']);
        }
      }, (err) => {
        // this.showLoader=false;
        // console.log('err', err);
        // this.showLoader = false;
        // this.oppsError = 'Something went wrong. Try again later.';
      });
    // 
  }

  getInitials(){
    const name = this.userDetail.firstName + ' '+ this.userDetail.lastName;
    return this.sharedService.getInitials(name);
  }

}
