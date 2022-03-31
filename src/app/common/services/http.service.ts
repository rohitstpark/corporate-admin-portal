import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  // private API_ENDPOINT =APIURL.envConfig.apiEndpoint;
  private API_ENDPOINT = environment.apiEndpoint;

  constructor(
    private router: Router,
    private httpClient: HttpClient
  ) { }

  get(url: any): Observable<any[]> {
    return this.httpClient.get(this.API_ENDPOINT + url)
    .pipe(map((res: any) => res ),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    )
  }

  delete(url: any): Observable<any[]> {
    return this.httpClient.delete(this.API_ENDPOINT + url)
    .pipe(map((res: any) => res),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    )
  }

  post(url: any, requestParams: any): Observable<any[]> {
    return this.httpClient.post(this.API_ENDPOINT + url, requestParams)
    .pipe(map((res: any) => res),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  put(url: any, requestParams: any): Observable<any[]> {
    return this.httpClient.put(this.API_ENDPOINT + url, requestParams)
    .pipe(map((res: any) => res),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

}

