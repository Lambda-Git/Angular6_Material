import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatDialog} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { RestfulService } from '../../../services/restful.service';
import { McConfirmService } from '../../../modules/mc-confirm/mc-confirm.module';
import { ConfigService } from '../../../services/config.service';
import { MdbuserEditComponent } from './mdbuser-edit.component';
import { StatusPipe } from '../../../modules/pipes/pipes/status.pipe';
import index from "@angular/cli/lib/cli";

@Component({
  selector: 'app-mdbuser',
  templateUrl: './mdbuser.component.html',
  styleUrls: ['./mdbuser.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MdbuserComponent implements OnInit {
  columnsToDisplayTab1 = ['name','pwd', 'notify', 'status', 'action'];
  data_1=[];
  data_2 = {
    servstr : '',
    secs :''
  };
  expandedRow;
  configStatusMap={};

  constructor(
    private _matDialog: MatDialog,
    private _restful: RestfulService,
    private _config: ConfigService,
    private _confirm: McConfirmService
  ) { }

  ngOnInit() {
    this.getConfigs1();
    this.getConfigs2()
  }

  /*mat-tab之间切换绑定的事件*/
   tabClick(tab){
    if(tab.index == '0'){
      this.getConfigs1();
    }
   }

  /*用户管理*/
  getConfigs1() {
    this._config.getUserManagement().subscribe(data => {
      this.data_1 = data;
      this.data_1.forEach(conf=>{
        conf.extend = 'collapsed';
        /*根据name进行过滤区分截取拿到状态值*/
        this.getConfigStatus(conf.name);
      })
    });
  }

  getConfigStatus(name) {
    this._config.getUserManageStatus(name).subscribe(data => {
      this.configStatusMap[name]=data;
    });
  }

  configStatus(name) {
    if (this.configStatusMap[name]==undefined) return '';
    /*状态值为数组 多条数据根据key-value取值*/
    return this.configStatusMap[name];
  }

  addConfig() {
    const dialogRef = this._matDialog.open(MdbuserEditComponent,{
      width: '600px',
      disableClose: true,
      data:{action:'new'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getConfigs1();
      }
    });
  }

  updateConfig(cf) {
    const dialogRef = this._matDialog.open(MdbuserEditComponent,{
      width: '600px',
      disableClose: true,
      data:{action:'update',data:cf}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getConfigs1();
      }
    });
  }

  turnConfigOn(name) {
    this._confirm.confirm({
      message:'是否真正启用配置项['+name+']?',
      onAccept:()=>{
        this._config.turnUserManageOn('user',name).subscribe(data => {
          if (data) {
            this._confirm.alert('配置项['+name+']已经启用');
            this.getConfigs1();
          } else {
            this._confirm.alert('配置项['+name+']启用出错，请稍后再试',)
          }
        })
      }
    })
  }

  turnConfigOff(name) {
    this._confirm.confirm({
      message:'是否真正停用配置项['+name+']?',
      onAccept:()=>{
        this._config.turnUserManageOff('user',name).subscribe(data => {
          if (data) {
            this._confirm.alert('配置项['+name+']已经停用');
            this.getConfigs1();
          } else {
            this._confirm.alert('配置项['+name+']停用出错，请稍后再试',)
          }
        })
      }
    })
  }

  /*用户服务*/
  getConfigs2() {
    this._config.getUserService().subscribe(data => {
      this.data_2 = data[0];
    });
  }

  toggleConfigDetail(cf) {
    if (this.expandedRow == cf) {
      this.expandedRow = undefined;
    } else {
      this.expandedRow = cf;
    }
  }

  removeConfig(cf) {
    this._confirm.confirm({
      message: '是否真正删除用户[' + cf.name + ']?',
      onAccept: () => {
        this._config.removeConfig('user', cf.name).subscribe(data => {
          if (data) {
            this._confirm.alert('用户[' + cf.name + ']已经删除');
            this.getConfigs1();
          } else {
            this._confirm.alert('用户[' + cf.name + ']删除出错，请稍后再试', );
          }
        });
      }
    });
  }

  /*用户服务信息保存*/
  doSave() {
    this._confirm.confirm({
      message:'是否确定保存用户服务信息?',
      onAccept:()=>{
        let row = {servstr:'',secs:''};
        row.servstr = this.data_2.servstr;
        row.secs = this.data_2.secs;
        this._config.userSet('user_set',row).subscribe(data =>{
          if(data){
            this._confirm.alert('用户服务信息已保存');
            this.getConfigs2();
          }else {
            this._confirm.alert('用户服务信息保存出错，请稍后再试');
          }
        })
      }
    })
  }



}
