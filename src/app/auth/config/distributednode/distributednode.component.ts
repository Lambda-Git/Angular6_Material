import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatDialog} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { RestfulService } from '../../../services/restful.service';
import { McConfirmService } from '../../../modules/mc-confirm/mc-confirm.module';
import { ConfigService } from '../../../services/config.service';
import { DistributednodeaddComponent } from './distributednodeadd.component';
import { ChainnodeaddComponent} from './chainnodeadd.component';

@Component({
  selector: 'app-distributednode',
  templateUrl: './distributednode.component.html',
  styleUrls: ['./distributednode.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DistributednodeComponent implements OnInit {

  columnsToDisplay_1 = ['name', 'dir', 'chainid', 'abcifile', 'power' , 'abciserv' , 'rpcserv' , 'p2pserv' , 'ipfsserv' , 'ipfsapi' , 'ipfsgw' , 'status', 'action'];
  columnsToDisplay_2 = ['name', 'nodename' , 'pubkey' , 'nodeid' , 'addr' , 'powerid' , 'status' , 'action'];
  data_1 = [];
  data_2 = [];
  expandedRow_1;
  expandedRow_2;
  configStatusMap = {};

  constructor(
    private _matDialog: MatDialog,
    private _restful: RestfulService,
    private _config: ConfigService,
    private _confirm: McConfirmService
  ) { }

  ngOnInit() {
    this.getConfigs_1();
    this.getConfigs_2();
  }

  /*mat-tab之间切换绑定的事件*/
  tabClick(tab){
    if(tab.index == '0'){
      this.getConfigs_1();
    }
  }

/*系统参数配置*/
  getConfigs_1() {
    this._config.getConfigs('tmconf').subscribe(data => {
      this.data_1 = data;
      this.data_1.forEach(conf => {
        this.getConfigStatus_1(conf.name);
      });
    });
  }

  getConfigStatus_1(name) {
    this._config.getConfigStatus('tmconf', name).subscribe(data => {
      this.configStatusMap[name] = data;
    });

  }

  configStatus_1(name) {
    if (this.configStatusMap[name] == undefined) { return ''; }
    return this.configStatusMap[name]['status'];
  }
  addConfig_1() {
    const dialogRef = this._matDialog.open(DistributednodeaddComponent, {
      width: '600px',
      disableClose: true,
      data: {action: 'new'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getConfigs_1();
      }
    });
  }
  updateConfig_1(cf_1) {
    const dialogRef = this._matDialog.open(DistributednodeaddComponent, {
      width: '600px',
      disableClose: true,
      data: {action: 'update', data: cf_1}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getConfigs_1();
      }
    });
  }
  removeConfig_1(cf_1) {
    this._confirm.confirm({
      message: '是否真正删除配置项[' + cf_1.name + ']?',
      onAccept: () => {
        this._config.removeConfig('tmconf', cf_1.name).subscribe(data => {
          if (data) {
            this._confirm.alert('配置项[' + cf_1.name + ']已经删除');
            this.getConfigs_1();
          } else {
            this._confirm.alert('配置项[' + cf_1.name + ']删除出错，请稍后再试', );
          }
        });
      }
    });
  }
  turnConfigOn_1(name) {
    this._confirm.confirm({
      message: '是否真正启用配置项[' + name + ']?',
      onAccept: () => {
        this._config.turnConfigOn('tmconf', name).subscribe(data => {
          if (data) {
            this._confirm.alert('配置项[' + name + ']已经启用');
            this.getConfigs_1();
          } else {
            this._confirm.alert('配置项[' + name + ']启用出错，请稍后再试', );
          }
        });
      }
    });
  }
  turnConfigOff_1(name) {
    this._confirm.confirm({
      message: '是否真正停用配置项[' + name + ']?',
      onAccept: () => {
        this._config.turnConfigOff('tmconf', name).subscribe(data => {
          if (data) {
            this._confirm.alert('配置项[' + name + ']已经停用');
            this.getConfigs_1();
          } else {
            this._confirm.alert('配置项[' + name + ']停用出错，请稍后再试', );
          }
        });
      }
    });
  }

  toggleConfigDetail_1(cf_1) {
    if (this.expandedRow_1 == cf_1) {
      this.expandedRow_1 = undefined;
    } else {
      this.expandedRow_1 = cf_1;
    }
  }

/*链接点参数配置*/
  getConfigs_2() {
    this._config.getConfigs('tmnode').subscribe(data => {
      this.data_2 = data;
      this.data_2.forEach(conf => {
        this.getConfigStatus_2(conf.name);
      });
    });
  }

  getConfigStatus_2(name) {
    this._config.getConfigStatus('tmnode', name).subscribe(data => {
      this.configStatusMap[name] = data;
    });

  }

  configStatus_2(name) {
    if (this.configStatusMap[name] == undefined) { return ''; }
    return this.configStatusMap[name]['status'];
  }
  addConfig_2() {
    const dialogRef = this._matDialog.open(ChainnodeaddComponent, {
      width: '600px',
      disableClose: true,
      data: {action: 'new'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getConfigs_2();
      }
    });
  }
  updateConfig_2(cf_2) {
    const dialogRef = this._matDialog.open(ChainnodeaddComponent, {
      width: '600px',
      disableClose: true,
      data: {action: 'update', data: cf_2}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getConfigs_2();
      }
    });
  }
  removeConfig_2(cf_2) {
    this._confirm.confirm({
      message: '是否真正删除配置项[' + cf_2.name + ']?',
      onAccept: () => {
        this._config.removeConfig('tmnode', cf_2.name).subscribe(data => {
          if (data) {
            this._confirm.alert('配置项[' + cf_2.name + ']已经删除');
            this.getConfigs_2();
          } else {
            this._confirm.alert('配置项[' + cf_2.name + ']删除出错，请稍后再试', );
          }
        });
      }
    });
  }
  turnConfigOn_2(name) {
    this._confirm.confirm({
      message: '是否真正启用配置项[' + name + ']?',
      onAccept: () => {
        this._config.turnConfigOn('tmnode', name).subscribe(data => {
          if (data) {
            this._confirm.alert('配置项[' + name + ']已经启用');
            this.getConfigs_2();
          } else {
            this._confirm.alert('配置项[' + name + ']启用出错，请稍后再试', );
          }
        });
      }
    });
  }
  turnConfigOff_2(name) {
    this._confirm.confirm({
      message: '是否真正停用配置项[' + name + ']?',
      onAccept: () => {
        this._config.turnConfigOff('tmnode', name).subscribe(data => {
          if (data) {
            this._confirm.alert('配置项[' + name + ']已经停用');
            this.getConfigs_2();
          } else {
            this._confirm.alert('配置项[' + name + ']停用出错，请稍后再试', );
          }
        });
      }
    });
  }

  toggleConfigDetail_2(cf_2) {
    if (this.expandedRow_2 == cf_2) {
      this.expandedRow_2 = undefined;
    } else {
      this.expandedRow_2 = cf_2;
    }
  }

}
