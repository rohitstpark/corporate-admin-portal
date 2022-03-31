import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../common/services/http.service';
import { sharedService } from '../../common/services/shared.service';
import * as APIURL from '../../common/config/api-endpoints';

@Component({
  selector: 'app-detail',
  templateUrl: './shipper-detail.component.html',
  styleUrls: ['./shipper-detail.component.css']
})
export class ShipperDetailComponent implements OnInit {
	status: boolean = false;
  dataSource : any = [];
  shipperId:any;
  panelOpenState:boolean;
  showLoader:boolean=false;
  shipperProfile : any;
  
  constructor(private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    private sharedService: sharedService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.shipperId = params.shipperId;
      this.showLoader = true;
      this.getShipperDetails();
   });
  }

  getShipperDetails(){
    const url = APIURL.envConfig.SHIPPERENDPOINTS.getShipperProfile + '?id=' + this.shipperId;
    this.httpService.get(url).subscribe(resp => {
      if(resp['response']){
        this.showLoader = false;
        this.shipperProfile = resp['response'];
        this.shipperProfile.registrationDate = resp['response'].registrationDate ? new Date(resp['response'].registrationDate +' '+'UTC') : null;
        this.shipperProfile.firstLogin = resp['response'].firstLogin ? new Date(resp['response'].firstLogin +' '+'UTC') : null;
        this.shipperProfile.lastLogin = resp['response'].lastLogin ? new Date(resp['response'].lastLogin +' '+'UTC') : null;
        this.shipperProfile.createdAt = resp['response'].createdAt ? new Date(resp['response'].createdAt +' '+'UTC') : null;
        this.shipperProfile.updatedAt = resp['response'].updatedAt ? new Date(resp['response'].updatedAt +' '+'UTC') : null;
        if(this.shipperProfile.contractDocument!=null){
          let mediaUrl = this.shipperProfile.contractDocument.split('contract_document/');
          this.shipperProfile['docName'] = mediaUrl[1];
        }
        localStorage.setItem('shipperName',this.shipperProfile.companyName);
        localStorage.setItem('shipperUserId',this.shipperProfile.userId);
        localStorage.setItem('shipperId',this.shipperProfile.id);
        // this.getDocumentsList();
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

}
