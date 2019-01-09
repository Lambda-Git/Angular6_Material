import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { userConfig } from './userConfig';
import { McConfirmService } from '../../../../modules/mc-confirm/mc-confirm.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
})
export class UserAddComponent implements OnInit {
  /*表单验证*/
  baseForm;
  isNew = true;
  row: userConfig;

  constructor(
    private _sheetRef: MatDialogRef<UserAddComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _confirm: McConfirmService
  ) {
    this.isNew = (data.action==='new');
    if (data.data) {
      this.row = new userConfig(data.data)
    } else {
      this.row = new userConfig();
    }
  }

  ngOnInit() {
    this.buildForm();
  }
  get nameCtrl(): FormControl {
    return this.baseForm.get('username') as FormControl;
  }
  get activeCtrl(): FormControl {
    return this.baseForm.get('active') as FormControl;
  }
  get roleCtrl(): FormControl {
    return this.baseForm.get('role') as FormControl;
  }

  buildForm() {
    this.baseForm = this._fb.group({
      username: [this.row.username, [Validators.required]],
      email: [this.row.email],
      phone: [this.row.phone],
      active: [this.row.active],
      role: [this.row.role],
    });
    if (!this.isNew) {
      // this.nameCtrl.disable();
    }
  }

  doSave() {

  }
}
