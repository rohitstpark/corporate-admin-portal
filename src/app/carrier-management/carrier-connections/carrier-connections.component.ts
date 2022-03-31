import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carrier-connections',
  templateUrl: './carrier-connections.component.html',
  styleUrls: ['./carrier-connections.component.css']
})
export class CarrierConnectionsComponent implements OnInit {
  carrierName:any;
  constructor() { }

  ngOnInit() {
    this.carrierName = localStorage.getItem('carrierName');
  }

  showName(event){
    this.carrierName = event;
  }

}
