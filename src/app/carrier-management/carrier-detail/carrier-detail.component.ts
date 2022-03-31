import { Component, OnInit, ViewChild } from '@angular/core';
// import {MatTableDataSource} from '@angular/material';
import * as moment from "moment";
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { ActivatedRoute, Router, Params} from '@angular/router';
import { HttpService } from '../../common/services/http.service';
import { sharedService } from '../../common/services/shared.service';
import * as APIURL from '../../common/config/api-endpoints';


@Component({
  selector: 'app-detail',
  templateUrl: './carrier-detail.component.html',
  styleUrls: ['./carrier-detail.component.css']
})
export class CarrierDetailComponent implements OnInit {
	status: boolean = false;
  displayedColumns: string[] = ['transactionId', 'dateTime', 'subscriptionPlan', 'status', 'amount'];
  dataSource : any = [];
  carrierId:any;
  panelOpenState:boolean;
  showLoader:boolean=false;
  carrierProfile : any;
  subscriptionDetail : any;
  carrierDocumentList: any = [];
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
    private sharedService: sharedService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.carrierId = params.carrierId;
      this.showLoader = true;
      this.getCarrierDetails();
   });
  }

  getCarrierDetails(){
    const url = APIURL.envConfig.CARRIERENDPOINTS.getCarrierProfile + '?id=' + this.carrierId;
    this.httpService.get(url).subscribe(resp => {
      if(resp['response']){
        this.carrierProfile = resp['response'];
        this.carrierProfile.registrationDate = resp['response'].registrationDate ? new Date(resp['response'].registrationDate +' '+'UTC') : null;
        this.carrierProfile.firstLogin = resp['response'].firstLogin ? new Date(resp['response'].firstLogin +' '+'UTC') : null;
        this.carrierProfile.lastLogin = resp['response'].lastLogin ? new Date(resp['response'].lastLogin +' '+'UTC') : null;
        this.carrierProfile.createdAt = resp['response'].createdAt ? new Date(resp['response'].createdAt +' '+'UTC') : null;
        this.carrierProfile.updatedAt = resp['response'].updatedAt ? new Date(resp['response'].updatedAt +' '+'UTC') : null;
        localStorage.setItem('carrierName',this.carrierProfile.legalName);
        localStorage.setItem('userId',this.carrierProfile.userId);
        localStorage.setItem('carrierId',this.carrierProfile.id);
        this.getDocumentsList();
      }
    }, (err) => {
      this.showLoader = false;
      console.log('err', err)
    });
  }

  getDocumentsList(){
    const url = APIURL.envConfig.CARRIERENDPOINTS.getDocumentList + '?limit=10&userId='
    + this.carrierProfile.userId + '&mediaType=CERTIFICATE_OF_INSURANCE';
    this.httpService.get(url).subscribe(resp => {
      this.showLoader = false;
      this.showLoader = false;
      if(resp['success'] && resp['response']['medias']){
        this.carrierDocumentList = resp['response']['medias'];
        this.carrierDocumentList.forEach(element => {
            let mediaUrl = element.mediaUrl.split('certificate_of_insurance/');
            element['docName'] = mediaUrl[1];
            element['isValid'] = moment(moment()).isBefore(element.detail.expiryDate);
        });
      }
      else{
        this.carrierDocumentList = [];
      }
    }, (err) => {
      this.showLoader = false;
      console.log('err', err)
    });
  }

  openDocument(url) {
    window.open(url, '_blank');
  }

  getInitials(name) {
    return this.sharedService.getInitials(name);
  }

  redirectToCarrierEdit(){
    this.router.navigate(['carrier/edit/',this.carrierId]);
  }
}
