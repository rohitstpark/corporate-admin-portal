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
  showLoader:boolean=true;
  shipmentDetails:any;
  historyDetailsShipper:any;
  historyDetailsCarrier:any;
  shipperTransactionStatus:any;
  carrierTransactionStatus:any;
  emptyScreen=false;
  items=[1,2,3,4,5,6,7,8];
  rescheduleButton=false;
  selectedTab='shipper';
  
  constructor(private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.showLoader = true;
    localStorage.removeItem('shipmentNameUniqueId');
    localStorage.removeItem('shipmentStatusLabel');
    localStorage.removeItem('shipmentDriverId');
    localStorage.removeItem('shipmentShipperId');
    this.activatedRoute.params.subscribe(params => {
      this.shipmentId = params.shipmentId;
      
      // this.getShipmentDetails();

   });

   let queryParam = this.router.url.split('/')[this.router.url.split('/').length-1];
     console.log('params');
     console.log(queryParam);
    if (queryParam === 'payments' || queryParam === 'shipperTransaction') {
      this.transactionHistory('shipper');
    }
    if(queryParam==='carrierTransaction')
   {
      this.transactionHistory('carrier');
    }
    this.showLoader = false;
  }

  getShipmentDetails(){
    const url = APIURL.envConfig.SHIPMENTENDPOINTS.getShipmentDetails + '?id=' + this.shipmentId;
    this.httpService.get(url).subscribe(resp => {
      if(resp['success']){
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
       this.getShipmentPayment()
      }
    }, (err) => {
      this.showLoader = false;
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
    this.emptyScreen=false;
   this.selectedTab=tab;
   if(tab==='shipper')
   {
    this.getShipmentDetails();
   this.router.navigate(['shipment/view/'+this.shipmentDetails.id+'/payments/shipperTransaction']);
}
   if(tab==='carrier')
{ 

  this.getShipmentDetails();

  // this.showLoader=true;
  this.router.navigate(['shipment/view/'+this.shipmentDetails.id+'/payments/carrierTransaction']);
}
  //  this.showLoader=false;

  }

  getShipmentPayment()
  {
    // const url = 'https://payapi-dev.laneaxis.com/admin/transaction-history?shipperId=179566'+'&shipmentId=3363'+'&carrierId=2335029';
    const url = APIURL.envConfig.APIDOMAIN.transaction+'?shipperId='+this.shipmentDetails.shipperPkId+'&shipmentId='+this.shipmentDetails?.id+'&carrierId='+this.shipmentDetails.carrierPkId;
    this.httpClient.get(url).subscribe(resp => {
      if(resp['success']){
      
        this.showLoader = false;
        this.historyDetailsShipper = resp['response'].records.shipperTransactionHistory;
        this.historyDetailsCarrier = resp['response'].records.carrierTransactionHistory;
        this.shipperTransactionStatus=resp['response'].records.shipperTransactionStatus;
        this.carrierTransactionStatus=resp['response'].records.carrierTransactionStatus;
        
        if(this.historyDetailsShipper.length)
        {
          if(this.historyDetailsShipper[0].achFailed.attempt >= 5)
          this.rescheduleButton=true;
        }
        this.emptyScreen=false;
        if(!this.historyDetailsCarrier.length )
        {
          if(this.selectedTab==='carrier')
          this.emptyScreen=true;
          
        }
      }
      if(resp['error'])
      { console.log('err');
      console.log(resp['error']);
        this.emptyScreen=true;
        this.showLoader=false;
    }
    }, (err) => {
      console.log('err');
      console.log(err);
      this.showLoader = false;
      this.emptyScreen=true;
    });
  }

  reschedule()
  {
    if(this.historyDetailsShipper[0].achFailed.attempt >= 5)
    {
      this.showLoader=true;
      // const url = 'https://payapi-uat.laneaxis.com/admin/ach-payment'+'?shipmentBidId='+this.shipperTransactionStatus.shipmentBidId+'&userId='+this.shipperTransactionStatus.shipperId;
      const url = APIURL.envConfig.APIDOMAIN.ach+'?shipmentBidId='+this.shipperTransactionStatus.shipmentBidId+'&userId='+this.shipperTransactionStatus.shipperId;
      const reqBody = {
        shipmentBidId: this.shipperTransactionStatus.shipmentBidId,
        userId:this.shipperTransactionStatus.shipperId,
       };
      this.httpClient.post(url, reqBody).subscribe(resp => {
        console.log('resp');
        console.log(resp);
        if(resp['success'])
        {
          this.getShipmentDetails();
        }
    })
  }

}

  public generateFake(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }
  
}

