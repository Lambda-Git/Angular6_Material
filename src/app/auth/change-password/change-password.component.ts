import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {LoginService} from '../../services/login.service';
import {McConfirmService} from '../../modules/mc-confirm/mc-confirm.service';
import {ChangePassword} from './change-password';

@AutoUnsubscribe()
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  /*表单验证*/
  baseForm;
  row: ChangePassword;

  constructor(
    private _sheetRef: MatDialogRef<ChangePasswordComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _confirm: McConfirmService,
    private _login: LoginService,
  ) {
    if (data.data) {
      this.row = new ChangePassword(data.data);
    } else {
      this.row = new ChangePassword();
    }
  }

  ngOnInit() {
    this.buildForm();
  }

  get PasswordCtrl(): FormControl {
    return this.baseForm.get('oldPass') as FormControl;
  }

  get Password2Ctrl(): FormControl {
    return this.baseForm.get('newPass') as FormControl;
  }

  get oldpasswordCtrl(): FormControl {
    return this.baseForm.get('confirmPass') as FormControl;
  }

  buildForm() {
    this.baseForm = this._fb.group({
      oldPass: [this.row.oldPass, [Validators.required]],
      newPass: [this.row.newPass, [Validators.required]],
      confirmPass: [this.row.confirmPass, [Validators.required]]
    });
  }

  /*修改用户信息*/
  doChangePassword() {
    const val = this.baseForm.value;
    this._login.changeUserPassword(val.oldPass, val.newPass, val.confirmPass).subscribe(data => {
      this._sheetRef.close(this.row);
      this._confirm.alert('密码修改成功!');
      /*修改密码陈功后跳转登录页面验证登录密码*/
      // this._router.navigate(['/login']);
    }, err => {
      this._confirm.prompt(err);
    });
  }
}
