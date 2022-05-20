import { Component, OnInit } from '@angular/core';
import * as APIURL from '../../common/config/api-endpoints';
import { HttpService } from '../../common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { sharedService } from '../../common/services/shared.service';
@Component({
  selector: 'app-shipment-bid-history',
  templateUrl: './shipment-bid-history.component.html',
  styleUrls: ['./shipment-bid-history.component.css']
})
export class ShipmentBidHistoryComponent implements OnInit {
	displayedColumns: string[] = ['name', 'type', 'dateTime', 'bidAmont', 'notes', 'status'];
	shipmentId: any;
  bidHistoryList: any;
  showLoader: boolean;
  pageLimit :any = 10;
  shipmentDetails:any;
  pageNumber :any = 1;
  totalRecords:any=0;
  apiCallInProcess:boolean = false;
  shipmentNameUniqueId:any;
  shipmentStatusLabel:any;
  statusCount:any;
  constructor(private httpService: HttpService,private activatedRoute: ActivatedRoute, private sharedService: sharedService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.shipmentId = params.shipmentId;
      this.showLoader = true;
      if(localStorage.getItem('shipmentNameUniqueId')){
        this.shipmentNameUniqueId = localStorage.getItem('shipmentNameUniqueId');
        this.shipmentNameUniqueId = this.shipmentNameUniqueId.split('$*');
      }
      this.statusCount = localStorage.getItem('shipmentStatusCount');
      if(localStorage.getItem('shipmentStatusLabel')){
        this.shipmentStatusLabel = localStorage.getItem('shipmentStatusLabel');
      }
      if(!localStorage.getItem('shipmentId') || (localStorage.getItem('shipmentId')!=this.shipmentId)){
        this.sharedService.getShipmentIdAndName(this.shipmentId).subscribe(resp => {
          const shipmentDetails = resp['response'];
          if(shipmentDetails){
            this.shipmentNameUniqueId = shipmentDetails['title']+'$*'+shipmentDetails['uniqueId'];
            this.shipmentNameUniqueId = this.shipmentNameUniqueId.split('$*');
            this.shipmentStatusLabel = shipmentDetails['statusLabel'];
            this.statusCount = shipmentDetails['status'];
          }
        })
      }
      this.getShipmentBidHistory();
   });
  }

  getShipmentBidHistory(isPaginated?){
    this.getShipmentDetails();
    if(isPaginated){this.apiCallInProcess=true}
    else{this.showLoader=true;}    
    const url = APIURL.envConfig.SHIPMENTENDPOINTS.getShipmentBid + '?shipmentId=' + this.shipmentId +'&limit='+this.pageLimit+'&page='+this.pageNumber;
    // +'&userRole=SHIPPER'
    this.httpService.get(url).subscribe(resp => {
      if(resp['response'] && resp['success']){
        this.showLoader=false;
        this.apiCallInProcess=false;
        const responseList = resp['response'];
        this.bidHistoryList = isPaginated ? this.bidHistoryList.concat(responseList) : responseList;
        this.totalRecords = resp['totalBid'];  
      }
      else{
        this.bidHistoryList = [];
        this.totalRecords = 0; 
        this.showLoader = false;
        this.apiCallInProcess=false;
      }
    }, (err) => {
      this.showLoader = false;
      this.apiCallInProcess=false;
      console.log('err', err)
    });
  }

  getInitials(name) {
    return this.sharedService.getInitials(name);
  }

  onTableScroll(e) {
    const tableViewHeight = e.target.offsetHeight // viewport
    const tableScrollHeight = e.target.scrollHeight // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled    
    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 300;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation > limit && !this.apiCallInProcess && this.totalRecords > this.bidHistoryList.length) {
      this.pageNumber = this.pageNumber + 1;
      this.getShipmentBidHistory(true);
    }
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

}
