import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {LoginService} from '../../../../services/login.service';
import {McConfirmService} from '../../../../modules/mc-confirm/mc-confirm.service';
import {User} from './User';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
})
export class UserAddComponent implements OnInit {
  /*表单验证*/
  baseForm;
  isNew = true;
  row: User;

  constructor(
    private _sheetRef: MatDialogRef<UserAddComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _login: LoginService,
    private _confirm: McConfirmService
  ) {
    this.isNew = (data.action === 'new');
    if (data.data) {

      this.row = new User(data.data);
    } else {
      this.row = new User();
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
      this.nameCtrl.disable();
    }
  }

  updateModel() {
    let val = this.baseForm.getRawValue();
    if(val.username != ''){
       this.row.username = val.username;
    }
    if(val.email == ''){
      delete this.row.email;
    }
    if(val.email != ''){
      this.row.email = val.email;
    }
    if( val.phone == ''){
      delete this.row.phone;
    }
    if( val.phone != ''){
      this.row.phone != val.phone;
    }
    this.row.active = parseInt(val.active, 10);
    this.row.role = parseInt(val.role, 10);
  }

  /*增加/编辑用户信息*/
  doSave() {
    this.updateModel();
    this._login.doCreateUser(this.row).subscribe(data => {
      this._sheetRef.close(this.row);
    }, err => {
      if (err) {
        this._confirm.prompt(err);
      } else {
        this._confirm.prompt('系统服务调用异常，请检查后重新输入');
      }
    });
  }
}
