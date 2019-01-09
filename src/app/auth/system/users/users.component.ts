import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatDialog} from '@angular/material';

import { UserService } from '../../../services/user.service';
import { UserAddComponent } from './user-add/user-add.component';
import { McConfirmService } from '../../../modules/mc-confirm/mc-confirm.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],

})
export class UsersComponent implements OnInit {

  columnsToDisplay = ['select', 'username', 'email', 'phone', 'role', 'active', 'createDate', 'action'];
  users;
  data = [];
  rowSelected = 0;
  expandedRow;
  baseForm;

  constructor(
    private _user: UserService,
    private _confirm: McConfirmService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this._user.getUsers().subscribe(users => {
      this.users = users;
      console.log(this.users)
    })
  }

  /*增加用户*/
  addUser() {
    const dialogRef = this.dialog.open(UserAddComponent, {
      width: '600px',
      disableClose: true,
      data: {action: 'new'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._confirm.alert('新增用户成功！');
        this.getUsers();
      }
    });
  }

  /*修改用户*/
  updateUser(cf) {
    const dialogRef = this.dialog.open(UserAddComponent, {
      width: '600px',
      disableClose: true,
      data: {action: 'update', data: cf}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._confirm.alert('修改用户成功！');
        this.getUsers();
      }
    });
  }

  /*单个删除*/
  removeUser(cf) {
    const delUserData = [];
    delUserData.push(cf.id);
    this._confirm.confirm({
      message: '是否真正删除用户[' + cf.username + ']?',
      onAccept: () => {
       /* this._login.delUser(delUserData).subscribe(data => {
          if (data) {
            this._confirm.alert('用户[' + cf.username + ']删除成功！');
            this.getUsers();
          } else {
            this._confirm.alert('用户[' + cf.username + ']删除出错，请稍后再试', );
            this.getUsers();
          }
        });*/
      }
    });
  }

  /*批量删除*/
  delsUsers() {
    const delUserData = [];
    this.users.forEach(row => {
      if (row.selected === true) {
        delUserData.push(row.id);
      }
    });
    this._confirm.confirm({
      message: '是否真正批量删除用户?',
      onAccept: () => {
        /*this._login.delUser(delUserData).subscribe(data => {
          if (data) {
            this._confirm.alert('批量删除用户出错，请稍后再试', );
            this.getUsers();
          } else {
            this._confirm.alert('批量删除用户成功！');
            this.getUsers();
          }
        });*/
      }
    });
  }

  /*启用用户*/
  turnConfigOn(row) {
    this._confirm.confirm({
      message: '是否启用用户[' + row.username + ']?',
      onAccept: () => {
        row.active = 1;
        /*this._login.changeUserStatus(row).subscribe(data => {
          if (data) {
            this._confirm.alert('用户[' + row.username + ']已经启用');
            this.getUsers();
          } else {
            this._confirm.alert('用户[' + row.username + ']启用出错，请稍后再试', );
            this.getUsers();
          }
        });*/
      }
    });
  }

  /*禁用用户*/
  turnConfigOff(row) {
    this._confirm.confirm({
      message: '是否真正停用配置项[' + row.username + ']?',
      onAccept: () => {
        row.active = 0;
        /*this._login.changeUserStatus(row).subscribe(data => {
          if (data) {
            this._confirm.alert('配置项[' + row.username + ']已经停用');
            this.getUsers();
          } else {
            this._confirm.alert('配置项[' + row.username + ']停用出错，请稍后再试', );
            this.getUsers();
          }
        });*/
      }
    });
  }

  /*单个勾选*/
  onSelectedRow(cf) {
    if (cf.selected == undefined) {
      cf.selected = false;
    }
    cf.selected = !cf.selected;
    this.rowSelected = this.users.filter(row => row.selected === true).length;
  }

  /*表头全部勾选*/
  toggleSelectAllRows($event) {
    this.users.forEach(row => row.selected = $event.checked);
    this.rowSelected = this.users.filter(row => row.selected === true).length;
  }

}
