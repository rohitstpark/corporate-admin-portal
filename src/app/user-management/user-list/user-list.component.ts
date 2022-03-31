import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpService } from '../../common/services/http.service';
import * as APIURL from '../../common/config/api-endpoints';
import * as moment from "moment";
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { sharedService } from '../../common/services/shared.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {
	status: boolean = false;
  @ViewChild(DaterangepickerDirective, { static: false }) pickerDirective: DaterangepickerDirective;

  displayedColumns: string[] = ['name', 'email', 'phone', 'registrationDate', 'lastLogin', 'userActions'];

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  filterActivated:boolean=false;
  dataSource:any = [];
  apiCallInProcess:boolean=false;
  page:number = 1;
  limit:number=20;
  totalRecords:any;
  showLoader:boolean=false;
  filterForm: FormGroup;
  todayDate = moment();
    ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }

  selectedQueryParams: String = '';
  userList:any=[];

  constructor(private httpService: HttpService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private sharedService: sharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
      this.showLoader=true;
      this.setFormControls();
      
      this.activatedRoute.queryParams
        .subscribe(params => {
          if (params && Object.keys(params).length > 0) {
            this.sharedService.setFormControlBasedOnQueryParams(params, this.filterForm);
            this.updateSearchResults();
          } else {
            if(this.filterForm){
              this.filterForm.reset();
              if(this.selectedQueryParams && this.selectedQueryParams.length>1){
                this.selectedQueryParams = '';
              }
              this.filterActivated = false;
            }
            this.getUserListData();
          }
        });

  
    }
  
    setFormControls() {
      this.filterForm = this.fb.group({
        search:[],
        email:[],
        status:[],
        registrationDate:[]
      });
    
      }
  
    getUserListData(isPaginated?) {
      if (isPaginated) {
        this.apiCallInProcess = true;
      } else{
        this.showLoader = true;
      }
      const pagination = '?limit=' + this.limit + '&page=' + this.page;
      const appender = '&';
      let queryParams ;
      if (this.selectedQueryParams.length) {
        queryParams = this.selectedQueryParams;
        queryParams = pagination + appender + queryParams;
      }
      let apiUrl = APIURL.envConfig.USERMGMNTENDPOINTS.getUserList;
      const url = queryParams ? (apiUrl + queryParams) : apiUrl + pagination;
      this.httpService.get(url).subscribe(resp => {
        this.status = false;
        this.showLoader = false;
        this.apiCallInProcess = false;
        const responseList = (resp['success'] && resp['response']['allAdminList'].length) ? resp['response']['allAdminList'] : [];
        if (responseList.length) {
          responseList.forEach(element => {
            element.registrationDate = element.registrationDate ? new Date(element.registrationDate +' '+'UTC') : null;
            element.lastLogin = element.lastLogin ? new Date(element.lastLogin +' '+'UTC') : null;
          });
          this.dataSource = isPaginated ? this.dataSource.concat(responseList) : responseList;
        } else {
          this.dataSource = [];
        }
        if(resp['success']){
          this.totalRecords = resp['response']['totalRecords'];
        }
        else{
          this.sharedService.openMessagePopup('Error - ' +resp['message']);
        }
      }, (err) => {
        this.showLoader = false;
        this.apiCallInProcess = false;
        const errorMsg = 'Error - ' + err.message;
        this.sharedService.openMessagePopup('Error - ' +err['message']);
        // this.openMessagePopup(errorMsg);
      });
    }
  
    onTableScroll(e) {
      const tableViewHeight = e.target.offsetHeight // viewport
      const tableScrollHeight = e.target.scrollHeight // length of all table
      const scrollLocation = e.target.scrollTop; // how far user scrolled    
      // If the user has scrolled within 200px of the bottom, add more data
      const buffer = 300;
      const limit = tableScrollHeight - tableViewHeight - buffer;
      if (scrollLocation > limit && !this.apiCallInProcess && this.totalRecords > this.dataSource.length) {
        this.page = this.page + 1;
        this.getUserListData(true);
      }
    }
  
    filterToggleEvent() {
      this.status = !this.status;
    }

    updateSearchResults() {
      this.page = 1;
      const formValue = this.filterForm.value;
      let queryParams = '';
  
      if (formValue.registrationDate && formValue.registrationDate.start !== null) {
        let fromRegistrationDate;
        let toRegistrationDate;
        if(!formValue.registrationDate.start && formValue.registrationDate.indexOf('-')){
          const splitData = formValue.registrationDate.split('-')
          fromRegistrationDate = splitData[0];
          toRegistrationDate = splitData[1];
        }
        else{
          fromRegistrationDate = moment(formValue.registrationDate.start._d).format('MM/DD/YYYY');
          toRegistrationDate = moment(formValue.registrationDate.end._d).format('MM/DD/YYYY');
        }
        queryParams = queryParams + 'fromRegistrationDate=' + fromRegistrationDate + '&' + 'toRegistrationDate=' + toRegistrationDate +
         '&' + 'registrationDate=' + fromRegistrationDate + '-' + toRegistrationDate + '&';
      }
  
      if (formValue.search && formValue.search !== '') {
        queryParams = queryParams + 'search=' + formValue.search + '&';
      }

      if (formValue.email && formValue.email !== '') {
        queryParams = queryParams + 'email=' + formValue.email + '&';
      }

      if (formValue.status && formValue.status !== '') {
        queryParams = queryParams + 'status=' + formValue.status + '&';
      }
   
      // this.selectedQueryParams = queryParams;
      if(queryParams && queryParams.length>1){
  
        const lastchar = queryParams.charAt(queryParams.length - 1);
        // Remove & from last character
        if (lastchar === '&') {queryParams = queryParams.substring(0, queryParams.length - 1); }
        this.selectedQueryParams = queryParams;
        // convert queryparams to object to store it in url as queryparam
        const convertQuery = JSON.parse('{"' + decodeURI(queryParams.substring(0).replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}')
        this.methodToChangQueryParams(convertQuery);
        this.filterActivated = true;
        this.getUserListData();
      }
    }
  
    methodToChangQueryParams(query) {
      this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams: query
        });
    }
  
    resetData() {
      this.page = 1;
      this.filterActivated = false;
      this.filterForm.reset();
      if(this.selectedQueryParams && this.selectedQueryParams.length>1){
        this.selectedQueryParams = '';
      }
      this.methodToChangQueryParams(this.selectedQueryParams);
    }

    getInitials(name) {
      return this.sharedService.getInitials(name);
    }

    redirectToUserView(element){
      this.router.navigate(['user/view/',element.id,'details']);
    }

    redirectToEditView(element){
      this.router.navigate(['user/view/',element.id,'details'], { queryParams: {isEdit: true}});
    }

    redirectToCreateView(){
      this.router.navigate(['user/create']);
    }

}