import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Confirm } from "./confirm.interface";
import { McConfirmComponent } from './mc-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class McConfirmService {

  constructor(
    public _dialog: MatDialog,
    public _snackBar: MatSnackBar
  ) {}
  openDialog(confirmValue) {
    const dialogRef = this._dialog.open(McConfirmComponent, {
      data: confirmValue,
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
     
  }
  confirm(confirmValue: any) {
    this.openDialog(confirmValue);
  }
  prompt (confirmValue: any) {
    if (typeof confirmValue == 'string') {
      confirmValue = {
        message:confirmValue,
        option:{
          promptOnly:true,title:'提示'
        }
      }
    } else {
      confirmValue.option = Object.assign({},confirmValue.option,{promptOnly:true,title:'提示'});
    }
    this.openDialog(confirmValue);
  }
  alert(message,action='关闭') {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
