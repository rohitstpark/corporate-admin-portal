import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carrier-drivers',
  templateUrl: './carrier-drivers.component.html',
  styleUrls: ['./carrier-drivers.component.css']
})
export class CarrierDriversComponent implements OnInit {
  carrierName:any;
  constructor() { }

  ngOnInit() {
  }

  showName(event){
    this.carrierName = event;
  }

}
