import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../common/services/http.service';
import * as APIURL from '../../common/config/api-endpoints';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sharedService } from '../../common/services/shared.service';
import * as FILTERS from '../../common/config/filters-datalist';

import { GermanAddress } from '@angular-material-extensions/google-maps-autocomplete';
import { MapsAPILoader } from '@agm/core';
import { Appearance } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;

@Component({
  selector: 'app-shipment-driver',
  templateUrl: './shipment-driver.component.html',
  styleUrls: ['./shipment-driver.component.css']
})
export class ShipmentDriverComponent implements OnInit {
  driverId:any;
  driverProfile:any;
  showLoader:boolean = false;
  driverStatusList:any;
  displayedColumns: string[] = ['name', 'phone', 'email', 'dotNumber', 'cdlNumber', 'currentLocation', 'status'];
  dataSource : any = [];
  shipmentNameUniqueId:any=[];
  shipmentStatusLabel:any;
  statusCount:any;
  shipmentId:any;
  locationLoader:any;
  locationStatus:any=[];
  public geoCode: any;
  public geoCoder: any;

  constructor(private activatedRoute: ActivatedRoute,
    private route: Router,
    private httpService: HttpService,
    private fb: FormBuilder,
    private sharedService: sharedService,
    private mapsAPILoader: MapsAPILoader) { }

  ngOnInit() {
    this.loadScript('https://api.mapbox.com/mapbox-gl-js/v1.11.1/mapbox-gl.js');
    this.activatedRoute.params.subscribe(params => {
      this.shipmentId = params.shipmentId;
    })

    if(localStorage.getItem('shipmentNameUniqueId')){
      this.shipmentNameUniqueId = localStorage.getItem('shipmentNameUniqueId');
      this.shipmentNameUniqueId = this.shipmentNameUniqueId.split('$*');
    }
    if(localStorage.getItem('shipmentStatusLabel')){
      this.shipmentStatusLabel = localStorage.getItem('shipmentStatusLabel');
    }

    this.statusCount = localStorage.getItem('shipmentStatusCount');
    if(localStorage.getItem('shipmentDriverId')){
      this.showLoader=true;
      this.driverId = localStorage.getItem('shipmentDriverId');
      this.getDriverDetails();
    }
    else{
      this.driverProfile = [];
    }

    if(!localStorage.getItem('shipmentId') || (localStorage.getItem('shipmentId')!=this.shipmentId)){
      this.sharedService.getShipmentIdAndName(this.shipmentId).subscribe(resp => {
        const shipmentDetails = resp['response'];
        if(shipmentDetails){
          this.shipmentNameUniqueId = shipmentDetails['title']+'$*'+shipmentDetails['uniqueId'];
          this.shipmentNameUniqueId = this.shipmentNameUniqueId.split('$*');
          this.driverId = shipmentDetails['driverId'];
          this.shipmentStatusLabel = shipmentDetails['statusLabel'];
          this.statusCount = shipmentDetails['status'];
        }
      })
    }

   
  }

  loadScript(url: string) {
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  getDriverDetails(){
    const url = APIURL.envConfig.DRIVERENDPOINTS.getDriverProfile+'?availabilityDate=12%2F15%2F2020&isLastShipment=1&isTotalShipments=1&driverId='+this.driverId;
    this.httpService.get(url).subscribe(resp => {
      if(resp['response']){
        this.showLoader = false;
        this.driverProfile = [resp['response']];
        }
    }, (err) => {
      this.showLoader = false;
      console.log('err', err)
    });
  }

  codeAddress(locationLat, locationLong, index) {
    let selatlong = { lat: locationLat, lng: locationLong };
    let _self = this;
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      this.geoCoder.geocode({ 'location': selatlong }, function (results:any, status:any) {
        if (status == google.maps.GeocoderStatus.OK) {
          let newname = "";
          if (results[0].address_components[3] != undefined) {
            newname = results[0].address_components[3].long_name;
          } else {
            newname = "";
          }
          _self.driverProfile[index]['shortAddress'] = results[0].address_components[2].long_name + ' , ' + newname;
          _self.driverProfile[index]['fullAddress'] = results[0].formatted_address;
          _self.locationLoader = false;
          // _self.cd.detectChanges();
        }
        else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          setTimeout(() => {
            return _self.codeAddress(locationLat, locationLong, index);
            // _self.cd.detectChanges();
          }, 500);
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    });
  }

  clickLocation(element,index){
    this.locationLoader = true;
    this.locationStatus[index] = !this.locationStatus[index];
    if (element.locationLat && element.locationLong) {
          this.codeAddress(element.locationLat, element.locationLong, index);
        }
    else{
      this.locationLoader = false;
      this.driverProfile[index]['shortAddress'] = 'No Address Available';
    }
  }

  redirectToDriverView(element){
    this.route.navigate(['driver/view/', element.id, 'details']);
  }

  getInitials(name){
    return this.sharedService.getInitials(name);
  }

}
