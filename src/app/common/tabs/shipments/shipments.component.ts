import { Component, OnInit, ViewChild,Input,Output,EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as moment from "moment";
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import * as APIURL from '../../config/api-endpoints';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { sharedService } from '../../../common/services/shared.service';
import * as FILTERS from '../../../common/config/filters-datalist';
import { GermanAddress } from '@angular-material-extensions/google-maps-autocomplete';
import { MapsAPILoader } from '@agm/core';
import { Appearance} from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import { getQueryPredicate } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.css']
})
export class ShipmentsComponent implements OnInit {
  status: boolean = false;
  tableCols = {
    carrier: ['name', 'shipperName', 'driverName', 'pickupLocation', 'dropoffLocation', 'status'],
    driver: ['name', 'shipperName', 'equipmentType', 'pickupLocation', 'dropoffLocation', 'status'],
    shipment: ['name', 'shipperName', 'carrierName', 'driverName', 'pickupLocation', 'dropoffLocation', 'status'],
    shipper: ['name', 'carrierName', 'driverName', 'pickupLocation', 'dropoffLocation', 'status']
  };
	displayedColumns :any = [];
  dataSource : any;
  carrierId:any;
  public filterForm!: FormGroup;
  shipmentList: any;
  tabCountData: any;
  totalRecords: any;
  equipmentTypes: any;
  todayDate = moment();
  filterActivated: boolean=false;
  public selectedQueryParams:any='';
  page:number = 1;
  limit:number = 20;
  public apiCallInProcess:any;
  public showLoader : any=false;
  public userName:any = '';
  driverId:any;
  driverList:any = [];
  public searchForm!: FormGroup;
  tabType = 'availableToBid';
  statusClass = 'txt_p';
  selectedTab:any;
  public geoCode:any;
  public geoCoder:any;
  public shipmentTabTypes:any = [];
  public pickupLatitude:any;
  public pickupLongitude:any;
  public dropOffLatitude:any;
  public dropOffLongitude:any;
  shipmentStatus:any = [];
  carriersName:any = [];
  shipperId:any;
  public pickUpLocation:any ;
  public dropOffLocation:any;
  @Input() moduleName :any;
  @Output() outputUserName = new EventEmitter<string>();
  bgStatusClass:any
  userId:any;
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
              private httpService: HttpService,
              private route:Router,
              private fb: FormBuilder,
              private sharedService: sharedService,
              private mapsAPILoader: MapsAPILoader,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCarrierList();
    localStorage.removeItem('shipmentNameUniqueId');
    localStorage.removeItem('shipmentStatusLabel');
    localStorage.removeItem('shipmentStatusCount');
    localStorage.removeItem('shipmentId');
    localStorage.removeItem('shipmentDriverId');
    localStorage.removeItem('shipmentShipperId');

    
    
    this.equipmentTypes = FILTERS.carrierFilters.shipmentEquipmentTypes;
    this.shipmentTabTypes = FILTERS.carrierFilters.shipmentTabTypes;
    if(FILTERS.carrierFilters.shipmentStatus[this.tabType]){
       this.shipmentStatus = FILTERS.carrierFilters.shipmentStatus[this.tabType]['statuses'];
       this.statusClass =  FILTERS.carrierFilters.shipmentStatus[this.tabType]['className'];
    }
    const mName = this.moduleName;
    this.displayedColumns = this.tableCols[mName] ? this.tableCols[mName] : '-';
    if(this.moduleName == 'carrier'){
      this.shipmentTabTypes = this.shipmentTabTypes.slice(0,this.shipmentTabTypes.length-1);
      this.getDriverList();
      this.userName = localStorage.getItem('carrierName');

      this.activatedRoute.params.subscribe(params => {
          this.carrierId = params.carrierId;
      });
    }

    if(this.moduleName == 'driver'){
      this.shipmentTabTypes = this.shipmentTabTypes.slice(0,4);
      this.userName = localStorage.getItem('driverName');
      this.activatedRoute.params.subscribe(params => {
          this.driverId = params.driverId;
      });
    }

    if(this.moduleName == 'shipper'){
      let shipmentTabs = this.shipmentTabTypes;
      this.shipmentTabTypes = (shipmentTabs.slice(0,4)).concat(shipmentTabs.slice(7,shipmentTabs.length));
      this.userName = localStorage.getItem('shipperName');
      this.activatedRoute.params.subscribe(params => {
          this.shipperId = params.shipperId;
      });
    }
    
    this.setFormControls();

    this.filterForm.get('tabType').valueChanges.subscribe(val => {
    if(val !== '') {
      this.tabType = val;
      if(FILTERS.carrierFilters.shipmentStatus[this.tabType]){
        this.shipmentStatus = FILTERS.carrierFilters.shipmentStatus[this.tabType]['statuses'];
        this.statusClass =  FILTERS.carrierFilters.shipmentStatus[this.tabType]['className'];
        this.bgStatusClass =  FILTERS.carrierFilters.shipmentStatus[this.tabType]['bgClassName'];
        
      }
    }
  });

    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params && Object.keys(params).length > 0) {
          this.sharedService.setFormControlBasedOnQueryParams(params, this.filterForm);
          this.selectedTab = this.filterForm.controls.tabType.value;
          this.updateFilterList();
        }
        else {
          if(this.filterForm){
            this.filterForm.reset();
            if(this.selectedQueryParams && this.selectedQueryParams.length>1){
              this.selectedQueryParams = '';
            }
            this.tabType = 'availableToBid';
            this.selectedTab='Available To Bid';
            this.filterForm.controls.tabType.setValue(this.tabType);
            this.updateFilterList();
            this.filterActivated = false;
          }
          this.getUserAPICall();
        }
      });


  }

  getCarrierList()
  {
    let url = APIURL.envConfig.CARRIERENDPOINTS.getcarrierList;
    this.httpService.get(url).subscribe(resp => {
      const responseList = (resp['success'])

      this.carriersName=resp['response']['allCarrier'];
    })
  }

  setFormControls() {
    this.filterForm = this.fb.group({
      title:[],
      pickupCity:[],
      dropCity:[],
      equipmentHeight:[],
      equipmentWidth: [],
      equipmentWeight:[],
      pickupZipCode:[],
      dropZipcode:[],
      batchId:[],
      pickUpLocation:[],
      dropOffLocation:[],
      driverId:[],
      shipperId:[],
      status:[],
      equipmentType:[],
      tabType:[],
      pickUpDate:[],
      dropOffDate:[],
      carrierName:[],
    });

    this.searchForm = this.fb.group({
      searchInput: [''],
    });

    // this.updateFilterList();
  }

  getUserAPICall(){
    let isApiCallRequired:boolean = false;
    if(this.moduleName == 'carrier'){
      this.userId = localStorage.getItem('userId');
      if(!this.userId || localStorage.getItem('carrierId')!=this.carrierId){
        isApiCallRequired = true;
        this.sharedService.getUserIdAndName(this.carrierId).subscribe(resp=>{
          const carrierProfile = resp['response'];
          this.userId = carrierProfile['userId'];
          this.userName = carrierProfile['legalName'];
          this.getShipmentList();
        });        
      }     
    }
    if(this.moduleName == 'driver'){
      this.userId = this.driverId;
      if(!this.userId || localStorage.getItem('driverId')!=this.driverId){
        isApiCallRequired = true;
        this.sharedService.getDriverUserIdAndName(this.driverId).subscribe(resp => {
          const driverProfile = resp['response']; 
          this.userId = driverProfile['userId'];
          this.userName = driverProfile['name'];
          this.getShipmentList();
        });
        
      }
    }

    if(this.moduleName == 'shipper'){
      this.userId = localStorage.getItem('shipperUserId');
     if(!this.userId || localStorage.getItem('shipperId')!=this.shipperId){
        isApiCallRequired = true;
       this.sharedService.getShipperIdAndName(this.shipperId).subscribe(resp=>{
         const shipperProfile = resp['response'];
         this.userId = shipperProfile['userId'];
         this.userName = shipperProfile['companyName'];
         this.getShipmentList();
       });        
     }     
   }

   if(!isApiCallRequired){
    this.getShipmentList();
  }

  }

  getShipmentList(isPaginated?:any) {
    if (isPaginated) {
      this.apiCallInProcess = true;
    } else{
      this.showLoader = true;
    }

    this.emitUserNameToParentComponent(this.userName);

    let pagination = '?limit=' + this.limit + '&page=' + this.page;
    if(this.moduleName != 'shipment'){
      pagination = pagination +'&userRole='+ this.moduleName.toUpperCase() + '&'+this.moduleName+'Id=' + this.userId; //  //=1660
    }
   
    const appender = '&';
    let queryParams = '';
    if (this.selectedQueryParams.length) {
      queryParams = this.selectedQueryParams;
      queryParams = pagination + appender + queryParams;
    }
    const url = queryParams ? APIURL.envConfig.CARRIERENDPOINTS.getShipmentList + queryParams :
     APIURL.envConfig.CARRIERENDPOINTS.getShipmentList + pagination;
    this.httpService.get(url).subscribe(resp => {
      this.status = false;
      this.showLoader = false;
      this.apiCallInProcess = false;
      const responseList = (resp['success'] && resp['response']['shipments'].length) ? resp['response']['shipments'] : [];
      if (responseList.length) {
        this.shipmentList = isPaginated ? this.shipmentList.concat(responseList) : responseList;
      } else {
        this.shipmentList = [];
      }
      if(resp['success']){
        this.tabCountData = resp['response']['tabCount'];
        this.shipmentTabTypes.forEach(element => {
            element['count'] = this.tabCountData[element.key] ? this.tabCountData[element.key] : 0;
        });
        this.totalRecords = resp['response']['totalShipment'];
      }
    }, (err) => {
      this.showLoader = false;
      this.apiCallInProcess = false;
      const errorMsg = 'Error - ' + err.message;
      // this.openMessagePopup(errorMsg);
    });
  }

  getDriverList() {
    const url = APIURL.envConfig.CARRIERENDPOINTS.getDriverList +'?limit=1000';
    this.httpService.get(url).subscribe(resp => {
      this.showLoader = false;
      const responseList = (resp['success'] && resp['response']['allDrivers'].length) ? resp['response']['allDrivers'] : [];
      if (responseList.length) {
        this.driverList = responseList;
      } else {
        this.driverList = [];
      }
    }, (err) => {
      this.showLoader = false;
      const errorMsg = 'Error - ' + err.message;
      // this.openMessagePopup(errorMsg);
    });
  }

  getInitials(name:any) {
    return this.sharedService.getInitials(name);
  }

  updateFilterList(){
    this.page = 1;
    const formValue = this.filterForm.value;
    let queryParams = '';

    if (formValue.title) {
      queryParams = queryParams + 'title=' + formValue.title + '&';
    }


    if (formValue.pickupCity) {
      queryParams = queryParams + 'pickupCity=' + formValue.pickupCity + '&';
    }

    if (formValue.dropCity) {
      queryParams = queryParams + 'dropCity=' + formValue.dropCity + '&';
    }

    if (formValue.equipmentHeight) {
      queryParams = queryParams + 'equipmentHeight=' + formValue.equipmentHeight + '&';
    }

    if (formValue.equipmentWidth) {
      queryParams = queryParams + 'equipmentWidth=' + formValue.equipmentWidth + '&';
    }

    if (formValue.equipmentWeight) {
      queryParams = queryParams + 'equipmentWeight=' + formValue.equipmentWeight + '&';
    }

    if (formValue.pickupZipCode) {
      queryParams = queryParams + 'pickupZipCode=' + formValue.pickupZipCode + '&';
    }

    if (formValue.dropZipcode) {
      queryParams = queryParams + 'dropZipcode=' + formValue.dropZipcode + '&';
    }

    if (formValue.batchId) {
      queryParams = queryParams + 'batchId=' + formValue.batchId + '&';
    }

    if (formValue.pickUpLocation) {
      if (this.pickupLatitude != null && this.pickupLongitude != null){
        queryParams = queryParams + 'pickupLatitude=' + this.pickupLatitude + '&' + 'pickupLongitude='
         + this.pickupLongitude + '&' + 'pickUpLocation=' + this.pickUpLocation + '&';
      }
    }

    if (formValue.dropOffLocation) {
      if (this.dropOffLatitude != null && this.dropOffLongitude != null){
        queryParams = queryParams + 'dropLatitude=' + this.dropOffLatitude + '&' + 'dropLongitude='
         + this.dropOffLongitude + '&' + 'dropOffLocation=' + this.dropOffLocation + '&';
      }
    }

    if (formValue.driverId) {
      queryParams = queryParams + 'driverId=' + formValue.driverId + '&';
    }

    if (formValue.shipperId) {
      queryParams = queryParams + 'shipperId=' + formValue.shipperId + '&';
    }

    if (formValue.status) {
      queryParams = queryParams + 'status=' + formValue.status + '&';
    }

    if (formValue.carrierName) {
      queryParams = queryParams + 'carrierName=' + formValue.carrierName + '&';
    }

    if (formValue.equipmentType) {
      queryParams = queryParams + 'equipmentType=' + formValue.equipmentType + '&';
    }

    if (formValue.tabType) {
      queryParams = queryParams + 'tabType=' + formValue.tabType + '&';
    }

    if (formValue.pickUpDate && formValue.pickUpDate.start !== null) {
      let frompickUpDate;
      let topickUpDate;
      if(!formValue.pickUpDate.start && formValue.pickUpDate.indexOf('-')){
        const splitData = formValue.pickUpDate.split('-');
        frompickUpDate = splitData[0];
        topickUpDate = splitData[1];
      } else {
        frompickUpDate = moment(formValue.pickUpDate.start._d).format('MM/DD/YYYY');
        topickUpDate = moment(formValue.pickUpDate.end._d).format('MM/DD/YYYY');
      }
      queryParams = queryParams + 'pickupFrom=' + frompickUpDate + '&' + 'pickupTo=' + topickUpDate
       + '&' + 'pickUpDate=' + frompickUpDate + '-' + topickUpDate + '&';
    }

    if (formValue.dropOffDate && formValue.dropOffDate.start !== null) {
      let fromdropOffDate;
      let todropOffDate;
      if(!formValue.dropOffDate.start && formValue.dropOffDate.indexOf('-')){
        const splitData = formValue.dropOffDate.split('-');
        fromdropOffDate = splitData[0];
        todropOffDate = splitData[1];
      } else {
        fromdropOffDate = moment(formValue.dropOffDate.start._d).format('MM/DD/YYYY');
        todropOffDate = moment(formValue.dropOffDate.end._d).format('MM/DD/YYYY');
      }
      queryParams = queryParams + 'dropFrom=' + fromdropOffDate + '&' + 'dropTo=' + todropOffDate +
       '&'+ 'dropOffDate=' + fromdropOffDate + '-' + todropOffDate + '&';
    }

    if(queryParams && queryParams.length>1){
      const lastchar = queryParams.charAt(queryParams.length - 1);
      // Remove & from last character
      if (lastchar === '&') {queryParams = queryParams.substring(0, queryParams.length - 1); }
      this.selectedQueryParams = queryParams;
      // convert queryparams to object to store it in url as queryparam
      const convertQuery = JSON.parse('{"' + decodeURI(queryParams.substring(0).replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}')
      this.methodToChangQueryParams(convertQuery);
      if(Object.keys(convertQuery).length === 1)
      this.filterActivated = false;
      else if(Object.keys(convertQuery).length >= 1)
      this.filterActivated=true
    }
    else 
    {
          this.methodToChangQueryParams(null);
    }
    if(!this.userId){
      this.getUserAPICall();
    }
    else
    this.getShipmentList();
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
    if (scrollLocation > limit && !this.apiCallInProcess && this.totalRecords > this.shipmentList.length) {
      this.page = this.page + 1;
      this.getShipmentList(true);
    }
  }

  reset(){
    this.page = 1;
    this.filterActivated = false;
    this.filterForm.reset();
    if(this.selectedQueryParams && this.selectedQueryParams.length>1){
      this.selectedQueryParams = '';
      this.updateFilterList();
    }

    this.tabType = 'inProgress';
    this.selectedTab='In-Transit';
    this.filterForm.controls.tabType.setValue(this.tabType);
    this.updateFilterList();
    // this.methodToChangQueryParams(this.selectedQueryParams)
    // this.getShipmentList();
  }

  applyFilter() {
    this.page = 1;
    const formValue = this.searchForm.value;
    let queryParams = '';
    if (formValue.searchInput && formValue.searchInput.length) {
      queryParams = queryParams + 'title=' + formValue.searchInput;
    }
    if(formValue.searchInput == ''){
      this.selectedQueryParams = '';
      this.getShipmentList();
    }
    this.selectedQueryParams = queryParams;
    if(this.selectedQueryParams && this.selectedQueryParams.length>1){
        this.getShipmentList();
    }
  }

clearPickupLocation(event:any){
  if(event){
    this.pickupLatitude = null;
    this.pickupLongitude = null;
  }
}
​
pickUpAutocomplete($event: GermanAddress) {
  if($event.geoLocation || $event.state){
    this.pickUpLocation = $event.displayAddress;
    this.pickupLatitude = $event.geoLocation.latitude;
    this.pickupLongitude = $event.geoLocation.longitude;
    }
}

clearDropLocation(event:any){
  if(event){
    this.dropOffLatitude = null;
    this.dropOffLongitude = null;
  }
}
​
dropOffAutocomplete($event: GermanAddress) {
  if($event.geoLocation || $event.state){
    this.dropOffLocation = $event.displayAddress;
    this.dropOffLatitude = $event.geoLocation.latitude;
    this.dropOffLongitude = $event.geoLocation.longitude;
    }
}

emitUserNameToParentComponent(userName:any){
  this.outputUserName.emit(userName);
}

redirectToShipmentView(element:any){
  localStorage.setItem('shipmentId',element.id);
  this.route.navigate(['shipment/view/', element.id, 'details']);
}

tabClicked(tabType:any){
  this.selectedTab = tabType.key;
  this.filterForm.controls.tabType.setValue(tabType.key);
  this.updateFilterList();
}
}
