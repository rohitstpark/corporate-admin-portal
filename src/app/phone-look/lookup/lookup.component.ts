import { formatCurrency } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { ActivatedRoute, Router, Params } from '@angular/router';
// import { HttpClient } from 'selenium-webdriver/http';
import { HttpService } from 'src/app/common/services/http.service';
import * as APIURL from '../../common/config/api-endpoints';
import * as moment from "moment";
import { DaterangepickerDirective,NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { sharedService } from '../../common/services/shared.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css']
})
export class LookupComponent implements OnInit {
  
	status: boolean = false;
  @ViewChild(DaterangepickerDirective, { static: false }) pickerDirective: DaterangepickerDirective;

  displayedColumns: string[] = ['id','phone','checkedBy','carrierName','carrierType','createdAt','updatedAt','mobileCountryCode','mobileNetworkCode','callerName','callerType'];

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  filterActivated:boolean=false;
  dataSource:any = [];
  apiCallInProcess:boolean=false;
  page:number = 1;
  limit:number=10;
  showLoader:boolean=false;
  filterForm: FormGroup;

  totalRecords:any;
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

  // toogle:boolean=false;



  constructor(
    private router: Router,
    private httpService:HttpService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private sharedService: sharedService,
    private activatedRoute: ActivatedRoute
  ) { }

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
      phone:[],
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
    let apiUrl = APIURL.envConfig.LOOKUPLIST.getlookuplist;
    const url = queryParams ? (apiUrl + queryParams) : apiUrl + pagination;
    this.httpService.get(url).subscribe(resp => {
      this.status = false;
      this.showLoader = false;
      this.apiCallInProcess = false;
      const responseList = (resp['success'] && resp['response']['lookupPhone'].length) ? resp['response']['lookupPhone'] : [];
      if (responseList.length) {
        responseList.forEach(element => {
          element.createdAt = element.createdAt ? new Date(element.createdAt +' '+'UTC') : null;
          element.updatedAt = element.updatedAt ? new Date(element.updatedAt +' '+'UTC') : null;
        });
        // console.log('responseList');
        // console.log(responseList);

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
    this.status = !this.status
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
      queryParams = queryParams + 'dateFrom=' + fromRegistrationDate + '&' + 'dateTo=' + toRegistrationDate +
       '&' + 'registrationDate=' + fromRegistrationDate + '-' + toRegistrationDate + '&';
    }

    if (formValue.phone && formValue.phone !== '') {
      queryParams = queryParams + 'phone=' + formValue.phone + '&';
    }

   
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

  OpenCreate(){
    this.router.navigate(['lookup/new']);
   }


}
 // const lastchar =this.APIurl.charAt(this.APIurl.length - 1);
    // console.log(lastchar);
    // if (lastchar === '&') 
    // {this.APIurl = this.APIurl.substring(0, this.APIurl.length - 1); }
      // console.log(this.info.response.lookupPhone[3].callerName);
    