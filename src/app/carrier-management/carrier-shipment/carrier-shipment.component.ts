import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carrier-shipment',
  templateUrl: './carrier-shipment.component.html',
  styleUrls: ['./carrier-shipment.component.css']
})
export class CarrierShipmentComponent implements OnInit {
  carrierName:any;
  constructor() { }

  ngOnInit() {
  }

  showName(event){
    this.carrierName = event;
  }

}
