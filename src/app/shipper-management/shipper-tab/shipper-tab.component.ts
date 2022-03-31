import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { DetailComponent } from './detail/detail.component';

@Component({
  selector: 'app-shipper-tab',
  templateUrl: './shipper-tab.component.html',
  styleUrls: ['./shipper-tab.component.css']
})
export class ShipperTabComponent implements OnInit {
  shipperId:any;
  @Input() carrierName;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.shipperId = params.shipperId;
   });
  }

}
