import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from "moment";
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
// import { MatTableDataSource } from '@angular/material';
import { DriversComponent } from '../../common/tabs/drivers/drivers.component';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {
	status: boolean = false;
  @ViewChild(DaterangepickerDirective, { static: false }) pickerDirective: DaterangepickerDirective;

  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }

  filterToggleEvent() {
    this.status = !this.status;
  }

  constructor() { }

  ngOnInit() {
  }

}