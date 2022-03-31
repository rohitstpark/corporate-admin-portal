import { Component, OnInit, ViewChild } from '@angular/core';
// import {MatTableDataSource} from '@angular/material';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA ,} from '@angular/material/dialog';
// import { ControlPosition, MapsAPILoader } from '@agm/core';
import { MapsAPILoader } from '@agm/core';
import { DatePipe } from '@angular/common'
import * as moment from "moment";
import PlaceResult = google.maps.places.PlaceResult;
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import * as FILTERS from '../../common/config/filters-datalist';
import { ActivatedRoute, Router, Params} from '@angular/router';
import { HttpService } from '../../common/services/http.service';
import { sharedService } from '../../common/services/shared.service';
import { PopupComponent } from 'src/app/carrier-management/popup/popup.component'; 
import * as APIURL from '../../common/config/api-endpoints';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appearance, GermanAddress } from '@angular-material-extensions/google-maps-autocomplete';
import $ from 'jquery';
import * as _ from "lodash";
// import { timeStamp } from 'console';s
declare var _: _.groupBy;

@Component({
  selector: 'app-carrier-edit',
  templateUrl: './carrier-edit.component.html',
  styleUrls: ['./carrier-edit.component.css']
})
export class CarrierEditComponent implements OnInit {
status: boolean = false;
displayedColumns: string[] = ['transactionId', 'dateTime', 'subscriptionPlan', 'status', 'amount'];
dataSource : any = [];
carrierId:any;
panelOpenState:boolean;
showLoader:boolean=false;
laneDisabled:boolean=false;
skeletonLoader:boolean=false;
public certiOfInsuraExpired = false;
carrierProfile : any;
selectedFile:any;
public certiOfInExDatethire =false;
public searchCtrlValue:any;
selectedLanes : any=[];
public data:any={};
subscriptionDetail : any;
searchRestriction:any;
sameAsPhysicalAdd=false;
serverPathForUrl:any;
selected:any;
public page=1;
public currentDate:any;
// selectedIndus:any = ['value','id'];
public selectedAddress: PlaceResult;
public geoCoder:any;
public mediaTypeDoc:any;
preferredLanes:any='';
public addOption = false;
public disbu:boolean=false;
public totalLanes=0;
public certiOfInExDate :any;
public laneError:any;
public imagmessage:any;
public imgURL:any;
public lanLocation: number = 1;
public isDocument:any;
public imagePath:any;
carrierDocumentList: any = [];
editCompanyInfo: FormGroup;
editPersonalInfo: FormGroup;
editAddress:FormGroup;
editMCS:FormGroup;
equipmentLanesEdit:FormGroup;
equipmentType:string[]=[];
checkedEquipment:string[]=[];
uncheckedEquipment:string[]=[];
name:any;
public searchCtrl:any;
selectedEquipmentType:string[]=[];
statesList:any = [];
industries:any
selectedIndustry:any;
public checkValueLane = true;
searchBlank:any;
public backdropClass = "g-transparent-backdrop";
public sameLaneError='';
public laneList:any = [];
public locations: any[] = [
  {
   id : 1,
   pickUp:'',
   dropOff:''
  }
];
profileImage: any;
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

constructor(private activatedRoute: ActivatedRoute,
  private httpService: HttpService,
  private sharedService: sharedService,
  private mapsAPILoader: MapsAPILoader, 
  public datePipe: DatePipe,
  private router: Router,
  private fb: FormBuilder,
  public dialog: MatDialog,

  ) { }

ngOnInit() {
  this.searchRestriction = environment.searchRestriction;
  this.activatedRoute.params.subscribe(params => {
    this.currentDate= this.datePipe.transform(new Date(),"yyyy/MM/dd"); 
    this.statesList = FILTERS.carrierFilters.states;
    this.carrierId = params.carrierId;
    this.showLoader = true;
    this.certiOfInExDate = new Date();
    let days = 30;
    this.certiOfInExDate.setDate(this.certiOfInExDate.getDate() + days);
    this.certiOfInExDate = this.datePipe.transform(new Date(this.certiOfInExDate),"yyyy/MM/dd"); 
    this.getCarrierDetails();

 });
 this.serverPathForUrl = 'https://staticprod.laneaxis.com';
 this.getEquipmentType();
 this.getIndustries(null);
 this.getLanes();
 this.mapsAPILoader.load().then(() => {
  this.geoCoder = new google.maps.Geocoder;
});


}



getIndustries(searchStr:any)
{
  this.page = 1;
  
  var APIparams = this.getAPIParam(searchStr,'industries');
  // const url = APIURL.envConfig.CARRIERENDPOINTS.industries;
  this.httpService.get(APIparams).subscribe(resp => {
    if(resp['response'].allSicCode && resp['response'].allSicCode.length > 0 ){

      this.industries = _.groupBy(resp['response'].allSicCode, "section");
    }
    else{
      this.industries = [];
    }
    //   this.industries=[];
    //   let length=resp['response'].allSicCode.length;
    //   let i=0;
    //   for(i=0; i < length; i++)
    //   {
    //   this.industries.push(resp['response'].allSicCode[i]);
    // }}
  })
}




getEquipmentType()
{
  const url = APIURL.envConfig.CARRIERENDPOINTS.config;
  this.httpService.get(url).subscribe(resp => {
    if(resp){
      let length=resp['response'].equipmentTypes.length;
      let i=0;
      for(i=0; i < length; i++)
      {
        this.equipmentType.push(resp['response'].equipmentTypes[i]);
      }
    }
  })
}

getLanes()
{
  const url = APIURL.envConfig.CARRIERENDPOINTS.lanes;
  this.httpService.get(url).subscribe(resp => {
    if(resp){
      let length=resp['response'].allLane.length;
      let i=0;

      for(i=0; i < length; i++)
      {
        this.laneList.push(resp['response'].allLane[i]);
      }
    }
  })
}

getCarrierDetails(){
  const url = APIURL.envConfig.CARRIERENDPOINTS.getCarrierProfile + '?id=' + this.carrierId;
  this.httpService.get(url).subscribe(resp => {
    if(resp['response']){
      this.carrierProfile = resp['response'];
      
      this.carrierProfile.registrationDate = resp['response'].registrationDate ? new Date(resp['response'].registrationDate +' '+'UTC') : null;
      this.carrierProfile.firstLogin = resp['response'].firstLogin ? new Date(resp['response'].firstLogin +' '+'UTC') : null;
      this.carrierProfile.lastLogin = resp['response'].lastLogin ? new Date(resp['response'].lastLogin +' '+'UTC') : null;
      this.carrierProfile.createdAt = resp['response'].createdAt ? new Date(resp['response'].createdAt +' '+'UTC') : null;
      this.carrierProfile.updatedAt = resp['response'].updatedAt ? new Date(resp['response'].updatedAt +' '+'UTC') : null;
      localStorage.setItem('carrierName',this.carrierProfile.legalName);
      localStorage.setItem('userId',this.carrierProfile.userId);
      localStorage.setItem('carrierId',this.carrierProfile.id);
      this.carrierProfile.lane= resp['response'].lane;
      this.carrierProfile.laneId= resp['response'].laneId;
      this.searchCtrl=this.carrierProfile.usSic1987Description;
     
      if(this.carrierProfile.lane==0)
      {
        this.preferredLanes='preferred';
      }
      else
      {
        this.preferredLanes='all'
      }
      this.getDocumentsList();

      if(this.datePipe.transform(new Date(this.carrierProfile.insuranceCertificateExpireDate), "yyyy/MM/dd") > this.currentDate) {
        localStorage.setItem("certificateOfInsurance", this.carrierProfile.certificateOfInsurance);
        this.certiOfInsuraExpired=false;
    }else{
       localStorage.setItem("certificateOfInsurance", null);
       this.certiOfInsuraExpired=true;
    }}

    if(this.carrierProfile.insuranceCertificateExpireDate != null) {
      if(this.datePipe.transform(new Date(this.carrierProfile.insuranceCertificateExpireDate), "yyyy/MM/dd") < this.certiOfInExDate){
          this.certiOfInExDatethire=true;
      }else{
         this.certiOfInExDatethire=false;
      }
    }
    this.openEditForm();
    let showLane;
    let laneSelect;
    if(resp['response'].lane =='1'){
      showLane = '2';
      laneSelect='1';
      this.lanLocation  = 2;
      this.checkValueLane=false;
    }else{
      showLane = '1';
      laneSelect='0';  
      this.lanLocation  = 1;
      this.checkValueLane=true;
      this.checkSelectedLanes()
    } 

  }, (err) => {
    this.showLoader = false;
  });
}


checkSelectedLanes()
{
  if(this.carrierProfile.laneId && this.carrierProfile.laneId.length > 0){
    let newLo:any={};
    this.checkValueLane=false;
    if(this.carrierProfile.laneId.pickUp !="" && this.carrierProfile.laneId.dropOff !=""){
     this.addOption = true;
     this.locations=[];
     for(var i = 0; i < this.carrierProfile.laneId.length; i++) {
          let newLo = { 
              pickUp: this.carrierProfile.laneId[i].pickUp.toString(),
              dropOff: this.carrierProfile.laneId[i].dropOff.toString()                
           }
         this.locations.push(newLo);  
       }
     }
   }
}




getDocumentsList(){
  const url = APIURL.envConfig.CARRIERENDPOINTS.getDocumentList + '?limit=10&userId='
  + this.carrierProfile.userId + '&mediaType=CERTIFICATE_OF_INSURANCE';
  this.httpService.get(url).subscribe(resp => {
    this.showLoader = false;
    this.showLoader = false;
    if(resp['success'] && resp['response']['medias']){
      this.carrierDocumentList = resp['response']['medias'];
      this.carrierDocumentList.forEach(element => {
          let mediaUrl = element.mediaUrl.split('certificate_of_insurance/');
          element['docName'] = mediaUrl[1];
          element['isValid'] = moment(moment()).isBefore(element.detail.expiryDate);
      });
    }
    else{
      this.carrierDocumentList = [];
    }
    this.mediaTypeDoc=this.carrierDocumentList[0].mediaType;
    this.isDocument = resp['success'];

  }, (err) => {
    this.showLoader = false;
  });
}




openEditForm(){

  this.editCompanyInfo = this.fb.group({
    legalName: [this.carrierProfile.legalName,Validators.compose([Validators.required, Validators.maxLength(25)]),],
    dotNumber: [this.carrierProfile.dotNumber,Validators.compose([Validators.required, Validators.maxLength(7),Validators.pattern(/^([0-9]+\s?)*$/)]),],
    telephone: [this.carrierProfile.telephone,Validators.compose([Validators.required,Validators.maxLength(10),Validators.minLength(10),Validators.pattern(/^([0-9]+\s?)*$/)]),],
    emailAddress: [this.carrierProfile.emailAddress,Validators.compose([Validators.required])],
    hmFlag: [this.carrierProfile.hmFlag === "No" ? 0 : 1,],
    pcFlag: [this.carrierProfile.pcFlag === "No" ? 0 : 1,],
    dbaName: [this.carrierProfile.dbaName,Validators.compose([]),],
    fax: [this.carrierProfile.fax,Validators.compose([]),],
    einTaxId: [this.carrierProfile.einId,Validators.compose([]),],
    numberOfTrucks: [this.carrierProfile.truckTotal,Validators.compose([]),],
    numberOfDrivers: [this.carrierProfile.driverTotal,Validators.compose([]),],
    // registrationDate: [this.carrierProfile.registrationDate,Validators.compose([Validators.required]),],
    // firstLogin: [this.carrierProfile.firstLogin,Validators.compose([Validators.required]),],
    // lastLogin: [this.carrierProfile.lastLogin,Validators.compose([Validators.required]),],
    // createdAt: [this.carrierProfile.createdAt,Validators.compose([Validators.required]),],
    // updatedAt: [this.carrierProfile.updatedAt,Validators.compose([Validators.required]),],
    // id: [this.carrierProfile.id, Validators.compose([Validators.required]),],
    // userId: [this.carrierProfile.userId,Validators.compose([Validators.required]),],
    // emailOtp: [this.carrierProfile.emailOtp,Validators.compose([Validators.required]),],
    // phoneOtp: [this.carrierProfile.phoneOtp,Validators.compose([Validators.required]),],  
  });

  this.editPersonalInfo = this.fb.group({
    firstName: [this.carrierProfile.firstName,Validators.compose([Validators.required, Validators.maxLength(25)]),],
    lastName: [this.carrierProfile.lastName,Validators.compose([Validators.required, Validators.maxLength(15)]),],
  })

  this.editAddress =this.fb.group({
    // defaultAddress: [this.carrierProfile.defaultAddress,Validators.compose([Validators.required]),], 
    addressLine1: [this.carrierProfile.phyStreet,Validators.compose([Validators.required]),], 
    addressLine2: [this.carrierProfile.phyAddressLine2], 
    zipShort: [this.carrierProfile.phyZipShort,Validators.compose([Validators.required,Validators.maxLength(10),Validators.pattern(/^([0-9]+\s?)*$/)]),], 
    postalCode: [this.carrierProfile.phyZip,Validators.compose([Validators.required,Validators.maxLength(10),Validators.pattern(/^([0-9-]+\s?)*$/)]),],
    city: [this.carrierProfile.phyCity,Validators.compose([Validators.required]),], 
    state: [this.carrierProfile.phyState,Validators.compose([Validators.required]),], 
    country: [this.carrierProfile.phyCountry,Validators.compose([Validators.required]),], 
    mailAddLine1: [this.carrierProfile.mailingStreet,Validators.compose([Validators.required]),], 
    mailAddLine2: [this.carrierProfile.mailingAddressLine2], 
    mailZipshort: [this.carrierProfile.mailingZipShort,Validators.compose([Validators.required,Validators.maxLength(10),Validators.pattern(/^([0-9]+\s?)*$/)]),], 
    mailPostalCode: [this.carrierProfile.mailingZip,Validators.compose([Validators.required,Validators.maxLength(10),Validators.pattern(/^([0-9-]+\s?)*$/)]),],
    mailCity: [this.carrierProfile.mailingCity,Validators.compose([Validators.required]),], 
    mailState: [this.carrierProfile.mailingState,Validators.compose([Validators.required]),], 
    mailCountry: [this.carrierProfile.mailingCountry,Validators.compose([Validators.required]),],
  })

  if(this.carrierProfile.phyAddressLine2 == this.carrierProfile.mailingAddressLine2 && this.carrierProfile.mailingStreet == this.carrierProfile.phyStreet && this.carrierProfile.mailingZip == this.carrierProfile.phyZip)
  {
    this.sameAsPhysicalAdd=true;
  } 
  this.editMCS = this.fb.group({
    mcsDate: [this.carrierProfile.mcs150Date,Validators.compose([Validators.required])],
    mcsMileage: [this.carrierProfile.mcs150Mileage,Validators.compose([Validators.required])],
    mcsMileageYear: [this.carrierProfile.mcs150MileageYear,Validators.compose([Validators.required])]
  })

  // this.carrierProfile.carrierProfile.addDate = (this.carrierProfile.carrierProfile.addDate | date:'MMM d, y');

  
  this.equipmentLanesEdit =this.fb.group({
    operations: [this.carrierProfile.operationId.toString(),Validators.compose([Validators.required])],
    date: [this.carrierProfile.addDate,Validators.compose([Validators.required])],
    oicState: [this.carrierProfile.oicState,Validators.compose([Validators.required])],
    equipment: [this.carrierProfile.equipmentType,Validators.compose([Validators.required])],
    IndustryType: [this.carrierProfile.industries.toString(),Validators.compose([Validators.required])],
    // shipmentCredits: [this.carrierProfile.shipmentCredits,Validators.compose([Validators.required])],
  })
  // this.isEditEnabled=true;
  // this.selectedIndus=[{'value':this.carrierProfile.usSic1987Description}, {'id':this.carrierProfile.industries}];
  // this.industries=this.selectedIndus;




}

openDocument(url) {
  window.open(url, '_blank');
}

onFileSelected(event) {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    this.profileImage = file;
    const reader = new FileReader();
    reader.onload = function(e) {
          $('#imgFilter')
        .attr('src', e.target['result']);
    };
    reader.readAsDataURL(event.target.files[0]);
   }
 }

getInitials(name) {
  return this.sharedService.getInitials(name);
}

redirectToCarrierView(){
  this.router.navigate(['carrier/view/',this.carrierId,'details']);
}

autoLocation($event: GermanAddress) { 
    
  this.editAddress.get("addressLine1").setValue($event.displayAddress);
  this.editAddress.get("city").setValue($event.locality.long);
  this.editAddress.get("postalCode").setValue($event.postalCode);
  this.editAddress.get("state").setValue($event.state.long);
  // this.pickupFullLocation = $event.displayAddress;
  // this.pickupCity = $event.locality.long;
  // this.pickupState = $event.state.long;
  // this.pickupLatitude = $event.geoLocation.latitude;
  // this.pickupLongitude = $event.geoLocation.longitude;
  // this.sameLocation = false;
  // this.pickAutoNot=false;
  // this.pickupChangeDetected=false;

  // if(this.pickupCity != undefined){
  //   this.pickupShortName = this.pickupCity;
  // }else{
  //   if(this.pickupState){
  //     this.pickupShortName = this.pickupState;
  //   }else{
  //     this.pickupShortName = "";
  //   }
  // }

  // if(this.pickupShortName != ""){
  //   this.pickupShortName = this.pickupShortName + ", ";
  // }
  // if(this.pickupState != undefined){
  //   this.pickupShortName =  this.pickupShortName + this.pickupState;
  // } 
  // if(this.dropoffFullLoaction != null && this.pickupFullLocation != null         //Same location issue code
  //   && this.dropoffFullLoaction == this.pickupFullLocation) {
  //   this.sameLocation = true;
  // }

  // this.pickUp=$event.displayAddress; 
  // if($event.postalCode){
  //   this.shipmentForm.get("pickupPincode").setValue($event.postalCode); 
  // }else{
  //   this.shipmentForm.get("pickupPincode").setValue(""); 
  // }
  
  // if($event.state.long =="" || $event.state.long==undefined){
  //    this.pickupCityError="Please search state level address";
  //    this.disabledAssign=true;
  // }else{
  //    this.pickupCityError="";
  //     if(this.dropoffState==undefined || this.dropoffState==""){
  //       if(this.dropShortName !=null && this.dropShortName !=""){
  //         this.disabledAssign=false;              
  //       }else{
  //        this.disabledAssign=true; 
  //       }

  //    }else{
  //      this.disabledAssign=false;
  //    }
  // }
}

autoMailLocation($event: GermanAddress)
{
  this.editAddress.get("mailAddLine1").setValue($event.displayAddress);
  this.editAddress.get("mailCity").setValue($event.locality.long);
  this.editAddress.get("mailPostalCode").setValue($event.postalCode);
  this.editAddress.get("mailState").setValue($event.state.long);
}


onAutocompleteSelected(result: PlaceResult) {
  this.editAddress.get("addressLine1").setValue(result.formatted_address); 
  // for (let j = 0; j < result.address_components.length; j++) {
  //     if(result.address_components[j].types[0] == "administrative_area_level_2"){
  //          this.pickupCity = result.address_components[j].long_name;
  //     }
  //      if(result.address_components[j].types[0] == "administrative_area_level_1"){
  //         this.pickupState = result.address_components[j].long_name;
  //     }
  // }

// if(this.pickupCity==undefined){
//    this.pickupCityError="Please search city level address";
//    this.disabledAssign=true;
// }else{
//   this.pickupCityError="";
//   if(this.dropoffCity==undefined){
//       if(this.dropShortName !=null && this.dropShortName !=this.pickupShortName){
//         this.disabledAssign=false;              
//       }else{
//        this.disabledAssign=true; 
//       }

//    }else{
//      this.disabledAssign=false;
//    }
// }
// if(this.pickupCity !=undefined  && this.pickupState !=undefined){
//   this.pickupShortName= this.pickupCity + ", " + this.pickupState;        
// }
// this.pickUp=result.formatted_address;

}

setSameMailAddress(event)
{
  this.sameAsPhysicalAdd=event.checked;
  if(event.checked)
  {
    this.editAddress.get("mailAddLine1").setValue(this.editAddress.get("addressLine1").value);
    this.editAddress.get("mailCity").setValue(this.editAddress.get("city").value);
    this.editAddress.get("mailPostalCode").setValue(this.editAddress.get("postalCode").value);
    this.editAddress.get("mailState").setValue(this.editAddress.get("state").value);
  }
  else{
    this.editAddress.get("mailAddLine1").setValue('');
    this.editAddress.get("mailCity").setValue('');
    this.editAddress.get("mailPostalCode").setValue('');
    this.editAddress.get("mailState").setValue('');
  }
}

clickedDocument(type:any)
{
  if (type=='insurance')
  {
    window.open(this.carrierDocumentList[0].mediaUrl);
  }
}


onSubmit(form1,formName)
  {

    if(form1.status=='VALID'){
    let formData = new FormData();
    this.showLoader = true;
    const url = APIURL.envConfig.USERENDPOINTS.updateCarrier;
    formData.append('id', this.carrierProfile.id);

    // first form - companyInfo
    if(formName=='companyInfo'){

    const formVal = Object.assign({}, this.editCompanyInfo.value);
    formVal.mcsDate = this.datePipe.transform(formVal.mcsDate, "MM/dd/yyyy");
    
    if(this.profileImage){
      formData.append('profileImage', this.profileImage);
   }
   if(formVal.hmFlag)
   {
    formVal.hmFlag=1
   }
   else
   {
    formVal.hmFlag=0
   }

   if(formVal.pcFlag)
   {
    formVal.pcFlag=1
   }
   else
   {
    formVal.pcFlag=0
   }


   if(formVal.legalName != this.carrierProfile.legalName)
   formData.append('legalName', formVal.legalName);
   if(formVal.dotNumber != this.carrierProfile.dotNumber)
   formData.append('dotNumber', formVal.dotNumber);
   if(this.carrierProfile.email != formVal.emailAddress){
      formData.append('emailAddress', formVal.emailAddress);
   }
   if(this.carrierProfile.telephone != formVal.telephone){
    formData.append('telephone', formVal.telephone);
   }
   if(formVal.hmFlag != (this.carrierProfile.hmFlag === "No" ? 0 : 1)){
    formData.append('hmFlag', formVal.hmFlag);
   }
   if(formVal.pcFlag !=(this.carrierProfile.pcFlag === "No" ? 0 : 1)){
    formData.append('pcFlag', formVal.pcFlag);
   }
   if(this.carrierProfile.dbaName != formVal.dbaName){
    formData.append('dbaName', formVal.dbaName);
   }
   if(this.carrierProfile.fax != formVal.fax){
    formData.append('fax', formVal.fax);
   }
   if(this.carrierProfile.einId != formVal.einTaxId){
    formData.append('einId', formVal.einTaxId);
   }
   if(this.carrierProfile.truckTotal != formVal.numberOfTrucks){
    formData.append('truckTotal', formVal.numberOfTrucks);
   }
   if(this.carrierProfile.driverTotal != formVal.numberOfDrivers){
    formData.append('driverTotal', formVal.numberOfDrivers);
   }
  }
 // first form - editPersonalInfo
 if(formName=='editPersonalInfo'){
   const formVal = Object.assign({}, this.editPersonalInfo.value);

  if(this.carrierProfile.firstName != formVal.firstName){

   formData.append('firstName', formVal.firstName);
   }
    if(this.carrierProfile.lastName != formVal.lastName){

   formData.append('lastName', formVal.lastName);
   }

   }

     // first form - editAddress
     if(formName=='editAddress'){
      const formVal = Object.assign({}, this.editAddress.value);
     if(this.carrierProfile.phyStreet != formVal.addressLine1){
        formData.append('phyStreet', formVal.addressLine1);
     }
     if(this.carrierProfile.phyAddressLine2 != formVal.addressLine2){
      formData.append('phyAddressLine2', formVal.addressLine2);
     }
     if(this.carrierProfile.phyZipShort != formVal.zipShort){
      formData.append('phyZipShort', formVal.postalCode.toString().split('-')[0]);
     }

     if(this.carrierProfile.phyZip != formVal.postalCode){
      formData.append('phyZip', formVal.postalCode);
     }
     if(this.carrierProfile.phyCity != formVal.city){
      formData.append('phyCity', formVal.city);
     }
     if(this.carrierProfile.phyState != formVal.state){
      formData.append('phyState', formVal.state);
     }

     if(this.carrierProfile.mailingStreet != formVal.mailAddLine1){
      formData.append('mailingStreet', formVal.mailAddLine1);
   }
   if(this.carrierProfile.mailingAddressLine2 != formVal.mailAddLine2){
    formData.append('mailingAddressLine2', formVal.mailAddLine2);
   }
   if(this.carrierProfile.mailingZipShort != formVal.mailZipshort){
    formData.append('mailingZipShort', formVal.mailPostalCode.toString().split('-')[0]);
   }

   if(this.carrierProfile.mailingZip != formVal.mailPostalCode){
    formData.append('mailingZip', formVal.mailPostalCode);
   }
   if(this.carrierProfile.mailingCity != formVal.mailCity){
    formData.append('mailingCity', formVal.mailCity);
   }
   if(this.carrierProfile.mailingState != formVal.mailState){
    formData.append('mailingState', formVal.mailState);
   }
    }

      //  form - editMCS
      if(formName=='editMCS'){
        const formVal = Object.assign({}, this.editMCS.value);
        
        formVal.mcsDate = this.datePipe.transform(formVal.mcsDate, "MM/dd/yyyy");

       if(this.carrierProfile.mcs150Date != formVal.mcsDate){
          formData.append('mcs150Date', formVal.mcsDate);
       }
       if(this.carrierProfile.mcs150Mileage != formVal.mcsMileage){
        formData.append('mcs150Mileage', formVal.mcsMileage);
       }
       if(this.carrierProfile.mcs150MileageYear != formVal.mcsMileageYear){
        formData.append('mcs150MileageYear', formVal.mcsMileageYear);
       }
      }

         //  form - equipmentLanesEdit
         if(formName=='equipmentLanesEdit'){
          const formVal = Object.assign({}, this.equipmentLanesEdit.value);
          
          formVal.date = this.datePipe.transform(formVal.date, "MM/dd/yyyy");
  
         if(this.carrierProfile.industries != formVal.IndustryType.id){
            formData.append('industries', formVal.IndustryType.id);
            formData.append('usSic1987Description', formVal.IndustryType.value);
         }

         if(this.carrierProfile.carrierOperation != formVal.operations){
          formData.append('carrierOperation', formVal.operations);
       }
      
         if(this.carrierProfile.addDate != formVal.date){
          formData.append('addDate', formVal.date);
         }
         if(this.carrierProfile.oicState != formVal.oicState){
          formData.append('oicState', formVal.oicState);
         }

        //  selection on preferred lanes/all lanes
         let lanesdata;
        lanesdata=this.caBussiSerLaneSave();
    let laneValue;
    if(lanesdata.length > 0 && this.lanLocation==1){
      laneValue = JSON.stringify(lanesdata);
      formData.append('laneType', laneValue); 
      formData.append('lane', "0");  
    }else{
      if(this.lanLocation==2){
        laneValue ="";
        formData.append('lane', "1");  
      }else{
        laneValue ="";
        formData.append('lane', "");    
      }
    }

    // selection on equipment types 
         if(this.selectedEquipmentType.length>0)
         {
           let i;
           for (i=0;i<this.checkedEquipment.length;i++)
           {
            formData.append(this.checkedEquipment[i], "1");
           }
           for (i=0;i<this.uncheckedEquipment.length;i++)
           {
            formData.append(this.uncheckedEquipment[i], "0");
           }
         }
        }

     this.httpService.post(url, formData).subscribe(resp => {
      this.showLoader = false;
      if (resp['success']) {
        this.sharedService.openMessagePopup('Success - Profile Updated Successfully');
        this.getCarrierDetails();
        }
      }, (err) => {
        this.showLoader = false;
      });
    }
}

  lanesSelection(event)
  {
    this.preferredLanes=event;
if(this.preferredLanes=='all')
    this.lanLocation=2;
    else
    this.lanLocation=1;
  }


  

  checkOption(event,name,id){
    if(this.carrierProfile.laneValues !=null){
     }else{
      this.carrierProfile.laneValues=[];
    }

    let lane = this.laneList.filter((item) => item.id == event.value);
    let laneTypeData;
    if(name=="Pick"){
      laneTypeData ={ 
      'pickUpId':lane[0]['id'],
      'pickUpCity':lane[0]['laneCity']
      }
    }else{
     laneTypeData = { 
      'dropId':lane[0]['id'],
      'dropOffCity':lane[0]['laneCity']
      }
    }
    this.selectedLanes.push(laneTypeData);
     
    if(this.locations[event.source.id].pickUp == this.locations[event.source.id].dropOff){
      this.laneError = event.source.id;
      this.addOption = false; 
      this.checkValueLane=true; 
    }else if(this.locations[event.source.id].pickUp != null && this.locations[event.source.id].dropOff){
      this.addOption = true; 
      this.laneError = ""; 
      this.checkValueLane=false; 
    }else{     
      this.addOption = false;
      this.laneError = ""; 
      this.checkValueLane=true; 
    }
   
    for(let i=0;i<this.totalLanes;i++) {         //Same lane issue   
      if(this.locations[this.totalLanes].pickUp == this.locations[i].pickUp && this.locations[this.totalLanes].dropOff==this.locations[i].dropOff )
        {
          this.sameLaneError = event.source.id;    //show error in index(event.source.id)
          this.addOption = false; 
          this.checkValueLane=true; 
          break;  
      }else {
        this.sameLaneError = ""; 
        // this.addOption = false;
        // this.checkValueLane=false;
      }
    }
 

  }

  searchLane(searchStr:any){
    if(searchStr.length > 1 ){
      this.getLaneData(searchStr);      
     }else{
      this.getLaneData(null);           
     } 
   }

   searchIndustries(searchStr:any)
   {
    if(searchStr.length > 1 ){
      this.getIndustries(searchStr);      
     }else{
      this.getIndustries(null);           
     } 
   }


   getAPIParam(searchStr,type){
    let APIparams, params; 
      if(searchStr){
        if(type=='lanes'){
      params = {limit : 10 , page : this.page, search:searchStr}; 
      APIparams =  APIURL.envConfig.CARRIERENDPOINTS.lanes + "&page=" + params.page + "&search="+ params.search}
      if(type=='industries'){
      params = {limit : 10 , search:searchStr}; 
      APIparams=APIURL.envConfig.CARRIERENDPOINTS.industries  + "?search="+ params.search}
    }  
      else
     {
        
      if(type=='lanes'){  
      params = {limit : 10 , page : this.page};     
      APIparams = APIURL.envConfig.CARRIERENDPOINTS.lanes + "&page=" + params.page}
      if(type=='industries'){
      params = {limit : 10};     
      APIparams = APIURL.envConfig.CARRIERENDPOINTS.industries }
    }
  
    return APIparams; 
  }

   getLaneData(searchStr:any){
    let tempArray =[];
     this.page = 1;
     var APIparams = this.getAPIParam(searchStr,'lanes');
     this.httpService.get(APIparams).subscribe((ServerRes) => {
       if(ServerRes['response'].allLane && ServerRes['response'].allLane.length > 0){      
         //this.laneList= ServerRes.response.allLane;
         tempArray = ServerRes['response'].allLane;
         if(this.carrierProfile.laneValues && this.carrierProfile.laneValues.length > 0){
           let newLo = {};
           for(var i = 0; i < this.carrierProfile.laneValues.length; i++) {           
             if(this.carrierProfile.laneValues[i].pickUpId !=null){
               newLo = { 
                "id" : this.carrierProfile.laneValues[i].pickUpId,
                "laneCity" : this.carrierProfile.laneValues[i].pickUpCity,          
               }

               tempArray.push(newLo);
             }
             if(this.carrierProfile.laneValues[i].dropId !=null){

               newLo = { 
                 "id" : this.carrierProfile.laneValues[i].dropId,
                 "laneCity" : this.carrierProfile.laneValues[i].dropOffCity,          
               }
               tempArray.push(newLo);   
               }
          }
         this.laneList = tempArray.filter((s => a => !s.has(a.id) && s.add(a.id))(new Set));
       }else{
        this.laneList=ServerRes['response'].allLane;
       }
     }else{
       if(this.carrierProfile.laneValues && this.carrierProfile.laneValues.length > 0){
           let newLo = {};
           for(var i = 0; i < this.carrierProfile.laneValues.length; i++) {
           if(this.carrierProfile.laneValues[i].pickUpId !=null){
             newLo = { 
             "id" : this.carrierProfile.laneValues[i].pickUpId,
             "laneCity" : this.carrierProfile.laneValues[i].pickUpCity,          
             }
            tempArray.push(newLo);
           }
           if(this.carrierProfile.laneValues[i].dropId !=null){ 
             newLo = { 
               "id" : this.carrierProfile.laneValues[i].dropId,
               "laneCity" : this.carrierProfile.laneValues[i].dropOffCity,          
             }
             tempArray.push(newLo);   
           }
           }          
         this.laneList = tempArray.filter((s => a => !s.has(a.id) && s.add(a.id))(new Set));
         }else{
         this.laneList = [];            
         }
       }
     });
 }

 addLocation() {
  this.locations.push({
  id: this.locations.length + 1,
  pickUp: '',
  dropOff: '',
  });
  this.addOption=false; 
  this.checkValueLane=true;
  this.totalLanes=this.totalLanes+1;
}

removeLocation(i: number) {
  this.locations.splice(i, 1);
  for(let i=0;i< this.locations.length; i++) {
    if(this.locations[i].pickUp && this.locations[i].dropOff){
      this.addOption=true; 
      this.checkValueLane=false;
    }else{
      this.addOption=false; 
      this.checkValueLane=true;
     break;
    }
  }
}

checkLaneShowHide(event){
   if(event=="1"){
    this.lanLocation=2;
    //this.addOption=true;
    this.checkValueLane=false;
   }else{
    if(this.carrierProfile.laneValues !=null){
       this.lanLocation=1; 
       this.checkValueLane=false;
      // this.addOption=false; 
     }else{ 
       this.lanLocation=1; 
       this.checkValueLane=true;
       //this.addOption=false;         
    }
   }
}


changeEquipment(event)
{
this.selectedEquipmentType=event.value;
this.uncheckedEquipment=this.equipmentType;
let i,j;
for(i=0;i<this.equipmentType.length;i++)
{
  for(j=0;j<this.selectedEquipmentType.length;j++)
  {
    if(this.selectedEquipmentType[j]==this.equipmentType[i])
   { 
     this.checkedEquipment=this.selectedEquipmentType;
     this.uncheckedEquipment=this.uncheckedEquipment.filter(e => e !== this.selectedEquipmentType[j]);
    break;
  }
  }
}
}


/*Update carrier business information */  
  caBussiSerLaneSave(){    

    let laneType = [];
    for(let i = 0; i < this.locations.length; i++) {
      if(this.locations[i].pickUp !="" && this.locations[i].dropOff !=""){
        if(this.locations[i].pickUp != this.locations[i].dropOff){        
        let newLanType = {
            'pickUp':this.locations[i].pickUp,
            'dropOff':this.locations[i].dropOff
          }
         laneType.push(newLanType);
        }else{
        this.laneError = i.toString();
        this.addOption=false; 
        return false;
        }
      }
    }
  
    return laneType;
    }

    userPopupConfirm(type:any,title:any,contain:any,documentType:any,id:any){
      const dialogRef = this.dialog.open(PopupComponent,{
      disableClose: true,
      backdropClass: this.backdropClass,
      width:"450px",    
      data: {openPop: type, title:title, contain:contain, documentType:documentType, id:id}
      });
      dialogRef.afterClosed().subscribe(result => {
       if(result.event=="OK"){
           this.removeDocument(documentType,id);
           this.getDocumentsList();
       }
      });
    }


    removeDocument(documentType:any, id:any){
      // Stoping event Propogation 
     this.showLoader = true;
     const formData = new FormData();
     const url = APIURL.envConfig.USERENDPOINTS.updateCarrier;
     formData.append('id', id);
     formData.append('removeDoc', documentType);
       this.httpService.post(url, formData).subscribe(resp => {
        if (resp['success']) {
            if(documentType=="liabilityDoc"){
              this.carrierProfile.liabilityDocument ="";
            }
            if(documentType=="compensationDoc"){
              this.carrierProfile.compensationDocument ="";
            }
         this.showLoader=false;
          this.sharedService.openMessagePopup('Success - Profile Updated Successfully');
          }
        }, (err) => {
          this.showLoader = false;
        });
       } 
   
   
    
   userPopup(type:any,userDetail:any){
    const dialogRef = this.dialog.open(PopupComponent,{
      disableClose: true,
      backdropClass: this.backdropClass,
      width:"670px",		
      data: {openPop: type,id:userDetail.id}
      });
      dialogRef.afterClosed().subscribe(result => {
       if(result.event=="Ok"){
           }
      });
      this.getCarrierDetails();
      this.getDocumentsList();
  }

    checkIndustOption(event){
      this.searchCtrl=event.value.value; 
      this.searchCtrlValue=event.value;
    }

    searchIndustry(searchStr:any){
      if(searchStr.length > 1 ){
        this.getIndustries(searchStr);      
      }else{
        this.getIndustries(null);           
      }
    }

    clearIndurties(){
      if(this.carrierProfile.industries){
  
      }else{
        this.searchCtrl=null;
      }
      this.searchBlank=null;
      this.getIndustries(null);
    }

    cancel(){

    }
    closePopup(){

    }
    donePopup(){

    }
    openDialogBox(){
      
    }
    
}
