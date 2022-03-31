import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shipment-tabs',
  templateUrl: './shipment-tabs.component.html',
  styleUrls: ['./shipment-tabs.component.css']
})
export class ShipmentTabsComponent implements OnInit {
  shipmentId:any;
  @Input() shipperId:any;

  constructor( private activatedRoute: ActivatedRoute ) { }

  ngOnInit() {
  	this.activatedRoute.params.subscribe(params => {
      this.shipmentId = params.shipmentId;
     });
     if(this.shipperId == undefined){ //only for refresh case
       this.shipperId = localStorage.getItem('shipmentShipperId');
     }
  }

}
