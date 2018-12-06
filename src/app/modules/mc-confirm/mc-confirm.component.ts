import { Component, OnInit, Inject } from "@angular/core";
import { Confirm } from "./confirm.interface";
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: "mc-confirm",
  templateUrl: "./mc-confirm.component.html",
  styleUrls: ["./mc-confirm.component.css"]
})
export class McConfirmComponent implements OnInit {
  confirmValue: Confirm;

  option = {
    title: "确认",
    okText: "确认",
    cancelText: "取消",
    modalClass: "modal-nm",
    promptOnly: false
  };

  constructor(
    public dialogRef: MatDialogRef<McConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.confirmValue = data;
    if (this.confirmValue.option != undefined) {
      this.option = Object.assign(this.option, this.confirmValue.option);
    };
  }

  ngOnInit() {
  }

  accept() {
    if (this.confirmValue.onAccept != undefined) {
      this.confirmValue.onAccept();
    }
    this.dialogRef.close();
  }

  reject() {
    if (this.confirmValue.onReject != undefined) {
      this.confirmValue.onReject();
    }
    this.dialogRef.close();
  }
}
