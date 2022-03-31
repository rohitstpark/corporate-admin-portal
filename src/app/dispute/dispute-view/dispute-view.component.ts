import { Component, OnInit, ViewChild } from '@angular/core';
// import {MatTableDataSource} from '@angular/material';
import * as moment from "moment";
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../common/services/http.service';
import { sharedService } from '../../common/services/shared.service';
import * as APIURL from '../../common/config/api-endpoints';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-dispute-view',
  templateUrl: './dispute-view.component.html',
  styleUrls: ['./dispute-view.component.css']
})
export class DisputeViewComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger, { static: false }) _auto: MatAutocompleteTrigger;
  responseAction:boolean = true;
  showResponseBox:boolean = false;
  showSuccessResponse:boolean = false;
  shipmentId:any;
  showLoader:boolean=false;
  disputeDetails:any;
  disputeReason:any;


  assigneeList:any=[];
  isAssignLoader:boolean=false;
  disputeAssigned:any;
  isEditEnabled:boolean=false;
  myControl = new FormControl();

  constructor(private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    private sharedService: sharedService){}
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.shipmentId = params.shipmentId;
      this.showLoader = true;
      this.getDisputeDetails();

      this.myControl.valueChanges.subscribe(val => {
        if(val != undefined && val && val.length>1){
        this.isAssignLoader = true;
        this.getAssigneeList(val);  
        }      
      })

   });
  }

  getDisputeDetails(){
    // this.shipmentId = 658;
      const url = APIURL.envConfig.DISPUTEENDPOINTS.getdisputeDetails + '?shipmentId=' + this.shipmentId;
      this.httpService.get(url).subscribe(resp => {
        this.showLoader = false;
        if(resp['response'] && resp['success']){
          this.disputeDetails = resp['response'];
          this.disputeDetails.isDispute.createdAt = resp['response'].isDispute.createdAt ? new Date(resp['response'].isDispute.createdAt +' '+'UTC') : null;
          
          localStorage.setItem('disputeUniqueId', this.disputeDetails.uniqueId);
          localStorage.setItem('disputeId', this.disputeDetails.isDispute.id);

          this.disputeAssigned = this.disputeDetails.isDispute.disputeAssign;
          if(this.disputeAssigned){
            let fullName = this.disputeAssigned;
            fullName = fullName.split(' ');
            this.getAssigneeList(fullName[0], true);
          }
          if(this.disputeDetails.deliveryDoc){
            let filePath = this.disputeDetails.deliveryDoc;
            filePath = filePath.split(this.shipmentId+'/');
            this.disputeDetails['docName'] = filePath[1];
          }
          else{
            this.disputeDetails['docName'] = '-';
          }
        }
        else{
          this.sharedService.openMessagePopup('Error - ' +resp['message']);
        }
      }, (err) => {
        this.showLoader = false;
        console.log('err', err)
        this.sharedService.openMessagePopup('Error - ' +err['message']);
      });
  }

  respondToDispute() {  
    this.responseAction = false;
    this.showResponseBox = true;
    this.showSuccessResponse = false;
  }

  submitResponse(){
    if(this.disputeReason && this.disputeReason.length){
      this.showLoader=true;
      let reqBody = {
        shipmentId:this.shipmentId,
        description:this.disputeReason,
        disputeStatus:2,
        disputeId:this.disputeDetails.isDispute.id
      };
      this.sharedService.updateDisputeSharedService(reqBody).subscribe(resp => {
        this.showLoader=false;
        if(resp['success']){
          this.responseAction = true;
          this.showResponseBox = false;
          this.disputeReason = '';
          this.sharedService.openMessagePopup('Success - ' +resp['message']);
        }
        else{
          this.sharedService.openMessagePopup('Error - ' +resp['message']);
        }
      }, (err)=> {
        this.showLoader=false;
        this.sharedService.openMessagePopup('Error - ' +err['message']);
      })
    }
    else{
      this.sharedService.openMessagePopup('Error - Dispute Reason cannot be empty.');
    }
  }
  cancelRespond() {
    this.responseAction = true;
    this.showResponseBox = false;
    this.showSuccessResponse = false;
  }
  respondAndResolve() {  
    if(this.disputeReason && this.disputeReason.length){
      this.showLoader=true; 
      let reqBody = {
        shipmentId:this.shipmentId,
        description:this.disputeReason,
        disputeStatus:3,
        disputeId:this.disputeDetails.isDispute.id
      };
      this.sharedService.updateDisputeSharedService(reqBody).subscribe(resp => {
        this.showLoader=false;
        if(resp['success']){
          this.responseAction = true;
          this.showResponseBox = false;
          this.showSuccessResponse = true;
          this.disputeReason = '';
          // this.sharedService.openMessagePopup('Success - ' +resp['message']);
        }
        else{
          this.sharedService.openMessagePopup('Error - ' +resp['message']);
        }
      }, (err)=> {
        this.showLoader=false;
        this.sharedService.openMessagePopup('Error - ' +err['message']);
      })
    }
    else{
      this.sharedService.openMessagePopup('Error - Dispute Reason cannot be empty.');
    }
  }

  getAssigneeList(val, setValue?){
    const url = APIURL.envConfig.DISPUTEENDPOINTS.getUser + '?userRole=ADMIN&search='+val;
    this.httpService.get(url).subscribe(resp => {
      this.isAssignLoader=false;
      if(resp['response'] && resp['success']){
        this.assigneeList = resp['response'];
        if(setValue)
        this.myControl.setValue(this.assigneeList[0]);
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

  displayFnAssignee(user): string {
    return user && user.firstName && user.lastName ? (user.firstName + ' ' + user.lastName) : '';
  }

  updateAssignee(){
    if(this.myControl.value){
      this.showLoader=true;
      const url = APIURL.envConfig.DISPUTEENDPOINTS.disputeAssignUpdate;
      const reqBody = {
        disputeId:this.disputeDetails.isDispute.id,
        assigne:this.myControl.value['adminUserId']
       }
      this.httpService.post(url,reqBody).subscribe(resp => {
        this.showLoader=false;
        if(resp['success']){
          this.isEditEnabled=false;
          this.getDisputeDetails();
          this.sharedService.openMessagePopup('Success - Assignee Updated Successfully');
        }
        else{
          this.sharedService.openMessagePopup('Error - ' +resp['message']);
        }
      }, (err) => {
        this.showLoader=false;
        console.log('err', err)
        this.sharedService.openMessagePopup('Error - ' +err['message']);
      });
    }
  }

}
