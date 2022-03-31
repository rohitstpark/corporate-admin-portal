import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpService } from '../../common/services/http.service';
import * as APIURL from '../../common/config/api-endpoints';
import * as FILTERS from '../../common/config/filters-datalist';
import * as moment from "moment";
import { sharedService } from '../../common/services/shared.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
@Component({
  selector: 'app-add-dot-number',
  templateUrl: './add-dot-number.component.html',
  styleUrls: ['./add-dot-number.component.css']
})
export class AddDotNumberComponent implements OnInit {
  filterForm: FormGroup;
  statesList:any = [];
  showLoader:boolean=false;

  constructor( private fb: FormBuilder, private router: Router, private httpService: HttpService,private sharedService: sharedService) { }

  ngOnInit() {
    this.statesList = FILTERS.carrierFilters.states;
    this.setFormControls();
  }

  setFormControls() {
    this.filterForm = this.fb.group({
      dotNumber:["",[Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      legalName:["", Validators.required],
      dbaName:[""],
      telephone:[""],
      phyCountry:[""],
      phyCity:[""],
      phyState:[""],
      phyStreet:[""],
      phyZip:[""],
      mailingCountry:[""],
      mailingZip:[""],
      mailingState:[""],
      mailingCity:[""],
      mailingStreet:[""],
      email:[""],
      mcs150MileageYear:[""],
      mcs150Date:[""],
      carrierOperation:[""],
      hmFlag:[""],
      pcFlag:[""],
      driverTotal:[""],
      truckTotal:[""],
      informToEmail:[""]
    });
    }

  saveDotNumber(){
    if(this.filterForm.valid){
      this.showLoader = true;
      const formValues = this.filterForm.value;
      console.log(formValues)
      let date = formValues.mcs150Date ? moment(formValues.mcs150Date).format("DD/MM/YYYY") : '';
      const reqBody = {
        dotNumber:formValues.dotNumber,
        legalName:formValues.legalName,
        dbaName:formValues.dbaName,
        telephone:formValues.telephone,
        phyCountry:formValues.phyCountry,
        phyCity:formValues.phyCity,
        phyState:formValues.phyState,
        phyStreet:formValues.phyStreet,
        phyZip:formValues.phyZip,
        mailingCountry:formValues.mailingCountry,
        mailingZip:formValues.mailingZip,
        mailingState:formValues.mailingState,
        mailingCity:formValues.mailingCity,
        mailingStreet:formValues.mailingStreet,
        email:formValues.email,
        mcs150MileageYear:formValues.mcs150MileageYear,
        mcs150Date:date,
        carrierOperation:formValues.carrierOperation,
        hmFlag:formValues.hmFlag,
        pcFlag:formValues.pcFlag,
        driverTotal:formValues.driverTotal,
        truckTotal:formValues.truckTotal,
        informToEmail:formValues.informToEmail
      }
      const url = APIURL.envConfig.CARRIERENDPOINTS.addDOTNumber;
      this.httpService.post(url,reqBody).subscribe(resp => {
        this.showLoader = false;
        if(resp['success']){
          this.sharedService.openMessagePopup('Success - DOT Number Created Successfully');
          // this.filterForm.reset();
          // this.filterForm.markAsPristine();
        } 
        else{
          this.sharedService.openMessagePopup('Error - ' +resp['message']);
        }
      }, (err) => {
        this.showLoader=false;
        console.log('err', err)
        this.sharedService.openMessagePopup('Error - ' +err['message']);
      })
    }

  }

  cancel(){
    this.router.navigate(['carrier']);
  }

}
