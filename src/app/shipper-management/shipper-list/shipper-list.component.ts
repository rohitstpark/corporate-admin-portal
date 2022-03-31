import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpService } from '../../common/services/http.service';
import * as APIURL from '../../common/config/api-endpoints';
import * as FILTERS from '../../common/config/filters-datalist';
import * as moment from "moment";
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { sharedService } from '../../common/services/shared.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { AlertMessageComponent } from '../../common/alert-message/alert-message.component';
// import {MatTableDataSource} from '@angular/material';
import { ActivatedRoute, Router, Params } from '@angular/router';
@Component({
  selector: 'app-shipper',
  templateUrl: './shipper-list.component.html',
  styleUrls: ['./shipper-list.component.css'],
})
export class ShipperListComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = ['companyName', 'equipmentType', 'industryType',
  'emailAddress', 'createdAt', 'connected', 'invitation'];
  dataSource : any = [];
  showLoader:boolean = false;

  filterForm: FormGroup;
  searchForm: FormGroup;
  statesList:any = [];
  equipmentTypes: any=[];
  operationTypes: any=[];
  noRecordFound = '';
  limit:number = 20;
  page:number = 1;
  status: boolean = false;
  todayDate = moment();
  apiCallInProcess: boolean = false;
  selectedQueryParams: String = '';
  totalRecords:number = 0;
  filterActivated:boolean = false;
  revenueValidationFailed = false;
  @ViewChild(DaterangepickerDirective, { static: false }) pickerDirective: DaterangepickerDirective;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }

  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private sharedService: sharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) { }

  openMessagePopup(msg) {
    this.snackBar.openFromComponent(AlertMessageComponent, {
      data:msg,
      duration: 500,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  ngOnInit() {
    this.statesList = FILTERS.carrierFilters.states;
    this.equipmentTypes = FILTERS.carrierFilters.equipmentTypes;
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
          this.getShipperListData();
        }
      });
    
      this.filterForm.get('minRevenue').valueChanges.subscribe(val => {
        this.filterForm.controls.maxRevenue.setValue(val);
        this.filterForm.controls.maxRevenue.setValidators(Validators.min(this.filterForm.controls.minRevenue.value));
        this.filterForm.controls.maxRevenue.enable();
  });
  }

  getShipperListData(isPaginated?) {
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
    const url = queryParams ? APIURL.envConfig.SHIPPERENDPOINTS.getshipperList + queryParams :
     APIURL.envConfig.SHIPPERENDPOINTS.getshipperList + pagination;
    this.httpService.get(url).subscribe(resp => {
      this.status = false;
      this.showLoader = false;
      this.apiCallInProcess = false;
      const responseList = (resp['success'] && resp['response']['allShipper'].length) ? resp['response']['allShipper'] : [];
      if (responseList.length) {
        responseList.forEach(element => {
          element.registrationDate = element.registrationDate ? new Date(element.registrationDate +' '+'UTC') : null;
        });
        this.dataSource = isPaginated ? this.dataSource.concat(responseList) : responseList;
      } else {
        this.dataSource = [];
        this.noRecordFound = 'No Record Found.';
      }
      if(resp['success']){
        this.totalRecords = resp['response']['totalRecords'];
      }
    }, (err) => {
      console.log('err', err)
      this.showLoader = false;
      this.apiCallInProcess = false;
      const errorMsg = 'Error - ' + err.message;
      this.openMessagePopup(errorMsg);
    });
  }

  setFormControls() {
    this.filterForm = this.fb.group({
      isRegisteredUser:[false],
      search: [''],
      searchAddress: [''],
      city: [''],
      state: [''],
      updatedAt:[],
      createdAt  :[''],
      registrationDate  :[''],
      lastLogin  :[''],
      firstLogin   :[''],
      equipmentType: [''],
      emailVerified: [false],
      phoneVerified: [false],
      minRevenue:[],
      maxRevenue: []
    });
    this.filterForm.controls.maxRevenue.disable();
  }

  filterToggleEvent() {
    this.status = !this.status;
  }

  updateSearchResults() {
    this.page = 1;
    const formValue = this.filterForm.value;
    let queryParams = '';

    this.revenueValidationFailed = false;
    if(formValue.minRevenue && (formValue.minRevenue > formValue.maxRevenue)){
      this.revenueValidationFailed = true;
      return false;
     }

    if (formValue.isRegisteredUser) {
      queryParams = queryParams + 'isRegisteredUser=' + (formValue.isRegisteredUser ? 1 : 0) + '&';
    }
    if (formValue.search && formValue.search !== '') {
      queryParams = queryParams + 'search=' + formValue.search + '&';
    }
    if (formValue.searchAddress && formValue.searchAddress !== '') {
      queryParams = queryParams + 'searchAddress=' + formValue.searchAddress + '&';
    }

    if (formValue.city && formValue.city !== '') {
      queryParams = queryParams + 'city=' + formValue.city + '&';
    }
    if (formValue.state && formValue.state !== '') {
      queryParams = queryParams + 'state=' + formValue.state + '&';
    }

    if (formValue.minRevenue) {
      queryParams = queryParams + 'minRevenue=' + formValue.minRevenue + '&';
    }

    if (formValue.maxRevenue) {
      queryParams = queryParams + 'maxRevenue=' + formValue.maxRevenue + '&';
    }

    if (formValue.equipmentType && formValue.equipmentType !== '') {
      queryParams = queryParams + 'equipmentType=' + formValue.equipmentType + '&';
    }

    if (formValue.emailVerified) {
      queryParams = queryParams + 'emailVerified=' + (formValue.emailVerified ? 1 : 0) + '&';
    }

    if (formValue.phoneVerified) {
      queryParams = queryParams + 'phoneVerified=' + (formValue.phoneVerified ? 1 : 0) + '&';
    }

    if (formValue.updatedAt && formValue.updatedAt.start !== null) {
      let fromUpdatedDate;
      let toUpdatedDate;
      if(!formValue.updatedAt.start && formValue.updatedAt.indexOf('-')){
        const splitData = formValue.updatedAt.split('-')
        fromUpdatedDate = splitData[0];
        toUpdatedDate = splitData[1];
      }
      else{
        fromUpdatedDate = moment(formValue.updatedAt.start._d).format('MM/DD/YYYY');
        toUpdatedDate = moment(formValue.updatedAt.end._d).format('MM/DD/YYYY');
      }
      queryParams = queryParams + 'fromUpdatedDate=' + fromUpdatedDate + '&' + 'toUpdatedDate='
      + toUpdatedDate + '&' + 'updatedAt=' + fromUpdatedDate + '-' + toUpdatedDate + '&';
    }

    if (formValue.createdAt && formValue.createdAt.start !== null) {
      let fromCreatedDate;
      let toCreatedDate;
      if(!formValue.createdAt.start && formValue.createdAt.indexOf('-')){
        const splitData = formValue.createdAt.split('-')
        fromCreatedDate = splitData[0];
        toCreatedDate = splitData[1];
      }
      else{
        fromCreatedDate = moment(formValue.createdAt.start._d).format('MM/DD/YYYY');
        toCreatedDate = moment(formValue.createdAt.end._d).format('MM/DD/YYYY');
      }
      queryParams = queryParams + 'fromCreatedDate=' + fromCreatedDate + '&' + 'toCreatedDate='
       + toCreatedDate + '&' + 'createdAt=' + fromCreatedDate + '-' + toCreatedDate + '&';
    }
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
      queryParams = queryParams + 'fromRegistrationDate=' + fromRegistrationDate + '&' + 
      'toRegistrationDate=' + toRegistrationDate + '&'  + 'registrationDate=' + fromRegistrationDate + '-' + toRegistrationDate + '&';
    }
    if (formValue.lastLogin && formValue.lastLogin.start !== null) {
      let fromLastLogin;
      let toLastLogin;
      if(!formValue.lastLogin.start && formValue.lastLogin.indexOf('-')){
        const splitData = formValue.lastLogin.split('-')
        fromLastLogin = splitData[0];
        toLastLogin = splitData[1];
      }
      else{
          fromLastLogin = moment(formValue.lastLogin.start._d).format('MM/DD/YYYY');
          toLastLogin = moment(formValue.lastLogin.end._d).format('MM/DD/YYYY');
      }
      queryParams = queryParams + 'fromLastLogin=' + fromLastLogin + '&' + 'toLastLogin=' + toLastLogin
      + '&' + 'lastLogin=' + fromLastLogin + '-' + toLastLogin + '&';
    }
    if (formValue.firstLogin && formValue.firstLogin.start !== null) {
      let fromFirstLogin;
      let toFirstLogin;
      if(!formValue.firstLogin.start && formValue.firstLogin.indexOf('-')){
        const splitData = formValue.firstLogin.split('-')
        fromFirstLogin = splitData[0];
        toFirstLogin = splitData[1];
      }
      else{
        fromFirstLogin = moment(formValue.firstLogin.start._d).format('MM/DD/YYYY');
        toFirstLogin = moment(formValue.firstLogin.end._d).format('MM/DD/YYYY');
      }
      queryParams = queryParams + 'fromFirstLogin=' + fromFirstLogin + '&' + 'toFirstLogin=' +
      toFirstLogin + '&' + 'firstLogin=' + fromFirstLogin + '-' + toFirstLogin + '&';
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
      this.getShipperListData();
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

  getInitials(name) {
    return this.sharedService.getInitials(name);
  }

  resetData() {
    this.page = 1;
    this.filterActivated = false;
    this.filterForm.reset();
    if(this.selectedQueryParams && this.selectedQueryParams.length>1){
      this.selectedQueryParams = '';
    }
    this.methodToChangQueryParams(this.selectedQueryParams);
    // this.getShipperListData();
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
      this.getShipperListData(true);
    }
  }

  redirectToShipperView(element){
    this.router.navigate(['shipper/view/',element.id,'details']);
  }

}


