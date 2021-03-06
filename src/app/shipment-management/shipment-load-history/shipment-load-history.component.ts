import { Component, OnInit } from '@angular/core';
import * as APIURL from '../../common/config/api-endpoints';
import { HttpService } from '../../common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { sharedService } from '../../common/services/shared.service';
import { MapsAPILoader } from '@agm/core';
@Component({
  selector: 'app-shipment-load-history',
  templateUrl: './shipment-load-history.component.html',
  styleUrls: ['./shipment-load-history.component.css']
})
export class ShipmentLoadHistoryComponent implements OnInit {
	displayedColumns: string[] = ['eventName', 'location' ,'dateTime'];

  shipmentId:any;
  showLoader:boolean=false;
  shipmentLoadHistory:any;
  public geoCoder: any;
  shipmentNameUniqueId:any;
  shipmentStatusLabel:any;
  pageLimit :any = 10;
  public currentIndex: any;
  showLocationLoader=false;
  pageNumber :any = 1;
  totalRecords:any=0;
  statusCount:any;
  apiCallInProcess:boolean = false;
  constructor(private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    private sharedService: sharedService,
    private mapsAPILoader: MapsAPILoader) { }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
    });
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
      this.getShipmentLoadHistory();
   });
  }

  getShipmentLoadHistory(isPaginated?){
    if(isPaginated){this.apiCallInProcess=true}
    else{this.showLoader=true;} 
    const url = APIURL.envConfig.SHIPMENTENDPOINTS.getShipmentLoadHistory + '?shipmentId=' + this.shipmentId+'&limit='+this.pageLimit+'&page='+this.pageNumber;
    this.httpService.get(url).subscribe(resp => {
      if(resp['response'] && resp['success']){
        const responseList = resp['response'];
        this.showLoader = false;
        this.apiCallInProcess=false;
        responseList.forEach(element => {
          element.updatedAt = element.updatedAt ? new Date(element.updatedAt +' '+'UTC') : null;
        });        
        this.shipmentLoadHistory = isPaginated ? this.shipmentLoadHistory.concat(responseList) : responseList;
       
      }
      else{
        this.shipmentLoadHistory = [];
        this.totalRecords = 0; 
        this.showLoader = false;
        this.apiCallInProcess=false;
      }
    }, (err) => {
      this.showLoader = false;
      this.apiCallInProcess=false;
    });
  }

  onTableScroll(e) {
    const tableViewHeight = e.target.offsetHeight // viewport
    const tableScrollHeight = e.target.scrollHeight // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled    
    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 300;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation > limit && !this.apiCallInProcess && this.totalRecords > this.shipmentLoadHistory.length) {
      this.pageNumber = this.pageNumber + 1;
      this.getShipmentLoadHistory(true);
    }
  }

  async showLocation(latitude: any, longitude: any, indexKey: any) {
    this.currentIndex = indexKey;
    this.showLocationLoader = true;
    this.shipmentLoadHistory[indexKey].showLocation = 'show';
    for (var hIndex in this.shipmentLoadHistory) {
      if (parseInt(hIndex) === parseInt(indexKey) && latitude && longitude) {
        this.shipmentLoadHistory[hIndex].currentLocation =
          await this.showPosition(latitude, longitude);
      } else if (parseInt(hIndex) === parseInt(indexKey)) {
        this.shipmentLoadHistory[hIndex].currentLocation = 'No Location shared';
      }
    }
    this.showLocationLoader = false;
  }

  hideLocation(indexKey: any) {
    this.currentIndex = null;
    for (var hIndex in this.shipmentLoadHistory) {
      if (parseInt(hIndex) === parseInt(indexKey)) {
        this.shipmentLoadHistory[hIndex].currentLocation = null;
        this.shipmentLoadHistory[hIndex].showLocation = 'hide';
      }
    }
  }

  showPosition(locationLat: any, locationLong: any) {
    let addressDriver = [];
    return new Promise((resolve, reject) => {
      let selatlong = { lat: locationLat, lng: locationLong };
      this.geoCoder.geocode(
        { location: selatlong },
        function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            let newname = '';
            if (results[0].address_components[3] !== undefined) {
              newname = results[0].address_components[3].long_name;
            } else {
              newname = '';
            }
            resolve(results[0].formatted_address);
          } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          } else {
            resolve('No Location shared');
          }
        }
      );
    });
  }

}
