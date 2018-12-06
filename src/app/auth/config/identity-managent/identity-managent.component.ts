import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatBottomSheet, MatDialog} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {RestfulService} from '../../../services/restful.service';
import {McConfirmService} from '../../../modules/mc-confirm/mc-confirm.module';
import {ConfigService} from '../../../services/config.service';
import {IdentityManagentEditComponent} from './identity-managent-edit/identity-managent-edit.component';

@Component({
  selector: 'app-identity-managent',
  templateUrl: './identity-managent.component.html',
  styleUrls: ['./identity-managent.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class IdentityManagentComponent implements OnInit {
  mainColumnsToDisplay = ['name', 'commonName', 'country', 'state', 'locality', 'organizationName', 'organizationUnit', 'root', 'use', 'action'];
  columnsToDisplay = ['name', 'type', 'config', 'createDate', 'action'];
  datas;
  mainDatas;
  expandedRow;
  myBaseForm;
  selected = '';
  /*我的身份-分页*/
  myPage = {
    totalElements: 0,
    pageNum: 1,
    pageSize: 5
  };
  otherBaseForm;
  /*全网身份-分页*/
  otherPage = {
    totalElements: 0,
    pageNum: 1,
    pageSize: 5
  };

  constructor(
    private _sheet: MatBottomSheet,
    private _restful: RestfulService,
    private _config: ConfigService,
    private _fb: FormBuilder,
    private _confirm: McConfirmService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.getOrgcardInfo();
  }

  /*获取我的身份信息*/
  getOrgcardInfo() {
    this._config.getIdentityInfo(this.updateMyModel(), this.myPage).subscribe(data => {
      this.myPage.totalElements = data.count;
      this.sortData(data);
      this.mainDatas = data;
    });
  }

  /*我的身份--分页查询数据*/
  /*myPageChanged($event) {
    this.myPage.pageSize = $event.pageSize;
    this.myPage.pageNum = $event.pageIndex + 1;
    this.getOrgcardInfo();
  }*/

  buildForm() {
    /*初始化赋值*/
    /*this.myBaseForm = this._fb.group({
      name: [''],
      root: ['-1'],
      use: ['-1'],
    });*/
    /*初始化赋值*/
    this.otherBaseForm = this._fb.group({
      name: [''],
      type: ['-1'],
      config: ['-1'],
    });
  }

  tabClick(tab) {
    if (tab.index == 0) {
      this.getOrgcardInfo();
    } else if (tab.index == 1) {
      this.getAllConfigs();
    }
  }

  /*我的身份查询参数*/
  updateMyModel() {
    const myQuery: any = {};
    /*const val = this.myBaseForm.getRawValue();
    if (val.name != '') {
      myQuery.name = val.name;
    }
    if (val.root != -1) {
      /!*字符串转布尔类型*!/
      myQuery.root = val.root.toLowerCase();
    }
    if (val.use != -1) {
      myQuery.use = val.use.toLowerCase();
    }*/
    return myQuery;
  }

  updateOtherModel() {
    const otherQuery: any = {};
    const val = this.otherBaseForm.getRawValue();
    if (val.name != '') {
      otherQuery.name = val.name;
    }
    if (val.type != -1) {
      otherQuery.type = val.type;
    }
    if (val.config != -1) {
      otherQuery.config = eval(val.config.toLowerCase());
    }
    return otherQuery;
  }


  /*处理数据排序*/
  sortData(data) {
    /*先把为主的对象放到数组最前面--主只有一个*/
    let key;
    let rows = {};
    data.forEach((rowData, index) => {
      if (rowData.root == true) {
        key = index;
        rows = rowData;
      }
    });
    if (key) {
      data.splice(key, 1);
      data.unshift(rows);
      this.mainDatas = data;
      /*再把被使用use对象放到数组最前面--被使用有多个*/
      data.forEach((useData, useIndex) => {
        if (useData.use == true) {
          data.splice(useIndex, 1);
          data.unshift(useData);
        }
      });
      /*同时满足为主、被使用;再移到数组最前面*/
      data.forEach((useRootData, useRootIndex) => {
        if (useRootData.root == true && useRootData.use == true) {
          data.splice(useRootIndex, 1);
          data.unshift(useRootData);
        }
      });
    } else {
      /*再把被使用use对象放到数组最前面--被使用有多个*/
      data.forEach((useData, useIndex) => {
        if (useData.use == true) {
          data.splice(useIndex, 1);
          data.unshift(useData);
        }
      });
      return data;
    }
  }

  /*我的身份-添加身份*/
  addOrgCard() {
    let isRoot = '';
    this._config.getIdentityInfo(this.updateMyModel(), this.myPage).subscribe(data => {
      const addData = data;
      addData.forEach(rowData => {
        if (rowData.root == true) {
          isRoot = 'yes';
        }
      });
      const dialogRef = this.dialog.open(IdentityManagentEditComponent, {
        width: '600px',
        disableClose: true,
        data: {action: 'new', isRoot: isRoot}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._confirm.alert('身份添加成功！');
          this.getOrgcardInfo();
        }
      });
    });
  }

  /*更新我的身份信息*/
  updateOrgCardInfo(cf) {
    let isRoot = '';
    this._config.getIdentityInfo(this.updateMyModel(), this.myPage).subscribe(data => {
      const updateData = data;
      updateData.forEach(rowData => {
        if (rowData.root == true) {
          isRoot = 'yes';
        }
      });
      const dialogRef = this.dialog.open(IdentityManagentEditComponent, {
        width: '600px',
        disableClose: true,
        data: {action: 'update', data: cf, isRoot: isRoot}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._confirm.alert('身份更新成功！');
          this.getOrgcardInfo();
        }
      });
    });
  }


  /*获取所有的身份信息列表*/
  getAllConfigs() {
    this._config.geAlltIdentityInfo(this.updateOtherModel(), this.otherPage).subscribe(data => {
      this.datas = data.data.datas;
      this.otherPage.totalElements = data.data.count;
    }, err => {
      if (err) {
        this._confirm.prompt(err);
      } else {
        this._confirm.prompt('系统服务调用异常，请检查后重新输入！');
      }
    });

  }

  /*全网身份--分页查询数据*/
  otherPageChanged($event) {
    this.otherPage.pageSize = $event.pageSize;
    this.otherPage.pageNum = $event.pageIndex + 1;
    this.getAllConfigs();
  }

}
