import { Component, OnInit } from '@angular/core';
import * as APIURL from '../../common/config/api-endpoints';
import { HttpService } from '../../common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { sharedService } from '../../common/services/shared.service';

@Component({
  selector: 'app-dispute-timeline',
  templateUrl: './dispute-timeline.component.html',
  styleUrls: ['./dispute-timeline.component.css']
})
export class DisputeTimelineComponent implements OnInit {
  responseAction:boolean = true;
  showResponseBox:boolean = false;
  showSuccessResponse:boolean = false;
  dataSource:any=[];
  displayedColumns = ['user', 'comments', 'dateTime'];
  shipmentId:any;
  showLoader:boolean=false;
  disputeMsgsList:any=[];
  disputeReason:any;
  uniqueId:any;
  constructor(private httpService: HttpService,private activatedRoute: ActivatedRoute, private sharedService: sharedService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.shipmentId = params.shipmentId;
      this.showLoader = true;
      this.getDisputeMessages();
   });
   if(localStorage.getItem('disputeUniqueId')){
     this.uniqueId = localStorage.getItem('disputeUniqueId');
   }
  }

  getDisputeMessages(){
    // this.shipmentId = 51;
    const url = APIURL.envConfig.DISPUTEENDPOINTS.getdisputeMessages + '?disputeId=' + localStorage.getItem('disputeId');
    this.httpService.get(url).subscribe(resp => {
      if(resp['response'] && resp['success']){
        this.disputeMsgsList = resp['response']['batches'];
        this.showLoader = false;
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

  getInitials(name) {
    return this.sharedService.getInitials(name);
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
        disputeId:localStorage.getItem('disputeId')
      };
      this.sharedService.updateDisputeSharedService(reqBody).subscribe(resp => {
        console.log(resp);
        this.showLoader=false;
        if(resp['success']){
          this.responseAction = true;
          this.showResponseBox = false;
          this.disputeReason = '';
          this.sharedService.openMessagePopup('Success - ' +resp['message']);
          this.getDisputeMessages();
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
        disputeId:localStorage.getItem('disputeId')
      };
      this.sharedService.updateDisputeSharedService(reqBody).subscribe(resp => {
        this.showLoader=false;
        if(resp['success']){
          this.responseAction = true;
          this.showResponseBox = false;
          this.showSuccessResponse = true;
          this.disputeReason = '';
          this.getDisputeMessages();
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

}
