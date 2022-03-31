import { Component, Inject } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
// import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.css']
})
export class AlertMessageComponent {

  title:any;
  subTitle:any;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) { }

  ngOnInit(){
    const splitData = this.data.split('-');
    this.title = splitData[0];
    this.subTitle = splitData[1];
  }
}
