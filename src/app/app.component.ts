import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  isLoggedIn : boolean = false;
  constructor(public router: Router){
}

ngOnInit(){
  this.router.events.subscribe((val) => {			
    if (val instanceof NavigationEnd) {
      if(val.url == '/' || val.url == '/login' || val.url == '/forgot'){this.isLoggedIn = false;}
      else{this.isLoggedIn = true;}
    }
  });
}
}
