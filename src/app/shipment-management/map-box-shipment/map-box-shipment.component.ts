import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map-box-shipment',
  templateUrl: './map-box-shipment.component.html',
  styleUrls: ['./map-box-shipment.component.css']
})
export class MapBoxShipmentComponent implements OnInit {

  @Input() driverProfile: any;
  public  end:any;
  public start:any;
  //public map:any;
  // public map : mapboxgl.Map;
  //public style = 'mapbox://styles/mapbox/streets-v11';
  constructor() {
        mapboxgl.accessToken = 'pk.eyJ1IjoibGFuZWF4aXMiLCJhIjoiY2tidnZma2VpMGEydzJ0bnFvdjdvejFmMiJ9.A8iCJZIH4tL1IlmM3mTQHA';
        //mapboxgl.accessToken;
   }

  ngOnInit() {
  }

  public ngAfterViewInit(){
      if((this.driverProfile.locationLat !=undefined && this.driverProfile.locationLong !=undefined)){
        this.showUserLocation(this.driverProfile.locationLat, this.driverProfile.locationLong);  
      }
  }
 
  public ngOnChanges(changes: SimpleChanges){  
    if(changes["driverProfile"] && !changes["driverProfile"].isFirstChange()){
       if(changes["driverProfile"]['currentValue'] !=undefined){
         this.showUserLocation(this.driverProfile.locationLat, this.driverProfile.locationLong);  
       }          
      
    } 
  }
  showUserLocation(latitude:any, longitude:any){
          console.log(longitude,latitude);
           let map = new mapboxgl.Map({
              container: 'map',
              style: 'mapbox://styles/mapbox/streets-v11',
              center: [longitude, latitude],
              zoom: 9.12
              // center:[12.550343, 55.665957],
          });
                        // create a DOM element for the marker
          let el = document.createElement('map');

          // adding a class
          el.className = 'marker';

          //user profile image
          el.style.backgroundImage =  "url("+this.driverProfile.profileImage+")";


          //of image
          el.style.width = '100px';
          el.style.height = '100px';

          // add marker to map
          new mapboxgl.Marker(el)
              .setLngLat([longitude, latitude])
              .addTo(map);
  }

}

