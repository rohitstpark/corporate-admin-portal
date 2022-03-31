import { Injectable } from '@angular/core';
import { CanActivate, Router,ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

    routeConfig: any;

  constructor( private router: Router
    ) {
        // this.routeConfig = ROUTE_CONFIG;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {
        const authToken = localStorage.getItem('access_token');
        if (authToken && authToken!=null) {
            // logged in so return true
            return of(true);
        }
        else{
          this.router.navigate(['/']);
           return;
            // return this.checkLogin();
        }      
    }


}