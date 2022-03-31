import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-driver-tab',
  templateUrl: './driver-tab.component.html',
  styleUrls: ['./driver-tab.component.css']
})
export class DriverTabComponent implements OnInit {
	driverId:any;
	
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.driverId = params.driverId;
   });
  }

}
