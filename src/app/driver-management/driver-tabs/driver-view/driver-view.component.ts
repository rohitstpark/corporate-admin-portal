import { Component, OnInit } from '@angular/core';
import * as APIURL from '../../../common/config/api-endpoints';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../common/services/http.service';
import { sharedService } from '../../../common/services/shared.service';
import * as FILTERS from '../../../common/config/filters-datalist';
import * as moment from "moment";

@Component({
  selector: 'app-driver-view',
  templateUrl: './driver-view.component.html',
  styleUrls: ['./driver-view.component.css']
})
export class DriverViewComponent implements OnInit {
driverId:any;
driverProfile:any;
showLoader:boolean = false;
driverStatusList:any;

  constructor(private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    private sharedService: sharedService) { }

  ngOnInit() {
    this.driverStatusList = FILTERS.carrierFilters.statusList;
    this.activatedRoute.params.subscribe(params => {
      this.driverId = params.driverId;
      this.showLoader = true;
      this.getDriverDetails();
   });
  }
  getDriverDetails(){
    const url = APIURL.envConfig.DRIVERENDPOINTS.getDriverProfile+'?availabilityDate=12%2F15%2F2020&isLastShipment=1&isTotalShipments=1&driverId='+this.driverId;
    this.httpService.get(url).subscribe(resp => {
      if(resp['response']){
        this.showLoader = false;
        this.driverProfile = resp['response'];
        let _self = this;
        var status = this.driverStatusList.find(function (element) { 
            return element.id == _self.driverProfile['status']; 
        }); 
        const years = moment().diff(moment(this.driverProfile.workingSince),"years");
        const months = moment().diff(moment(this.driverProfile.workingSince),"months");
        const experience = this.driverProfile.workingSince ? (years + ' years ' + ((months%12)) + ' months') : '-';
        this.driverProfile['experience'] = experience;
        this.driverProfile['statusName'] = status.name;
        localStorage.setItem('driverName',this.driverProfile.name);
        localStorage.setItem('driverId',this.driverProfile.id);
        // localStorage.setItem('driverUserId',this.driverProfile.userId);
      }
    }, (err) => {
      this.showLoader = false;
      console.log('err', err)
    });
  }

  getInitials(name) {
    return this.sharedService.getInitials(name);
  }
}
