import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HttpResponse
} from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { AlertMessageComponent } from '../../common/alert-message/alert-message.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    allRedirections: any;
    envConfig: any;
    withOutQueryParams: any;
    constructor(private router: Router, private snackBar: MatSnackBar) {

        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.withOutQueryParams = val.url.split('/')[1];
            }
        });

    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with basic auth credentials if available
        const token = localStorage.getItem('access_token');
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: token
                }
            });

        }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                if(error.status === 500){
                    this.snackBar.openFromComponent(AlertMessageComponent, {
                        data : 'Error - Something went wrong. Please try again later',
                        duration: 1500,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                      });
                  }
                  else if(error.status === 401){
                    this.snackBar.openFromComponent(AlertMessageComponent, {
                        data : 'Error - Unauthorized user',
                        duration: 1500,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                      });
                    this.router.navigate(['/']);
                  }
                //   else{
                //     this.router.navigate(['/']);
                //   }
                return throwError(error);
            }));    
    }

}