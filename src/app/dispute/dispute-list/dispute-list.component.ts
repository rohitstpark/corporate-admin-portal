import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpService } from '../../common/services/http.service';
import * as APIURL from '../../common/config/api-endpoints';
import * as FILTERS from '../../common/config/filters-datalist';
import * as moment from "moment";
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { sharedService } from '../../common/services/shared.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-dispute-list',
  templateUrl: './dispute-list.component.html',
  styleUrls: ['./dispute-list.component.css']
})
export class DisputeListComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  status:any;
  filterActivated:boolean=false;
  dataSource:any = [];
  apiCallInProcess:boolean=false;
  page:number = 1;
  limit:number=20;
  totalRecords:any;
  showLoader:boolean=false;
  displayedColumns = ['shipmentId', 'shipmentName', 'carrierName','shipperName', 'assigneName',  'reason', 'description', 'dateTime'];
  disputeStatus:any=[];
  disputeReasons:any=[];
  selectedTab:any = 1;
  selectedDispute:any;
  tabCountData:any;
  filterForm: FormGroup;
  todayDate = moment();
  @ViewChild(DaterangepickerDirective, { static: false }) pickerDirective: DaterangepickerDirective;
    ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }

  selectedQueryParams: String = '';
  carrierList:any=[];
  shipperList:any=[];
  driverList:any=[];
  shipmentList:any=[];
  assigneeList:any=[];

  isCarrierLoader:boolean=false;
  isDriverLoader:boolean=false;
  isShipperLoader:boolean=false;
  isShipmentLoader:boolean=false;
  isAssignLoader:boolean=false;

  constructor( private httpService: HttpService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private sharedService: sharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.showLoader=true;
    this.disputeStatus = FILTERS.carrierFilters.disputeStatus;
    this.disputeReasons = FILTERS.carrierFilters.disputeReasons;
    this.selectedTab = 1;    
    this.selectedDispute='New';
    this.setFormControls();
    
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params && Object.keys(params).length > 0) {
          this.sharedService.setFormControlBasedOnQueryParams(params, this.filterForm);
          if(this.filterForm.value.disputeStatus){
            const foundStatus = this.disputeStatus.find(element => element.value ==  this.filterForm.value.disputeStatus);
            this.selectedTab = foundStatus.value;    
            this.selectedDispute= foundStatus.key;
          }
          if(this.filterForm.value.carrierName){
            this.getCarrierList(this.filterForm.value.carrierName,true); 
          }
          if(this.filterForm.value.driverName){
            this.getDriverList(this.filterForm.value.driverName,true); 
          }
          if(this.filterForm.value.shipperName){
            this.getShipperList(this.filterForm.value.shipperName, true);
          }
          if(this.filterForm.value.shipmentName){
            this.getShipmentList(this.filterForm.value.shipmentName,true); 
          }
          if(this.filterForm.value.assigneeName){
            this.getAssigneeList(this.filterForm.value.assigneeName,true); 
          }
          this.updateSearchResults();
        } else {
          if(this.filterForm){
            this.filterForm.reset();
            if(this.selectedQueryParams && this.selectedQueryParams.length>1){
              this.selectedQueryParams = '';
            }
            this.filterActivated = false;
          }
          this.tabClicked(this.disputeStatus[0])
        }
      });

      this.filterForm.get('carrier').valueChanges.subscribe(val => {
       if(val && val.length>1){
          this.isCarrierLoader = true;
          this.getCarrierList(val);        
        }
      })
      this.filterForm.get('driver').valueChanges.subscribe(val => {
        if(val && val.length>1){
        this.isDriverLoader = true;
        this.getDriverList(val);  
        }      
      })
      this.filterForm.get('shipper').valueChanges.subscribe(val => {
        if(val && val.length>1){
        this.isShipperLoader = true;
        this.getShipperList(val);  
        }      
      })
      this.filterForm.get('shipment').valueChanges.subscribe(val => {
        if(val && val.length>1){
        this.isShipmentLoader = true;
        this.getShipmentList(val);  
        }      
      })

      this.filterForm.get('disputeAssigned').valueChanges.subscribe(val => {
        if(val != undefined && val && val.length>1){
        this.isAssignLoader = true;
        this.getAssigneeList(val);  
        }      
      })

  }

  setFormControls() {
    this.filterForm = this.fb.group({
      createdDate:[],
      updatedDate:[],
      carrier:[],
      shipper:[],
      driver:[],
      shipment:[],
      carrierId:[],
      shipperId:[],
      driverId:[],
      carrierName:[],
      shipperName:[],
      driverName:[],
      shipmentId:[],
      shipmentName:[],
      disputeReason:[],
      search:[],
      disputeStatus:[],
      disputeAssigned:[],
      assigneeName:[],
      adminUserId:[]
    });
  
    }

  getDisputeListData(isPaginated?) {
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
    let apiUrl = APIURL.envConfig.DISPUTEENDPOINTS.getdisputeList;
    const url = queryParams ? (apiUrl + queryParams) : apiUrl + pagination;
    this.httpService.get(url).subscribe(resp => {
      this.status = false;
      this.showLoader = false;
      this.apiCallInProcess = false;
      const responseList = (resp['success'] && resp['response']['allShipments'].length) ? resp['response']['allShipments'] : [];
      if (responseList.length) {
        responseList.forEach(element => {
          element.disCreatedAt = element.disCreatedAt ? new Date(element.disCreatedAt +' '+'UTC') : null;
         });
        this.dataSource = isPaginated ? this.dataSource.concat(responseList) : responseList;
      } else {
        this.dataSource = [];
      }
      if(resp['success']){
        this.totalRecords = resp['response']['totalRecords'];

        this.tabCountData = resp['response']['tabCount'];
        this.disputeStatus.forEach(element => {
            element['count'] = this.tabCountData[element.check] ? this.tabCountData[element.check] : 0;
        });
      }
      else{
        this.sharedService.openMessagePopup('Error - ' +resp['message']);
      }
    }, (err) => {
      console.log('err', err)
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
      this.getDisputeListData(true);
    }
  }

  filterToggleEvent() {
    this.status = !this.status;
  }

  tabClicked(tabType){
    this.selectedTab = tabType.value;
    this.selectedDispute = tabType.key;
    // this.getDisputeListData();
    this.filterForm.controls.disputeStatus.setValue(tabType.value);
    this.updateSearchResults();
  }

  redirectToDisputeView(element){
    this.router.navigate(['dispute/view/',element.id,'details']);
  }
  redirectToCarrierView(element){
    this.router.navigate(['carrier/view/',element.carrierPkId,'details']);
  }
  redirectToShipmentView(element){
    this.router.navigate(['shipment/view/',element.id,'details']);
  }

  redirectToShipperView(element){
    this.router.navigate(['shipper/view/',element.shipperPkId,'details']);
  }

  updateSearchResults() {
    this.page = 1;
    const formValue = this.filterForm.value;
    let queryParams = '';

    if (formValue.createdDate && formValue.createdDate.start !== null) {
      let fromCreatedDate;
      let toCreatedDate;
      if(!formValue.createdDate.start && formValue.createdDate.indexOf('-')){
        const splitData = formValue.createdDate.split('-')
        fromCreatedDate = splitData[0];
        toCreatedDate = splitData[1];
      }
      else{
        fromCreatedDate = moment(formValue.createdDate.start._d).format('MM/DD/YYYY');
        toCreatedDate = moment(formValue.createdDate.end._d).format('MM/DD/YYYY');
      }
      queryParams = queryParams + 'fromCreatedDate=' + fromCreatedDate + '&' + 'toCreatedDate=' + toCreatedDate +
       '&' + 'createdDate=' + fromCreatedDate + '-' + toCreatedDate + '&';
    }

    if (formValue.updatedDate && formValue.updatedDate.start !== null) {
      let fromUpdatedDate;
      let toUpdatedDate;
      if(!formValue.updatedDate.start && formValue.updatedDate.indexOf('-')){
        const splitData = formValue.updatedDate.split('-')
        fromUpdatedDate = splitData[0];
        toUpdatedDate = splitData[1];
      }
      else{
        fromUpdatedDate = moment(formValue.updatedDate.start._d).format('MM/DD/YYYY');
        toUpdatedDate = moment(formValue.updatedDate.end._d).format('MM/DD/YYYY');
      }
      queryParams = queryParams + 'fromUpdatedDate=' + fromUpdatedDate + '&' + 'toUpdatedDate=' + toUpdatedDate +
       '&' + 'updatedDate=' + fromUpdatedDate + '-' + toUpdatedDate + '&';
    }
    if (formValue.carrier && formValue.carrier !== '') {
      let carrierObj = formValue.carrier;
      queryParams = queryParams + 'carrierId=' + carrierObj.carrierUserId + '&' + 'carrierName=' + carrierObj.legalName + '&';
    }
    else{
      if(formValue.carrierId){
        queryParams = queryParams + 'carrierId=' + formValue.carrierId + '&' + 'carrierName=' + formValue.carrierName + '&';
      }
    }

    if (formValue.driver && formValue.driver !== '') {
      let driverObj = formValue.driver;
      queryParams = queryParams + 'driverId=' + driverObj.driverUserId + '&' + 'driverName=' + driverObj.driverName + '&';
    }
    else{
      if(formValue.driverId){
        queryParams = queryParams + 'driverId=' + formValue.driverId + '&' + 'driverName=' + formValue.driverName + '&';
      }
    }

    if (formValue.shipper && formValue.shipper !== '') {
      let shipperObj = formValue.shipper;
      queryParams = queryParams + 'shipperId=' + shipperObj.shipperUserId + '&' + 'shipperName=' + shipperObj.companyName + '&';
    }
    else{
      if(formValue.shipperId){
        queryParams = queryParams + 'shipperId=' + formValue.shipperId + '&' + 'shipperName=' + formValue.shipperName + '&';
      }
    }

    if (formValue.shipment && formValue.shipment !== '') {
      let shipmentObj = formValue.shipment;
      queryParams = queryParams + 'shipmentId=' + shipmentObj.shipmentId + '&' + 'shipmentName=' + shipmentObj.title + '&';
    }
    else{
      if(formValue.shipmentId){
        queryParams = queryParams + 'shipmentId=' + formValue.shipmentId + '&' + 'shipmentName=' + formValue.shipmentName + '&';
      }
    }

    if (formValue.disputeAssigned && formValue.disputeAssigned !== '') {
      let disputeAssignObj = formValue.disputeAssigned; //firstName
      queryParams = queryParams + 'adminUserId=' + disputeAssignObj.adminUserId + '&'+ 'assigneeName=' + disputeAssignObj.firstName + '&';
    }
    else{
      if(formValue.adminUserId){
        queryParams = queryParams + 'adminUserId=' + formValue.adminUserId + '&' + 'shipmentName=' + formValue.assigneeName + '&';
      }
    }

    if (formValue.disputeReason && formValue.disputeReason !== '') {
      queryParams = queryParams + 'disputeReason=' + formValue.disputeReason + '&';
    }
    if (formValue.disputeStatus && formValue.disputeStatus !== '') {
      queryParams = queryParams + 'disputeStatus=' + formValue.disputeStatus + '&';
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
      this.getDisputeListData();
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

  getCarrierList(val, setValue?){
    const url = APIURL.envConfig.DISPUTEENDPOINTS.getUser + '?userRole=CARRIER&isRegistered=1&search='+val;
    this.httpService.get(url).subscribe(resp => {
      this.isCarrierLoader=false;
      if(resp['response'] && resp['success']){
        this.showLoader = false;
        this.carrierList = resp['response'];
        if(setValue)
        this.filterForm.controls.carrier.setValue(this.carrierList[0]);
      }
      else{
        this.sharedService.openMessagePopup('Error - ' +resp['message']);
      }
    }, (err) => {
      this.isCarrierLoader=false;
      console.log('err', err)
      this.sharedService.openMessagePopup('Error - ' +err['message']);
    });
  }

  getDriverList(val, setValue?){
    const url = APIURL.envConfig.DISPUTEENDPOINTS.getUser + '?userRole=DRIVER&search='+val;
    this.httpService.get(url).subscribe(resp => {
      this.isDriverLoader=false;
      if(resp['response'] && resp['success']){
        this.showLoader = false;
        this.driverList = resp['response'];
        if(setValue)
        this.filterForm.controls.driver.setValue(this.driverList[0]);
      }
      else{
        this.sharedService.openMessagePopup('Error - ' +resp['message']);
      }
    }, (err) => {
      this.isDriverLoader=false;
      console.log('err', err)
      this.sharedService.openMessagePopup('Error - ' +err['message']);
    });
  }

  getShipperList(val, setValue?){
    const url = APIURL.envConfig.DISPUTEENDPOINTS.getUser + '?userRole=SHIPPER&isRegistered=1&search='+val;
    this.httpService.get(url).subscribe(resp => {
      this.isShipperLoader=false;
      if(resp['response'] && resp['success']){
        this.showLoader = false;
        this.shipperList = resp['response'];
        if(setValue)
        this.filterForm.controls.shipper.setValue(this.shipperList[0]);
      }
      else{
        this.sharedService.openMessagePopup('Error - ' +resp['message']);
      }
    }, (err) => {
      this.isShipperLoader=false;
      console.log('err', err)
      this.sharedService.openMessagePopup('Error - ' +err['message']);
    });
  }

  getShipmentList(val, setValue?){
    const url = APIURL.envConfig.DISPUTEENDPOINTS.getUser + '?userRole=SHIPMENT&search='+val;
    this.httpService.get(url).subscribe(resp => {
      this.isShipmentLoader=false;
      if(resp['response'] && resp['success']){
        this.showLoader = false;
        this.shipmentList = resp['response'];
        if(setValue)
        this.filterForm.controls.shipment.setValue(this.shipmentList[0]);
      }
      else{
        this.sharedService.openMessagePopup('Error - ' +resp['message']);
      }
    }, (err) => {
      this.isShipmentLoader=false;
      console.log('err', err)
      this.sharedService.openMessagePopup('Error - ' +err['message']);
    });
  }

  getAssigneeList(val, setValue?){
    const url = APIURL.envConfig.DISPUTEENDPOINTS.getUser + '?userRole=ADMIN&search='+val;
    this.httpService.get(url).subscribe(resp => {
      this.isAssignLoader=false;
      if(resp['response'] && resp['success']){
        this.assigneeList = resp['response'];
        if(setValue)
        this.filterForm.controls.disputeAssigned.setValue(this.assigneeList[0]);
      }
      else{
        this.sharedService.openMessagePopup('Error - ' +resp['message']);
      }
    }, (err) => {
      this.isAssignLoader=false;
      console.log('err', err)
      this.sharedService.openMessagePopup('Error - ' +err['message']);
    });
  }

  displayFnCarrier(user): string {
    return user && user.legalName ? user.legalName : '';
  }

  displayFnShipper(user): string {
    return user && user.companyName ? user.companyName : '';
  }

  displayFnDriver(user): string {
    return user && user.driverName ? user.driverName : '';
  }

  displayFnShipment(user): string {
    return user && user.title ? user.title : '';
  }

  displayFnAssignee(user): string {
    return user && user.firstName && user.lastName ? (user.firstName + ' ' + user.lastName) : '';
  }

}
