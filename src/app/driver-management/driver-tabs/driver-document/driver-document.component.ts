import { Component, OnInit } from '@angular/core';
import * as moment from "moment";
import * as APIURL from '../../../common/config/api-endpoints';
import { HttpService } from '../../../common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { sharedService } from '../../../common/services/shared.service';
@Component({
  selector: 'app-driver-document',
  templateUrl: './driver-document.component.html',
  styleUrls: ['./driver-document.component.css']
})
export class DriverDocumentComponent implements OnInit {
	displayedColumns = ['documentName', 'type', 'uploadedOn', 'expireOn'];
  driverId: any;
  driverDocuments: any;
  showLoader: boolean;
  driverName:any;
  driverProfile:any;
  constructor(private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private sharedService: sharedService) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this.driverId = params.driverId;
      this.showLoader = true;
      this.getDriverDetails();
   });
    // this.driverName= localStorage.getItem('driverName');

    // if(localStorage.getItem('driverId')!=this.driverId){
    //   this.sharedService.getDriverUserIdAndName(this.driverId).subscribe(resp => {
    //     const driverProfile = resp['response']; 
    //     this.driverName = driverProfile['name'];
    //   });      
    // }

  }
  getDriverDetails(){
    this.showLoader=true;
    const url = APIURL.envConfig.DRIVERENDPOINTS.getDriverProfile+'?availabilityDate=12%2F15%2F2020&isLastShipment=1&isTotalShipments=1&driverId='+ this.driverId;
    this.httpService.get(url).subscribe(resp => {
      if(resp['response']){
        this.showLoader=false;
        this.driverProfile = resp['response'];
        this.driverName = this.driverProfile['name'];
        this.getDriverDocuments();
      }
    }, (err) => {
      this.showLoader = false;
      console.log('err', err)
    });
  }

  getDriverDocuments(){
    // const driverUserId=localStorage.getItem('driverUserId');
    this.showLoader=true;
    const url = APIURL.envConfig.DRIVERENDPOINTS.getDriverDocuments + '?driverId=' + this.driverId;
    this.httpService.get(url).subscribe(resp => {
      if(resp['response'] && resp['success']){
        this.showLoader=false;
        this.driverDocuments = resp['response'];
        this.driverDocuments.forEach(element => {
          let mediaUrl = element.mediaUrl.split('documents/');
          element['docName'] = mediaUrl[1];
          element.mediaType = element.mediaType.replace(/_/g, ' ');
        });
        if(this.driverProfile.cdlFrontImage){
          const cdlFrontDocName = this.driverProfile.cdlFrontImage.split('cdl-images/')
          this.driverDocuments.push({docName: cdlFrontDocName[1], mediaUrl : this.driverProfile.cdlFrontImage,mediaType: 'CDL Front', createdAt : null, expireOn : this.driverProfile.cdlExpiryDate})
        }
        
        if(this.driverProfile.cdlBackImage){
          const cdlBackDocName = this.driverProfile.cdlBackImage.split('cdl-images/')
          this.driverDocuments.push({docName: cdlBackDocName[1], mediaUrl : this.driverProfile.cdlBackImage,mediaType: 'CDL Back', createdAt : null, expireOn : this.driverProfile.cdlExpiryDate})
          }
        
      }
      else{
        this.driverDocuments = [];
        this.showLoader = false;
      }
    }, (err) => {
      this.showLoader = false;
      console.log('err', err)
    });

  }

  openDocument(url) {
    window.open(url, '_blank');
  }
}
