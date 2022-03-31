import { Component, OnInit,Inject ,Injectable , ChangeDetectorRef } from '@angular/core';
import {  MatDialog, MatDialogRef, MAT_DIALOG_DATA ,} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as APIURL from '../../common/config/api-endpoints';
import { HttpService } from '../../common/services/http.service';
import { sharedService } from '../../common/services/shared.service';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';



export interface DialogData {
  openPop:any;
  contain: any;
  title: any;
  buttontext:any;
  successMeg:any;
  status:any;
  driverName:any;
  name:any;
  expiredDate:any;
  date:any;
  documentUrl:any;
  documentId:any;
  id:any;
  documentType:any;
  userDetail:any;
}


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})


export class PopupComponent implements OnInit {

  public workerCompensationForm : FormGroup;
public generalLiabilityForm : FormGroup;
public certifcateVerify : FormGroup;
public imgURL:any;
public imagmessage:any;
public imagePath:any;
public loading = false;
public disbu:any;
public name:any;
public minDateBefore=new Date();

constructor(
  public dialogRef: MatDialogRef<PopupComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: DialogData,
  public dialog: MatDialog ,
  private formBuilder: FormBuilder,
  private router: Router,
  private http: HttpClient,
  private sharedService: sharedService,
  private httpService: HttpService,
  private datePipe: DatePipe, 
)
{}
 

 
 ngOnInit() {   

  this.generalLiabilityForm = this.formBuilder.group({
    generalLiability: ['', [Validators.required]],
  }); 

  this.workerCompensationForm = this.formBuilder.group({
    workerCompensation: ['', [Validators.required]],
  });
  
  this.certifcateVerify = this.formBuilder.group({
    certificate: ['', [Validators.required]],
    insurance_expiry_date: ['', [Validators.required]]
  });

   }


   // worker compenstion
  onSelectedFileGeneral(event) {
    if(event.target.files.length === 0)
      return;
    var mimeType = event.target.files[0].type;
    if(mimeType.match(/pdf\/*/) == null) {
      this.imagmessage = "Only supported pdf file.";
      this.imgURL="";
      return;
    }
    var reader = new FileReader();
    this.imagePath = event.target.files;
    this.name=event.target.files[0].name;
    this.disbu=false;
    reader.readAsDataURL(event.target.files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
    this.imagmessage = '';
    if(event.target.files.length ) {
      const file = event.target.files[0];
      this.generalLiabilityForm.get('generalLiability').setValue(file);
    } 
  }

  closePopup(){
    this.dialogRef.close({event:"close"});
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('userProfile_sugBox');
  }

    /*upload worker compensation*/
    generalLiabilitySave({value, valid}){
      if(valid){
        this.loading=true;
        const formData = new FormData();
        formData.append('mediaLiabilityDoc', this.generalLiabilityForm.get('generalLiability').value);
        formData.append('mediaType', 'LIABILITY_DOCUMENT');
        const url = APIURL.envConfig.USERENDPOINTS.updateCarrier;
        formData.append('id', this.data.id);
        
  
    this.httpService.post(url, formData).subscribe(resp => {
     if (resp['success']) {
      this.loading=false;
      this.dialogRef.close({event:"Ok"});
       this.sharedService.openMessagePopup('Success - Profile Updated Successfully');
       }
     }, (err) => {
       this.loading = false;
     });
    }
    this.closePopup();
  }

   /*Upload certificate of insurance*/
   certifcateUpload({value, valid}){
    if(valid){
      this.loading=true;
      const formData = new FormData();
      let expiryDate = this.datePipe.transform(new Date(value.insurance_expiry_date),"MM/dd/yyyy");
      formData.append('mediaCoi', this.certifcateVerify.get('certificate').value);
      formData.append('coiExpiryDate', expiryDate);
      formData.append('id', this.data.id);
      // formData.append('mediaType', 'CERTIFICATE_OF_INSURANCE');
      const url = APIURL.envConfig.USERENDPOINTS.updateCarrier;
      this.httpService.post(url, formData).subscribe(resp => {
     if (resp['success']) {
      this.loading=false;
      this.dialogRef.close({event:"Ok"});
       this.sharedService.openMessagePopup('Success - Profile Updated Successfully');
       
       }
     }, (err) => {
       this.loading = false;
     });
    }
    this.closePopup();
  }
  
    // certifcate insurace 
    onSelectedFileCertifcate(event) {
      if(event.target.files.length === 0)
        return;
      var mimeType = event.target.files[0].type;
      if(mimeType.match(/pdf\/*/) == null) {
        this.imagmessage = "Only supported pdf file.";
        this.imgURL="";
        return;
      }
      var reader = new FileReader();
      this.imagePath = event.target.files;
      this.name=event.target.files[0].name;
      this.disbu=false;
      reader.readAsDataURL(event.target.files[0]); 
      reader.onload = (_event) => { 
        this.imgURL = reader.result; 
      }
      this.imagmessage = '';
      if(event.target.files.length ) {
        const file = event.target.files[0];
        this.certifcateVerify.get('certificate').setValue(file);
      } 
    }
  
    /*upload worker compensation*/
    workerCompensationSave({value, valid}){
    
      if(valid){
        this.loading=true;
        const formData = new FormData();
        formData.append('mediaCompensationDoc', this.workerCompensationForm.get('workerCompensation').value);
        formData.append('mediaType', 'COMPENSATION_DOCUMENT');
        const url = APIURL.envConfig.USERENDPOINTS.updateCarrier;
        formData.append('id', this.data.id);
        
  
    this.httpService.post(url, formData).subscribe(resp => {
     if (resp['success']) {
      this.loading=false;
      this.dialogRef.close({event:"Ok"});
       this.sharedService.openMessagePopup('Success - Profile Updated Successfully');
      
       }
     }, (err) => {
       this.loading = false;
     });
    }
    this.closePopup();
  }


  // worker compenstion
  onSelectedWorkerCompensation(event) {
    if(event.target.files.length === 0)
      return;
    var mimeType = event.target.files[0].type;
    if(mimeType.match(/pdf\/*/) == null) {
      this.imagmessage = "Only supported pdf file.";
      this.imgURL="";
      return;
    }
    var reader = new FileReader();
    this.imagePath = event.target.files;
    this.name=event.target.files[0].name;
    this.disbu=false;
    reader.readAsDataURL(event.target.files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
    this.imagmessage = '';
    if(event.target.files.length ) {
      const file = event.target.files[0];
      this.workerCompensationForm.get('workerCompensation').setValue(file);
    } 
  }

  donePopup(){
    this.dialogRef.close({event:"OK"});
  }
}

