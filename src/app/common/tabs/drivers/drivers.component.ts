import { Component, OnInit, ViewChild, ChangeDetectorRef, Input,Output, EventEmitter } from '@angular/core';
import * as moment from "moment";
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import * as APIURL from '../../config/api-endpoints';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sharedService } from '../../../common/services/shared.service';
import * as FILTERS from '../../../common/config/filters-datalist';
// import { GermanAddress } from '@angular-material-extensions/google-maps-autocomplete';
import { MapsAPILoader } from '@agm/core';
// import { Appearance } from '@angular-material-extensions/google-maps-autocomplete';
// import PlaceResult = google.maps.places.PlaceResult;
import {Location, Appearance, GermanAddress} from '@angular-material-extensions/google-maps-autocomplete';
// import {} from '@types/googlemaps';
import PlaceResult = google.maps.places.PlaceResult;

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit {
  @Output() outputUserName = new EventEmitter<string>();
  status: boolean = false;
  public tableCols:any = {
    carrier: ['name', 'phone', 'email', 'registrationDate', 'currentLocation', 'status'],
    driver: ['name', 'phone', 'email', 'registrationDate', 'dotNumber', 'cdlNumber', 'currentLocation', 'status']
  };
  displayedColumns: any;
  dataSource = [];
  carrierId: any;
  filterForm!: FormGroup;
  driverList: any;
  tabCountData: any;
  totalRecords: any;
  equipmentTypes: any;
  todayDate = moment();
  filterActivated: boolean = false;
  selectedQueryParams = '';
  page: number = 1;
  limit: number = 20;
  public apiCallInProcess:any;
  public showLoader:any;
  statesList: any = [];
  statusList: any = [];
  searchForm!: FormGroup;
  public carrierName: any;
  public location: any;
  public geoCode: any;
  public geoCoder: any;
  newLatitude: any;
  newLongitude: any;
  public searchText: any;
  driverTabTypes: any = [];
  locationStatus:any = [];
  public locationLoader:boolean=false;
  selectedTab:any;
  userId:any;
  @Input() moduleName :any;
  @ViewChild(DaterangepickerDirective, { static: false }) pickerDirective: DaterangepickerDirective;

  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }

  filterToggleEvent() {
    this.status = !this.status;
  }

  constructor(private activatedRoute: ActivatedRoute,
              private route: Router,
              private httpService: HttpService,
              private fb: FormBuilder,
              private sharedService: sharedService,
              private mapsAPILoader: MapsAPILoader,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
    localStorage.removeItem('driverName');
    localStorage.removeItem('driverUserId');

    this.setFormControls();
    this.equipmentTypes = FILTERS.carrierFilters.equipmentTypes;
    this.driverTabTypes = FILTERS.carrierFilters.driverTabTypes;
    this.statesList = FILTERS.carrierFilters.states;
    this.statusList = FILTERS.carrierFilters.statusList;
    this.carrierName = localStorage.getItem('carrierName');
    this.activatedRoute.params.subscribe(params => {
      this.carrierId = params['carrierId'];
    });
    const mName = this.moduleName;
    this.displayedColumns = this.moduleName == 'driver' ? this.tableCols[mName] : this.tableCols['carrier'];
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params && Object.keys(params).length > 0) {
          this.sharedService.setFormControlBasedOnQueryParams(params, this.filterForm);
          this.selectedTab = this.filterForm.controls['tabType'].value;
          this.updateFilterList();
        } 
        else {
          if(this.filterForm){
            this.filterForm.reset();
            if(this.selectedQueryParams && this.selectedQueryParams.length>1){
              this.selectedQueryParams = '';
            }
            this.filterActivated = false;
          }
          this.getUserAPICall();
        }
      });
  }

  setFormControls() {
    this.filterForm = this.fb.group({
      search: [],
      shipmentId: [],
      location: [],
      phoneAndEmail: [],
      city: [],
      equipmentId: [],
      state: [],
      registrationDate: [],
      updatedDate: [],
      tabType: [],
      invitationDate: [],
      firstLoginDate: [],
      lastLoginDate: [],
    });
    this.searchForm = this.fb.group({
      searchInput: [''],
    });
  }

  getUserAPICall(){
    let isApiCallRequired:boolean = false;

    this.userId = localStorage.getItem('userId');
    if (this.moduleName == 'carrier'  && (!this.userId || localStorage.getItem('carrierId')!=this.carrierId)){
      isApiCallRequired = true;
      this.sharedService.getUserIdAndName(this.carrierId).subscribe(resp=>{
        const carrierProfile = resp['response'];
        this.userId = carrierProfile['userId'];
        this.carrierName = carrierProfile['legalName'];
        this.getDriverList();
        // this.emitUserNameToParentComponent(this.carrierName);
      });
    }
    if(!isApiCallRequired){
      this.getDriverList();
    }
  }

  getDriverList(isPaginated?:any) {
    if (isPaginated) {
      this.apiCallInProcess = true;
    } else {
      this.showLoader = true;
    }
    
    this.emitUserNameToParentComponent(this.carrierName);
    const CarrierIdQueryParam = this.moduleName == 'carrier' ? '&carrierId=' + this.userId : '';
    const pagination = '?limit=' + this.limit + '&page=' + this.page + CarrierIdQueryParam;
    const appender = '&';
    let queryParams = '';
    if (this.selectedQueryParams.length) {
      queryParams = this.selectedQueryParams;
      queryParams = pagination + appender + queryParams;
    }
    const url = queryParams ? APIURL.envConfig.CARRIERENDPOINTS.getDriverList + queryParams :
      APIURL.envConfig.CARRIERENDPOINTS.getDriverList + pagination;
    this.httpService.get(url).subscribe(resp => {
      this.status = false;
      this.showLoader = false;
      this.apiCallInProcess = false;
      const responseList = (resp['success'] && resp['response']['allDrivers'].length) ? resp['response']['allDrivers'] : [];
      if (resp['success'] && responseList.length) {
        responseList.forEach(element => {
          element.registrationDate = element.registrationDate ? new Date(element.registrationDate +' '+'UTC') : null;
        });
        this.driverList = isPaginated ? this.driverList.concat(responseList) : responseList;
        // this.driverList.forEach((element, index) => {
        //   if (element.pickupLocationLat && element.pickupLocationLong) {
        //     this.codeAddress(element.pickupLocationLat, element.pickupLocationLong, index);
        //   }
        // });
      }
      else {
        this.driverList = [];
      }
      if(resp['success']){
        this.tabCountData = resp['response']['tabCount'];
        this.driverTabTypes.forEach(element => {
          element['count'] = this.tabCountData[element.key] ? this.tabCountData[element.key] : 0;
        });
        this.totalRecords = resp['response']['totalRecords'];
      }
    }, (err) => {
      console.log('err', err)
      this.showLoader = false;
      this.apiCallInProcess = false;
      const errorMsg = 'Error - ' + err.message;
      // this.openMessagePopup(errorMsg);
    });
  }

  getInitials(name:any) {
    return this.sharedService.getInitials(name);
  }

  updateFilterList() {
    this.page = 1;
    const formValue = this.filterForm.value;
    let queryParams = '';

    if (formValue.search) {
      queryParams = queryParams + 'search=' + formValue.search + '&';
    }

    if (formValue.shipmentId) {
      queryParams = queryParams + 'shipmentId=' + formValue.shipmentId + '&';
    }

    if (formValue.tabType) {
      queryParams = queryParams + 'tabType=' + formValue.tabType + '&';
    }

    if (formValue.phoneAndEmail) {
      queryParams = queryParams + 'phoneAndEmail=' + formValue.phoneAndEmail + '&';
    }

    if (formValue.location) {
      if (this.newLatitude != null && this.newLongitude != null) {
        queryParams = queryParams + 'latitude=' + this.newLatitude + '&' + 'longitude=' +
          this.newLongitude + '&' + 'location=' + this.location + '&';
      }
    }
    if (formValue.city) {
      queryParams = queryParams + 'city=' + formValue.city + '&';
    }

    if (formValue.state) {
      queryParams = queryParams + 'state=' + formValue.state + '&';
    }

    if (formValue.registrationDate && formValue.registrationDate.start !== null) {
      // const fromRegistrationDate = moment(formValue.registrationDate.start._d).format('MM/DD/YYYY');
      // const toRegistrationDate = moment(formValue.registrationDate.end._d).format('MM/DD/YYYY');
      // queryParams = queryParams + 'fromRegistrationDate=' + fromRegistrationDate + '&' + 'toRegistrationDate=' + toRegistrationDate + '&';

      let fromRegistrationDate;
      let toRegistrationDate;
      if (!formValue.registrationDate.start && formValue.registrationDate.indexOf('-')) {
        const splitData = formValue.registrationDate.split('-');
        fromRegistrationDate = splitData[0];
        toRegistrationDate = splitData[1];
      }
      else {
        fromRegistrationDate = moment(formValue.registrationDate.start._d).format('MM/DD/YYYY');
        toRegistrationDate = moment(formValue.registrationDate.end._d).format('MM/DD/YYYY');
      }
      queryParams = queryParams + 'fromRegistrationDate=' + fromRegistrationDate + '&' + 'toRegistrationDate='
        + toRegistrationDate + '&' + 'registrationDate=' + fromRegistrationDate + '-' + toRegistrationDate + '&';

    }

    if (formValue.updatedDate && formValue.updatedDate.start !== null) {
      let fromUpdatedDate;
      let toUpdatedDate;
      if (!formValue.updatedDate.start && formValue.updatedDate.indexOf('-')) {
        const splitData = formValue.updatedDate.split('-');
        fromUpdatedDate = splitData[0];
        toUpdatedDate = splitData[1];
      }
      else {
        fromUpdatedDate = moment(formValue.updatedDate.start._d).format('MM/DD/YYYY');
        toUpdatedDate = moment(formValue.updatedDate.end._d).format('MM/DD/YYYY');
      }
      queryParams = queryParams + 'fromUpdatedDate=' + fromUpdatedDate + '&' + 'toUpdatedDate='
        + toUpdatedDate + '&' + 'updatedDate=' + fromUpdatedDate + '-' + toUpdatedDate + '&';
    }

    if (formValue.invitationDate && formValue.invitationDate.start !== null) {
      // const fromInvitationDate = moment(formValue.invitationDate.start._d).format('MM/DD/YYYY');
      // const toInvitationDate = moment(formValue.invitationDate.end._d).format('MM/DD/YYYY');
      // queryParams = queryParams + 'fromInvitationDate=' + fromInvitationDate + '&' + 'toInvitationDate=' + toInvitationDate + '&';

      let fromInvitationDate;
      let toInvitationDate;
      if (!formValue.invitationDate.start && formValue.invitationDate.indexOf('-')) {
        const splitData = formValue.invitationDate.split('-');
        fromInvitationDate = splitData[0];
        toInvitationDate = splitData[1];
      }
      else {
        fromInvitationDate = moment(formValue.invitationDate.start._d).format('MM/DD/YYYY');
        toInvitationDate = moment(formValue.invitationDate.end._d).format('MM/DD/YYYY');
      }
      queryParams = queryParams + 'fromInvitationDate=' + fromInvitationDate + '&' + 'toInvitationDate='
        + toInvitationDate + '&' + 'invitationDate=' + fromInvitationDate + '-' + toInvitationDate + '&';
    }

    if (formValue.firstLoginDate && formValue.firstLoginDate.start !== null) {
      // const fromFirstLogin = moment(formValue.firstLoginDate.start._d).format('MM/DD/YYYY');
      // const toFirstLogin = moment(formValue.firstLoginDate.end._d).format('MM/DD/YYYY');
      // queryParams = queryParams + 'fromFirstLogin=' + fromFirstLogin + '&' + 'toFirstLogin=' + toFirstLogin + '&';
      let fromFirstLogin;
      let toFirstLogin;
      if (!formValue.firstLoginDate.start && formValue.firstLoginDate.indexOf('-')) {
        const splitData = formValue.firstLoginDate.split('-');
        fromFirstLogin = splitData[0];
        toFirstLogin = splitData[1];
      }
      else {
        fromFirstLogin = moment(formValue.firstLoginDate.start._d).format('MM/DD/YYYY');
        toFirstLogin = moment(formValue.firstLoginDate.end._d).format('MM/DD/YYYY');
      }
      queryParams = queryParams + 'fromFirstLogin=' + fromFirstLogin + '&' + 'toFirstLogin='
        + toFirstLogin + '&' + 'firstLoginDate=' + fromFirstLogin + '-' + toFirstLogin + '&';
    }

    if (formValue.lastLoginDate && formValue.lastLoginDate.start !== null) {
      // const fromLastLogin = moment(formValue.lastLoginDate.start._d).format('MM/DD/YYYY');
      // const toLastLogin = moment(formValue.lastLoginDate.end._d).format('MM/DD/YYYY');
      // queryParams = queryParams + 'fromLastLogin=' + fromLastLogin + '&' + 'toLastLogin=' + toLastLogin + '&';

      let fromLastLogin;
      let toLastLogin;
      if (!formValue.lastLoginDate.start && formValue.lastLoginDate.indexOf('-')) {
        const splitData = formValue.lastLoginDate.split('-');
        fromLastLogin = splitData[0];
        toLastLogin = splitData[1];
      }
      else {
        fromLastLogin = moment(formValue.lastLoginDate.start._d).format('MM/DD/YYYY');
        toLastLogin = moment(formValue.lastLoginDate.end._d).format('MM/DD/YYYY');
      }
      queryParams = queryParams + 'fromLastLogin=' + fromLastLogin + '&' + 'toLastLogin='
        + toLastLogin + '&' + 'lastLoginDate=' + fromLastLogin + '-' + toLastLogin + '&';
    }

    if (formValue.equipmentId && formValue.equipmentId !== '') {
      queryParams = queryParams + 'equipmentId=' + formValue.equipmentId + '&';
    }

    if (queryParams && queryParams.length > 1) {
      const lastchar = queryParams.charAt(queryParams.length - 1);
      // Remove & from last character
      if (lastchar === '&') { queryParams = queryParams.substring(0, queryParams.length - 1); }
      this.selectedQueryParams = queryParams;
      // convert queryparams to object to store it in url as queryparam
      const convertQuery = JSON.parse('{"' + decodeURI(queryParams.substring(0).replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}')
      this.methodToChangQueryParams(convertQuery);
      this.filterActivated = true;
      if(!this.userId){
        this.getUserAPICall();
      }
      else
      this.getDriverList();
    }
  }

  methodToChangQueryParams(query:any) {
    this.route.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: query
      });
  }

  onTableScroll(e:any) {
    const tableViewHeight = e.target.offsetHeight // viewport
    const tableScrollHeight = e.target.scrollHeight // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled    
    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 300;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation > limit && !this.apiCallInProcess && this.totalRecords > this.driverList.length) {
      this.page = this.page + 1;
      this.getDriverList(true);
    }
  }

  reset() {
    this.page = 1;
    this.filterActivated = false;
    this.filterForm.reset();
    if (this.selectedQueryParams && this.selectedQueryParams.length > 1) {
      this.selectedQueryParams = '';
    }
    this.methodToChangQueryParams(this.selectedQueryParams)
    this.getDriverList();
  }

  applyFilter() {
    this.page = 1;
    const formValue = this.searchForm.value;
    let queryParams = '';
    if (formValue.searchInput && formValue.searchInput.length) {
      queryParams = queryParams + 'search=' + formValue.searchInput;
    }
    if (formValue.searchInput == '') {
      this.selectedQueryParams = '';
      this.getDriverList();
    }
    this.selectedQueryParams = queryParams;
    if (this.selectedQueryParams && this.selectedQueryParams.length > 1) {
      this.getDriverList();
    }
  }

  clearPickupLocation(event:any) {
    if (event) {
      this.newLatitude = null;
      this.newLongitude = null;
    }
  }

  pickUpAutocomplete($event: GermanAddress) {
    console.log('event fired', $event)
    if ($event.geoLocation || $event.state) {
      this.location = $event.displayAddress;
      this.newLatitude = $event.geoLocation.latitude;
      this.newLongitude = $event.geoLocation.longitude;
    }
  }

  codeAddress(locationLat:any, locationLong:any, index:any) {
    let selatlong = { lat: locationLat, lng: locationLong };
    let _self = this;
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      this.geoCoder.geocode({ 'location': selatlong }, function (results:any, status:any) {
        if (status == google.maps.GeocoderStatus.OK) {
          let newname = "";
          if (results[0].address_components[3] != undefined) {
            newname = results[0].address_components[3].long_name;
          } else {
            newname = "";
          }
          _self.driverList[index]['shortAddress'] = results[0].address_components[2].long_name + ' , ' + newname;
          _self.driverList[index]['fullAddress'] = results[0].formatted_address;
          _self.locationLoader = false;
          _self.cd.detectChanges();
        }
        else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          setTimeout(() => {
            return _self.codeAddress(locationLat, locationLong, index);
            _self.cd.detectChanges();
          }, 500);
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    });
  }


  clickLocation(element:any,index:any){
    this.locationLoader = true;
    this.locationStatus[index] = !this.locationStatus[index];
    if (element.pickupLocationLat && element.pickupLocationLong) {
          this.codeAddress(element.pickupLocationLat, element.pickupLocationLong, index);
        }
    else{
      this.locationLoader = false;
      this.driverList[index]['shortAddress'] = 'No Address Available';
    }
  }

  redirectToDriverView(element:any){
      this.route.navigate(['driver/view/', element.userId, 'details']);
  }

  tabClicked(tabType:any){
    this.selectedTab = tabType.key;
    this.filterForm.controls['tabType'].setValue(tabType.key);
    this.updateFilterList();
  }

  emitUserNameToParentComponent(userName:any){
    this.outputUserName.emit(userName);
  }

}
