import { Component, OnInit,Input,Output,EventEmitter, ViewChild } from '@angular/core';
import * as moment from "moment";
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import * as APIURL from '../../config/api-endpoints';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { sharedService } from '../../../common/services/shared.service';
import * as FILTERS from '../../../common/config/filters-datalist';
@Component({
  selector: 'app-connectins',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.css']
})
export class ConnectinsComponent implements OnInit {
  status: boolean = false;
  tableCols = {
    carrier: ['shipperName', 'equipmentType', 'loadInformation', 'dateTime', 'status'],
    shipper: ['carrierName', 'loadInformation', 'dateTime', 'status']
  };

	displayedColumns : any;
  dataSource : any;
  carrierId:any;
  filterForm: FormGroup;
  searchForm: FormGroup;
  connectionList: any;
  tabCountData: any;
  totalRecords: any;
  equipmentTypes: any;
  todayDate = moment();
  filterActivated: boolean=false;
  selectedQueryParams='';
  page:number = 1;
  limit:number = 20;
  apiCallInProcess;
  showLoader;
  carrierName:String='';
  revenueValidationFailed = false;
  shipperId:any;
  userName:any;
  @Input() moduleName ;
  @Output() outputUserName = new EventEmitter<string>();

	@ViewChild(DaterangepickerDirective, { static: false }) pickerDirective: DaterangepickerDirective;
  userId:any;
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
              private route:Router,
              private httpService: HttpService,
              private fb: FormBuilder,
              private sharedService: sharedService) { }

  ngOnInit() {
    this.equipmentTypes = FILTERS.carrierFilters.equipmentTypes;
    

   if(this.moduleName == 'carrier'){
    this.carrierName = localStorage.getItem('carrierName');
    this.activatedRoute.params.subscribe(params => {
      this.carrierId = params.carrierId;
      // this.getCarrierConnections();
   });
  }

  if(this.moduleName == 'shipper'){
    // this.shipperName = localStorage.getItem('shipperName');
    this.activatedRoute.params.subscribe(params => {
      this.shipperId = params.shipperId;
      // this.getCarrierConnections();
   });
  }

  const mName = this.moduleName;
  this.displayedColumns = this.tableCols[mName] ? this.tableCols[mName] : '-';

    this.setFormControls();

    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params && Object.keys(params).length > 0) {
          this.sharedService.setFormControlBasedOnQueryParams(params, this.filterForm);
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

    this.filterForm.get('minRevenue').valueChanges.subscribe(val => {
        this.filterForm.controls.maxRevenue.setValue(val);
        this.filterForm.controls.maxRevenue.setValidators(Validators.min(this.filterForm.controls.minRevenue.value));
        this.filterForm.controls.maxRevenue.enable();
  });
  }

  getUserAPICall(){
    let isApiCallRequired:boolean = false;

    if(this.moduleName == 'carrier'){
       this.userId = localStorage.getItem('carrierId');
       this.userName = localStorage.getItem('carrierName');
      if(!this.userId || localStorage.getItem('carrierId')!=this.carrierId){
        this.showLoader = true;
        isApiCallRequired = true;
        this.sharedService.getUserIdAndName(this.carrierId).subscribe(resp=>{
          const carrierProfile = resp['response'];
          this.userId = carrierProfile['id'];
          this.userName = carrierProfile['legalName'];
          this.getCarrierConnections();
        });        
      }
    }      
    else if(this.moduleName == 'shipper'){
      this.userId = localStorage.getItem('shipperId');
      this.userName = localStorage.getItem('shipperName');
     if(!this.userId || localStorage.getItem('shipperId')!=this.shipperId){
      this.showLoader = true;
      isApiCallRequired=true;
       this.sharedService.getShipperIdAndName(this.shipperId).subscribe(resp=>{
         const shipperProfile = resp['response'];
         this.userId = shipperProfile['id'];
         this.userName = shipperProfile['companyName'];
         this.getCarrierConnections();
       });        
     }
    }

    if(!isApiCallRequired){
      this.getCarrierConnections();
    }
  }

  setFormControls() {
    this.filterForm = this.fb.group({
      search:[],
      createdDate:[],
      equipmentType:[],
      minRevenue:[],
      maxRevenue: [],
      tabType: []
    });
    this.filterForm.controls.maxRevenue.disable();
  }

  getCarrierConnections(isPaginated?) {
    if (isPaginated) {
      this.apiCallInProcess = true;
    } else{
      this.showLoader = true;
    }

    this.emitUserNameToParentComponent(this.userName);

    const pagination = '?limit=' + this.limit + '&page=' + this.page + '&id=' + this.userId;
    const appender = '&';
    let queryParams = '';
    if (this.selectedQueryParams.length) {
      queryParams = this.selectedQueryParams;
      queryParams = pagination + appender + queryParams;
    }
    const url = queryParams ? 
            (this.moduleName == 'shipper' ? (APIURL.envConfig.SHIPPERENDPOINTS.getShipperConnection ) : (APIURL.envConfig.CARRIERENDPOINTS.getCarrierConnection)) + queryParams
            :
            (this.moduleName == 'shipper' ? APIURL.envConfig.SHIPPERENDPOINTS.getShipperConnection : APIURL.envConfig.CARRIERENDPOINTS.getCarrierConnection) + pagination;
    this.httpService.get(url).subscribe(resp => {
      this.status = false;
      this.showLoader = false;
      this.apiCallInProcess = false;
      // allshipper
      let responseList;
      if(this.moduleName == 'shipper'){
        responseList = (resp['success'] && resp['response']['allCarrier'].length) ? resp['response']['allCarrier'] : [];
      }
      else{
        responseList = (resp['success'] && resp['response']['allshipper'].length) ? resp['response']['allshipper'] : [];
      }

     
      if (responseList.length) {
        // responseList.forEach(element => {
        //   console.log('element.createdAt', element.createdAt)
        //   element.createdAt = element.createdAt ? new Date(element.createdAt +' '+'UTC') : null;
        // });
        this.connectionList = isPaginated ? this.connectionList.concat(responseList) : responseList;
        this.tabCountData = resp['response']['tabCount'];
      } else {
        this.connectionList = [];
      }
      // console.log(this.connectionList);
      this.totalRecords = resp['response']['totalRecords'];
    }, (err) => {
      console.log('err', err)
      this.showLoader = false;
      this.apiCallInProcess = false;
      const errorMsg = 'Error - ' + err.message;
      // this.openMessagePopup(errorMsg);
    });
  }

  getInitials(name) {
    return this.sharedService.getInitials(name);
  }

  updateFilterList(){
    this.page = 1;
    const formValue = this.filterForm.value;
    let queryParams = '';
    this.revenueValidationFailed = false;
    if(formValue.minRevenue && (formValue.minRevenue > formValue.maxRevenue)){
      this.revenueValidationFailed = true;
      return false;
     }

    if (formValue.search) {
      queryParams = queryParams + 'search=' + formValue.search + '&';
    }

    if (formValue.createdDate && formValue.createdDate.start !== null) {
      let fromCreatedDate;
      let toCreatedDate;
      if(!formValue.createdDate.start && formValue.createdDate.indexOf('-')){
        const splitData = formValue.createdDate.split('-');
        fromCreatedDate = splitData[0];
        toCreatedDate = splitData[1];
      } else {
          fromCreatedDate = moment(formValue.createdDate.start._d).format('MM/DD/YYYY');
          toCreatedDate = moment(formValue.createdDate.end._d).format('MM/DD/YYYY');
      }
      queryParams = queryParams + 'fromCreatedDate=' + fromCreatedDate + '&' + 'toCreatedDate='
       + toCreatedDate + '&' + 'createdDate=' + fromCreatedDate + '-' + toCreatedDate + '&';
    }

    if (formValue.equipmentType && formValue.equipmentType !== '') {
      queryParams = queryParams + 'equipmentType=' + formValue.equipmentType + '&';
    }

    if (formValue.tabType && formValue.tabType !== '') {
      queryParams = queryParams + 'tabType=' + formValue.tabType + '&';
    }    

    if (formValue.minRevenue) {
      queryParams = queryParams + 'minRevenue=' + formValue.minRevenue + '&';
    }

    if (formValue.maxRevenue) {
      queryParams = queryParams + 'maxRevenue=' + formValue.maxRevenue + '&';
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
      if(!this.userId){
        this.getUserAPICall();
      }
      else
      this.getCarrierConnections();
  }
  }

  methodToChangQueryParams(query) {
    this.route.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: query
      });
  }

  onTableScroll(e) {
    const tableViewHeight = e.target.offsetHeight // viewport
    const tableScrollHeight = e.target.scrollHeight // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled    
    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 300;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation > limit && !this.apiCallInProcess && this.totalRecords > this.connectionList.length) {
      this.page = this.page + 1;
      this.getCarrierConnections(true);
    }
  }

  reset(){
    this.page = 1;
    this.filterActivated = false;
    this.filterForm.reset();
    if(this.selectedQueryParams && this.selectedQueryParams.length>1){
      this.selectedQueryParams = '';
    }
    this.methodToChangQueryParams(this.selectedQueryParams)
    this.getCarrierConnections();
  }

  applySearchFilter() {
    this.page = 1;
    const formValue = this.searchForm.value;
    let queryParams = '';
    if (formValue.searchInput && formValue.searchInput.length) {
      queryParams = queryParams + 'search=' + formValue.searchInput;
    }
    if(formValue.searchInput == ''){
      this.selectedQueryParams = '';
      this.getCarrierConnections();
    }
    this.selectedQueryParams = queryParams;
    if(this.selectedQueryParams && this.selectedQueryParams.length>1){
        this.getCarrierConnections();
    }
  }

  redirectToCarrierView(element){
    this.route.navigate(['carrier/view/',element.carrierPkId,'details']);
  }

  redirectToShipperView(element){
    this.route.navigate(['shipper/view/',element.shipperPkId,'details']);
  }

  emitUserNameToParentComponent(userName){
    this.outputUserName.emit(userName);
  }

}
