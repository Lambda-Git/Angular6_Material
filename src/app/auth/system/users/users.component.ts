import {Component, OnInit} from '@angular/core';
import {MatBottomSheet, MatDialog} from '@angular/material';
import {FormBuilder} from '@angular/forms';

import {LoginService} from '../../../services/login.service';
import {UserAddComponent} from './user-add/user-add.component';
import {ConfigService} from '../../../services/config.service';
import {McConfirmService} from '../../../modules/mc-confirm/mc-confirm.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],

})
export class UsersComponent implements OnInit {

  columnsToDisplay = ['select', 'username', 'email', 'phone', 'role', 'active', 'createDate', 'createBy', 'action'];
  users;
  data = [];
  rowSelected = 0;
  expandedRow;
  /*查询条件表单*/
  baseForm;
  /*分页*/
  page = {
    totalElements: 0,
    pageNum: 1,
    pageSize: 5
  };

  constructor(
    private _sheet: MatBottomSheet,
    private _config: ConfigService,
    private _confirm: McConfirmService,
    public dialog: MatDialog,
    private _fb: FormBuilder,
    private _login: LoginService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.getUsers();
  }

  buildForm() {
    /*初始化赋值*/
    this.baseForm = this._fb.group({
      username: [''],
      active: ['-1'],
      role: ['-1'],
    });
  }

  updateModel() {
    const query: any = {};
    const val = this.baseForm.getRawValue();
    if (val.username != '') {
      query.username = val.username;
    }
    if (val.active != -1) {
      /*字符串转number类型*/
      query.active = parseInt(val.active, 10);
    }
    if (val.role != -1) {
      query.role = parseInt(val.role, 10);
    }
    return query;
  }

  /*查询用户列表-分页*/
  getUsers() {
    this._login.getUserList(this.updateModel(), this.page).subscribe(users => {
      if (users.data.datas != undefined) {
        this.users = users.data.datas;
        this.page.totalElements = users.data.count;
      }
    });
  }

  /*分页查询数据*/
  pageChanged($event) {
    this.page.pageSize = $event.pageSize;
    this.page.pageNum = $event.pageIndex + 1;
    this.getUsers();
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
        this._login.delUser(delUserData).subscribe(data => {
          if (data) {
            this._confirm.alert('用户[' + cf.username + ']删除成功！');
            this.getUsers();
          } else {
            this._confirm.alert('用户[' + cf.username + ']删除出错，请稍后再试', );
            this.getUsers();
          }
        });
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
        this._login.delUser(delUserData).subscribe(data => {
          if (data) {
            this._confirm.alert('批量删除用户出错，请稍后再试', );
            this.getUsers();
          } else {
            this._confirm.alert('批量删除用户成功！');
            this.getUsers();
          }
        });
      }
    });
  }

  /*启用用户*/
  turnConfigOn(row) {
    this._confirm.confirm({
      message: '是否启用用户[' + row.username + ']?',
      onAccept: () => {
        row.active = 1;
        this._login.changeUserStatus(row).subscribe(data => {
          if (data) {
            this._confirm.alert('用户[' + row.username + ']已经启用');
            this.getUsers();
          } else {
            this._confirm.alert('用户[' + row.username + ']启用出错，请稍后再试', );
            this.getUsers();
          }
        });
      }
    });
  }

  /*禁用用户*/
  turnConfigOff(row) {
    this._confirm.confirm({
      message: '是否真正停用配置项[' + row.username + ']?',
      onAccept: () => {
        row.active = 0;
        this._login.changeUserStatus(row).subscribe(data => {
          if (data) {
            this._confirm.alert('配置项[' + row.username + ']已经停用');
            this.getUsers();
          } else {
            this._confirm.alert('配置项[' + row.username + ']停用出错，请稍后再试', );
            this.getUsers();
          }
        });
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
