import { Component, OnInit } from '@angular/core';
// import * as APIURL from '../../common/config/api-endpoints';
import * as APIURL from '../../common/config/api-endpoints';
import { HttpService } from '../../common/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shipment-payments',
  templateUrl: './shipment-payments.component.html',
  styleUrls: ['./shipment-payments.component.css']
})
export class ShipmentPaymentsComponent implements OnInit {
  shipmentId:any;
  showLoader:boolean=false;
  shipmentDetails:any;
  historyDetailsShipper:any;
  historyDetailsCarrier:any;
  items=[1,2,3,4,5,6,7,8];
  selectedTab='shipper';
  
  constructor(private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    private httpClient: HttpClient,
    private router: Router) { }

  ngOnInit() {
    localStorage.removeItem('shipmentNameUniqueId');
    localStorage.removeItem('shipmentStatusLabel');
    localStorage.removeItem('shipmentDriverId');
    localStorage.removeItem('shipmentShipperId');
    this.activatedRoute.params.subscribe(params => {
      this.shipmentId = params.shipmentId;
      this.showLoader = true;
      this.getShipmentPayment();
      this.getShipmentDetails();
   });
  }

  getShipmentDetails(){
    const url = APIURL.envConfig.SHIPMENTENDPOINTS.getShipmentDetails + '?id=' + this.shipmentId;
    this.httpService.get(url).subscribe(resp => {
      if(resp['response']){
        this.showLoader = false;
        this.shipmentDetails = resp['response'];
        this.shipmentDetails.createdAt = this.shipmentDetails.createdAt ? new Date(this.shipmentDetails.createdAt +' '+'UTC') : null;
        localStorage.setItem('shipmentNameUniqueId',this.shipmentDetails.title+'$*'+this.shipmentDetails.uniqueId);
        localStorage.setItem('shipmentStatusLabel', this.shipmentDetails.statusLabel)
        localStorage.setItem('shipmentStatusCount', this.shipmentDetails.status)
        if(this.shipmentDetails.driverId && this.shipmentDetails.driverId!= null){
          localStorage.setItem('shipmentDriverId', this.shipmentDetails.driverId);
        }
        if(this.shipmentDetails.shipperId!=null){
          localStorage.setItem('shipmentShipperId', this.shipmentDetails.shipperId);
        }
      }
    }, (err) => {
      this.showLoader = false;
      console.log('err', err)
    });
  }

  redirectToCarrierDetails(element){
    this.router.navigate(['carrier/view/',element.carrierId,'details']);
  }

  redirectToDriverDetails(element){
    this.router.navigate(['driver/view/', element.driverId, 'details']);
  }

  transactionHistory(tab)
  {
    this.showLoader=true;
   this.selectedTab=tab;
   this.showLoader=false;

  }

  getShipmentPayment()
  {
    const url = 'https://payapi-dev.laneaxis.com/admin/shipment-payment';
    this.httpClient.get(url).subscribe(resp => {
      if(resp['success']){
        console.log('resp');
        console.log(resp['respons'][0]['Shipper transaction history']);
        this.showLoader = false;
        this.historyDetailsShipper = resp['respons'][0]['Shipper transaction history'];
        this.historyDetailsCarrier = resp['respons'][0]['Carrier transaction history'];
        console.log('details');
        console.log(this.historyDetailsCarrier);
        console.log(this.historyDetailsShipper);
      }
    }, (err) => {
      this.showLoader = false;
      console.log('err', err)
    });
  }

}

