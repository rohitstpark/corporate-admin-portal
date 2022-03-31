import { Component, OnInit } from '@angular/core';
import * as moment from "moment";

import { ShipmentsComponent } from '../../../common/tabs/shipments/shipments.component';

@Component({
  selector: 'app-driver-shipment',
  templateUrl: './driver-shipment.component.html',
  styleUrls: ['./driver-shipment.component.css']
})
export class DriverShipmentComponent implements OnInit {
  driverName:any;
  constructor() { }

  ngOnInit() {
  }

  showName(event){
    this.driverName = event;
  }

}
