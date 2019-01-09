import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatDialog} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { RestfulService } from '../../../services/restful.service';
import { McConfirmService } from '../../../modules/mc-confirm/mc-confirm.module';
import { ConfigService } from '../../../services/config.service';
import { MdbservEditComponent } from './mdbserv-edit.component';

@Component({
  selector: 'app-mdbserv',
  templateUrl: './mdbserv.component.html',
  styleUrls: ['./mdbserv.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MdbservComponent implements OnInit {

  columnsToDisplay = ['name', 'sertx', 'clitx', 'pwd', 'dbstr', 'options','status','action'];
  data=[];
  expandedRow;
  configStatusMap={};
  constructor(
    private _matDialog: MatDialog,
    private _restful: RestfulService,
    private _config: ConfigService,
    private _confirm: McConfirmService
  ) { }

  ngOnInit() {
    this.getConfigs();
  }

  getConfigs() {
    this._config.getConfigs('mdbserv').subscribe(data => {
      /*临时处理options "NULL"*/
      for(let obj  of data){
        if(obj.options == " NULL"){
          obj.options = '';
        }
      }
      this.data = data;
      this.data.forEach(conf => {
        this.getConfigStatus(conf.name);
      });
    })
  }

  getConfigStatus(name) {
    this._config.getConfigStatus('mdbserv',name).subscribe(data => {
      this.configStatusMap[name]=data;
      console.log(data)
    });

  }

  configStatus(name) {
    if (this.configStatusMap[name]==undefined) return '';
    return this.configStatusMap[name]['status'];
  }

  addConfig() {
    const dialogRef = this._matDialog.open(MdbservEditComponent,{
      width: '600px',
      disableClose: true,
      data:{action:'new'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getConfigs();
      }
    });
  }

  updateConfig(cf) {
    const dialogRef = this._matDialog.open(MdbservEditComponent,{
      width: '600px',
      disableClose: true,
      data:{action:'update',data:cf}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getConfigs();
      }
    });
  }

  removeConfig(cf) {
    this._confirm.confirm({
      message:'是否真正删除配置项['+cf.name+']?',
      onAccept:()=>{
        this._config.removeConfig('mdbserv',cf.name).subscribe(data => {
          if (data) {
            this._confirm.alert('配置项['+cf.name+']已经删除');
            this.getConfigs();
          } else {
            this._confirm.alert('配置项['+cf.name+']删除出错，请稍后再试',)
          }
        })
      }
    })
  }

  turnConfigOn(name) {
    this._confirm.confirm({
      message:'是否真正启用配置项['+name+']?',
      onAccept:()=>{
        this._config.turnConfigOn('mdbserv',name).subscribe(data => {
          if (data) {
            this._confirm.alert('配置项['+name+']已经启用');
            this.getConfigs();
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
        this._config.turnConfigOff('mdbserv',name).subscribe(data => {
          if (data) {
            this._confirm.alert('配置项['+name+']已经停用');
            this.getConfigs();
          } else {
            this._confirm.alert('配置项['+name+']停用出错，请稍后再试',)
          }
        })
      }
    })
  }

  toggleConfigDetail(cf) {
    if (this.expandedRow == cf) {
      this.expandedRow = undefined;
    } else {
      this.expandedRow = cf;
    }
  }

}
