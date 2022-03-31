import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/common/services/http.service';

@Component({
  selector: 'app-phone-lookup',
  templateUrl: './phone-lookup.component.html',
  styleUrls: ['./phone-lookup.component.css']
})
export class PhoneLookupComponent implements OnInit {
  
  phoneNumber:any='';
  nationalFormat:any='';
  countryCode:any='';
  callerName:any='';
  callerType:any='';
  carrierName:any='';
  carrierType:any='';
  mobileCountryCode:any='';
  mobileNetworkCode:any='';
  APIurl:any;
  errormsg:any;

  validationActive:boolean=false;
  ifSubmit:boolean=false;
  success:boolean=false;
  showLoader = false;

  info:any;
  NumberDetailForm= new FormGroup({
    number: new FormControl(),
    carrierID:new FormControl(),
    callerName: new FormControl()
  })


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService:HttpService,
  ) { }

  ngOnInit() {
    {
      this.NumberDetailForm=this.fb.group({
        number:['', Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(10)]),], 
        carrierID:[],
        callerName:[]
      })
    }
    
  }

  back()
  {
    {
      this.router.navigate(['lookup']);
     }
  }

  updateDetails()
  {
    this.validationActive=true;
    if(this.NumberDetailForm.status=='VALID')
    {
    this.info = this.NumberDetailForm.value;
    let phone=this.info.number;
    let type;
    if(this.info.carrierID && this.info.callerName)
    type="both";

    if(this.info.carrierID && !this.info.callerName)
    type="carrier";

    if(!this.info.carrierID && this.info.callerName)
    type="callerName";
    
    if(phone)
    {
    this.showLoader=true;
    }
    let payload={"phone":phone,"type":type};
    this.APIurl="";
    this.APIurl=this.APIurl+"lookup/check-phone";

    if(this.info.number!="" && this.info.number!=null)
    {
      this.ifSubmit=true;
   
    this.httpService.post(this.APIurl,payload).subscribe(resp => 
      {
      this.info=resp; 
      console.log(this.info);

     if(this.info.success){
       this.showLoader=false;
       this.success=true;
       console.log('this.phoneNumber');
       console.log(this.phoneNumber);
      this.phoneNumber=this.info.response.phoneNumber;
      this.nationalFormat=this.info.response.nationalFormat;
      this.countryCode=this.info.response.countryCode;

      if(type=='callerName' || type=='both'){
      this.callerName=this.info.response.callerName.caller_name;
      this.callerType=this.info.response.callerName.caller_type;
      }
      else 
      {
        this.callerName='';
        this.callerType='';
      }

      if(type=='carrier' || type=='both'){
      this.carrierName=this.info.response.carrier.name;
      this.carrierType=this.info.response.carrier.type;
      this.mobileCountryCode=this.info.response.carrier.mobile_country_code;
      this.mobileNetworkCode=this.info.response.carrier.mobile_network_code;
      }
      else 
      {
      this.carrierName='';
      this.carrierType='';
      this.mobileCountryCode='';
      this.mobileNetworkCode='';

      }
     }
    // else{
    //  this.success=false;
    //  this.showLoader=false;
    // }
    }, 
    (err) => {
      this.showLoader=false;
      console.log(err);
      if(err.status="404"){
      this.success=false;
      this.errormsg = err.error.message;
      }
    }
 );
  }}
  if(this.NumberDetailForm.status=='INVALID')
  {
    this.ifSubmit=false;
  }

  


  }}
