import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {RestfulService} from '../../../services/restful.service';
import {McConfirmService} from '../../../modules/mc-confirm/mc-confirm.module';
import {ConfigService} from '../../../services/config.service';
import {HostManagentAddComponent} from './host-managent-add/host-managent-add.component';
import {HostContainerComponent} from './host-container/host-container.component';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-host-managent',
  templateUrl: './host-managent.component.html',
  styleUrls: ['./host-managent.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HostManagentComponent implements OnInit {

  // columnsToDisplay = ['name', 'ip', 'domain', 'type', 'protocol', 'port', 'action'];
  columnsToDisplay = ['name', 'ip', 'domain', 'action'];
  data;
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
    private _restful: RestfulService,
    private _config: ConfigService,
    private _confirm: McConfirmService,
    private _fb: FormBuilder,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.getHost();
  }

  buildForm() {
    /*初始化赋值*/
    this.baseForm = this._fb.group({
      name: [''],
      ip: [''],
    });
  }

  updateModel() {
    const query: any = {};
    const val = this.baseForm.getRawValue();
    if (val.name != '') {
      query.name = val.name;
    }
    if (val.ip != '') {
      query.ip = val.ip;
    }
    return query;
  }

  /*查询主机列表--分页功能*/
  getHost() {
    /*this._user.getUsers().subscribe(data => {
      this.data = data;*/
    this._config.getHostListInfo(this.updateModel(), this.page).subscribe(data => {
      this.data = data.data.datas;
      this.page.totalElements = data.data.count;
    }, err => {
      if (err) {
        this._confirm.prompt(err);
      } else {
        this._confirm.prompt('系统服务异常，请检查后重新输入！');
      }
    });
  }

  /*分页查询数据*/
  pageChanged($event) {
    this.page.pageSize = $event.pageSize;
    this.page.pageNum = $event.pageIndex + 1;
    this.getHost();
  }


  /*添加主机*/
  addConfig(cf) {
    const dialogRef = this.dialog.open(HostManagentAddComponent, {
      width: '600px',
      disableClose: true,
      data: {action: 'new'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._confirm.alert('主机添加成功！');
        this.getHost();
      }
    });
  }

  /*修改主机*/
  updateConfig(cf) {
    const dialogRef = this.dialog.open(HostManagentAddComponent, {
      width: '600px',
      disableClose: true,
      data: {action: 'update', data: cf}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._confirm.alert('修改主机成功！');
        this.getHost();
      }
    });
  }

  /*删除主机*/
  removeConfig(cf) {
    this._confirm.confirm({
      message: '是否真正删除主机[' + cf.name + ']?如果是则会删除该主机的所有容器！',
      onAccept: () => {
        this._config.delHost(cf.id).subscribe(data => {
          if (data) {
            this._confirm.alert('主机[' + cf.name + ']删除出错，请稍后再试',);
            this.getHost();
          } else {
            this._confirm.alert('主机[' + cf.name + ']已经删除');
            this.getHost();
          }
        }, err => {
          if (err) {
            this._confirm.prompt(err);
          } else {
            this._confirm.prompt('系统服务异常，请检查后重新输入！');
          }
        });
      }
    });
  }

  /*根据当前主机查询容器*/
  searchContainer(row) {
    this._config.getContainerByHOst(row.id).subscribe(data => {
      if (data.data.length != 0 ) {
        let containerData = data.data;
        const dialogRef = this.dialog.open(HostContainerComponent, {
          disableClose: true,
          data: {data: containerData, name: row.name, hostID: row.id},
        });
        dialogRef.afterClosed().subscribe(result => {
        });
      } else {
        this._confirm.prompt('该主机暂时没有容器！');
      }

    });
  }

}
