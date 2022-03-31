import { Component, OnInit } from '@angular/core';
import * as APIURL from '../../common/config/api-endpoints';
import { HttpService } from '../../common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { sharedService } from '../../common/services/shared.service';
@Component({
  selector: 'app-shipment-document',
  templateUrl: './shipment-document.component.html',
  styleUrls: ['./shipment-document.component.css']
})
export class ShipmentDocumentComponent implements OnInit {

  displayedColumns = ['documentName', 'type', 'uploadedOn', 'expireOn'];
  shipmentId: any;
  shipmentDocuments: any;
  showLoader: boolean;
  shipmentNameUniqueId:any;
  shipmentStatusLabel:any;
  pageLimit :any = 10;
  pageNumber :any = 1;
  totalRecords:any=0;
  statusCount:any;
  apiCallInProcess:boolean = false;
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

      this.getShipmentDocuments();
   });

  }

  getShipmentDocuments(isPaginated?){
    if(isPaginated){this.apiCallInProcess=true}
    else{this.showLoader=true;} 
    const url = APIURL.envConfig.SHIPMENTENDPOINTS.getShipmentDocuments + '?shipmentId=' + this.shipmentId +'&limit='+this.pageLimit+'&page='+this.pageNumber +'&orderDir=ASC&orderBy=id';
    this.httpService.get(url).subscribe(resp => {
      if(resp['response'] && resp['success']){
        const responseList = resp['response']['medias'];
        // this.shipmentDocuments = resp['response']['medias'];
        this.shipmentDocuments = isPaginated ? this.shipmentDocuments.concat(responseList) : responseList;
        this.shipmentDocuments.forEach(element => {
          let mediaUrl = element.mediaUrl.split(this.shipmentId+'/');
          element['docName'] = mediaUrl[1];
          element.mediaType = element.mediaType.replace(/_/g, ' ');
          this.showLoader=false;
          this.apiCallInProcess=false;
        });        
      }
      else{
        this.shipmentDocuments = [];
        this.showLoader = false;
        this.apiCallInProcess=false;
      }
    }, (err) => {
      this.showLoader = false;
      this.apiCallInProcess=false;
      console.log('err', err)
    });

  }

  openDocument(url) {
    window.open(url, '_blank');
  }

  onTableScroll(e) {
    const tableViewHeight = e.target.offsetHeight // viewport
    const tableScrollHeight = e.target.scrollHeight // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled    
    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 300;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation > limit && !this.apiCallInProcess && this.totalRecords > this.shipmentDocuments.length) {
      this.pageNumber = this.pageNumber + 1;
      this.getShipmentDocuments(true);
    }
  }

}
