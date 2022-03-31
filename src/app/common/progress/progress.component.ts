import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shipment-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
  @Input() bgClass:any;
  @Input() statusCount:any;
  constructor() { }

  ngOnInit() {
  }

}
