import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dispute-tabs',
  templateUrl: './dispute-tabs.component.html',
  styleUrls: ['./dispute-tabs.component.css']
})
export class DisputeTabsComponent implements OnInit {
  shipmentId:any;
  @Input() shipperId:any;

  constructor( private activatedRoute: ActivatedRoute ) { }

  ngOnInit() {
  	this.activatedRoute.params.subscribe(params => {
      this.shipmentId = params.shipmentId;
     });
  }

}
