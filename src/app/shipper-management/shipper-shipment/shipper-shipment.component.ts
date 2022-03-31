import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shipper-shipment',
  templateUrl: './shipper-shipment.component.html',
  styleUrls: ['./shipper-shipment.component.css']
})
export class ShipperShipmentComponent implements OnInit {
  shipperName:any;
  constructor() { }

  ngOnInit() {
  }

  showName(event){
    this.shipperName = event;
  }

}
