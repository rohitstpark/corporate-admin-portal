import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from "moment";
import * as APIURL from '../../common/config/api-endpoints';
import { HttpService } from '../../common/services/http.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AlertMessageComponent } from '../../common/alert-message/alert-message.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class sharedService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  private API_ENDPOINT = environment.apiEndpoint;

  userUpdate$ = new Subject<string>();
  constructor(private httpService: HttpService, private httpClient: HttpClient,
    private snackBar: MatSnackBar) { }

    
  getInitials(name?:any){
    let acronym;
    let specialChar;         
    let countLength;              
    if (name) {
        acronym = name.split(/\s/).reduce((response:any, word:any) => response += word.slice(0, 1), '');
        countLength = acronym.length;
        if (countLength === 1) {
            acronym = name.substr(0, 2);
        } else if (countLength >= 2) {
            specialChar = acronym.substr(2, 1);
            acronym = acronym.substr(0, 2).replace(/[^\w\s]/gi, specialChar);
        }
    } else
        acronym = '';
    return acronym;
    

    // // let acronym;
    // if(name){
    // acronym = name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'');
    // if(acronym && acronym.length >= 2)
    //  {
    //       acronym = acronym.substr(0,2);
    //  }
    // }
    //   else { 
    //     acronym = '';
    //   } 
    // return acronym;
  }

  setFormControlBasedOnQueryParams(params:any, filterForm:any){
      const paramsKeys =  Object.keys(params);
      console.log('url params');
      console.log(params);
      const paramsValues: any =  Object.values(params);
      paramsKeys.forEach((element, index) => {
        if(filterForm.controls[element])
        {
          if((element.indexOf('Date') >= 0)){
            const splitValues = paramsValues[index].split('-');
            filterForm.controls[element].setValue(
              {start: moment(splitValues[0]), end: moment(splitValues[1])});
          }
          else if(element == 'equipmentType'){
            const splitValues = parseInt(paramsValues[index].split(','));
            console.log('splitvalues');
            console.log(splitValues);
            filterForm.controls[element].setValue(splitValues);
          }
          else {
            filterForm.controls[element].setValue(paramsValues[index]);
          }
        }
      });
  }

  setFormControlBasedOnQueryParamsForDispute(params:any, filterForm:any){
    const paramsKeys =  Object.keys(params);
    const paramsValues: any =  Object.values(params);
    paramsKeys.forEach((element, index) => {
      if(filterForm.controls[element])
      {
        if((element.indexOf('Date') >= 0)){
          const splitValues = paramsValues[index].split('-');
          filterForm.controls[element].setValue(
            {start: moment(splitValues[0]), end: moment(splitValues[1])});
        }
        else if(element == 'driverName'){
          console.log('driver')
          filterForm.controls['driver'].setValue(paramsValues[index])
          // const splitValues = paramsValues[index].split(',');
          // filterForm.controls[element].setValue(splitValues);
        }
        else {
          filterForm.controls[element].setValue(paramsValues[index]);
        }
      }
    });
}


  getUserIdAndName(carrierId:any): Observable<any[]>{
    const url = APIURL.envConfig.CARRIERENDPOINTS.getCarrierProfile + '?id=' + carrierId;
    return this.httpClient.get(this.API_ENDPOINT + url)
    .pipe(map((res: any) => res),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  getDriverUserIdAndName(driverId:any): Observable<any[]>{
    const url = APIURL.envConfig.DRIVERENDPOINTS.getDriverProfile+'?availabilityDate=12%2F15%2F2020&isLastShipment=1&isTotalShipments=1&driverId='+ driverId;
    return this.httpClient.get(this.API_ENDPOINT + url)
    .pipe(map((res: any) => res),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  
  getShipmentIdAndName(shipmentId:any): Observable<any[]> {
    const url = APIURL.envConfig.SHIPMENTENDPOINTS.getShipmentDetails + '?id=' + shipmentId;
    return this.httpClient.get(this.API_ENDPOINT + url)
    .pipe(map((res: any) => res),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  getShipperIdAndName(shipperId:any){
    const url = APIURL.envConfig.SHIPPERENDPOINTS.getShipperProfile + '?id=' + shipperId;
    return this.httpClient.get(this.API_ENDPOINT + url)
    .pipe(map((res: any) => res),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  updateDisputeSharedService(reqBody:any){
    const url = APIURL.envConfig.DISPUTEENDPOINTS.updateDispute;
    return this.httpClient.post(this.API_ENDPOINT + url, reqBody)
    .pipe(map((res: any) => res),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  openMessagePopup(msg:any) {
    this.snackBar.openFromComponent(AlertMessageComponent, {
      data:msg,
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
