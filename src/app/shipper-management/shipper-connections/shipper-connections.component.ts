import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shipper-connections',
  templateUrl: './shipper-connections.component.html',
  styleUrls: ['./shipper-connections.component.css']
})
export class ShipperConnectionsComponent implements OnInit {
  shipperName:any;
  constructor() { }

  ngOnInit() {
    this.shipperName = localStorage.getItem('shipperName');
  }

  showName(event){
    this.shipperName = event;
  }

}
