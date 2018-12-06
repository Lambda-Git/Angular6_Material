import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {FormBuilder} from '@angular/forms';

import {RestfulService} from '../../../services/restful.service';
import {McConfirmService} from '../../../modules/mc-confirm/mc-confirm.module';
import {ConfigService} from '../../../services/config.service';
import {CaEditComponent} from './ca-edit/ca-edit.component';
import {PeerEditComponent} from './peer-edit/peer-edit.component';
import {CouchdbEditComponent} from './couchdb-edit/couchdb-edit.component';
import { StartContainerComponent } from './start-container/start-container.component';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'app-container-managent',
  templateUrl: './container-managent.component.html',
  styleUrls: ['./container-managent.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ContainerManagentComponent implements OnInit {

  columnsToDisplay_ca = ['containerName', 'name', 'tls', 'debug', 'port', 'admin', 'adminpw', 'action'];
  columnsToDisplay_peer = ['containerName', 'debug', 'ccDebug', 'tls', 'clientAuthEnable', 'anchorPeer', 'couchdbContainerName' ,'servicePort', 'ccPort', 'eventPort', 'action'];
  columnsToDisplay_couchdb = ['containerName' ,'couchdbUsername', 'couchdbPassword', 'port', 'used', 'action'];
  data_ca;
  data_peer;
  data_couchdb;
  expandedRow;
  /*ca查询条件表单 + 分页*/
  // caBaseForm;
  caPage = {
    totalElements: 0,
    pageNum: 1,
    pageSize: 5
  };
  /*peer查询条件表单 + 分页*/
  // peerBaseForm;
  peerPage = {
    totalElements: 0,
    pageNum: 1,
    pageSize: 5
  };
  /*peer查询条件表单 + 分页*/
  // couchdbBaseForm;
  couchdbPage = {
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
    // this.buildForm();
    this.getCa();
  }

  /*buildForm() {
    /!*ca查询条件初始化赋值*!/
    this.caBaseForm = this._fb.group({
      containerName: [''],
      port: [''],
    });
    /!*peer查询条件初始化赋值*!/
    this.peerBaseForm = this._fb.group({
      containerName: [''],
      port: [''],
    });
    /!*couchdb查询条件初始化赋值*!/
    this.couchdbBaseForm = this._fb.group({
      containerName: [''],
      port: [''],
    });
  }*/

  /*mat-tab之间切换绑定的事件*/
  tabClick(tab) {
    if (tab.index == 0) {
      this.getCa();
    } else if (tab.index == 1) {
      this.getPeer();
    } else if (tab.index == 2) {
      this.getCouchdb();
    }
  }

  /*ca--*/
  updateCaModel() {
    let query: any = {};
   /* let val = this.caBaseForm.getRawValue();
    if (val.containerName != '') {
      query.containerName = val.containerName;
    }
    if (val.port != '') {
      query.port = val.port;
    }*/
    return query;
  }

  /*获取ca列表*/
  getCa() {
    /*this._user.getCa().subscribe(data => {
      this.data_ca = data;*/
    this._config.getCa(this.updateCaModel(), this.caPage).subscribe(data => {
      data.data.forEach((rowData,index) => {
        /*port赋值*/
        if(rowData.ports){
          rowData.port = rowData.ports[0];
        }
        rowData.envs.forEach((row,rowIndex) => {
          /*从envs获取admin、adminpw、debug*/
          let m = row.match('BOOTSTRAP_USER_PASS');
          if(m != null && m != ''){
            /*根据:截取，前面为admin 后面为adnminpw*/
            let begin = row.indexOf('=');
            let last = row.indexOf(':');
            let length = row.length;
            rowData.admin = row.substring(begin+1,last);
            rowData.adminpw = row.substring(last+1,length);
          }
          /*从envs获取debug*/
          let n = row.match('FABRIC_CA_SERVER_DEBUG');
          if(n != null && n != ''){
            let begin_ = row.indexOf('=');
            let length_ = row.length;
            rowData.debug = row.substring(begin_+1,length_);
          }
        })
      });
      this.data_ca = data.data;

    }, err => {
      if (err) {
        this._confirm.prompt(err);
      } else {
        this._confirm.prompt('系统服务异常，请检查后重新输入！');
      }
    });
  }

  /*增加ca*/
  addCa() {
    const dialogRef = this.dialog.open(CaEditComponent, {
      disableClose: true,
      data: {action: 'new'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._confirm.alert('新增ca成功！');
        this.getCa();
      }
    });
  }

  /*修改ca*/
  updateCa(cf) {
    const dialogRef = this.dialog.open(CaEditComponent, {
      disableClose: true,
      data: {action: 'update', data: cf}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._confirm.alert('修改ca成功！');
        this.getCa();
      }
    });
  }


  /*启用ca
  *获取host主机列表，选择主机,传主机id+当前ca的配置id
  * */
  turnCaOn(row) {
    const dialogRef = this.dialog.open(StartContainerComponent, {
      disableClose: true,
      data: {data: row}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this._confirm.alert('启动ca成功！');
        this.getCa();
      }
    });
  }


  /*peer--*/
  updatePeerModel() {
    let query: any = {};
    /*let val = this.peerBaseForm.getRawValue();
    if (val.containerName != '') {
      query.containerName = val.containerName;
    }
    if (val.port != '') {
      query.port = val.port;
    }*/
    return query;
  }

  /*查询peer列表*/
  getPeer() {
    this._config.getPeer(this.updatePeerModel(), this.peerPage).subscribe(data => {
      /*端口赋值*/
      data.data.forEach( rowData => {
        if(rowData.ports.length == 3){
          rowData.servicePort = rowData.ports[0];
          rowData.ccPort = rowData.ports[1];
          rowData.eventPort = rowData.ports[2];
        }

        rowData.envs.forEach((row,rowIndex) => {
          /*从envs获取debug、ccDebug、tls、clientAuthEnable*/
          //debug
          let a = row.match('CORE_LOGGING_LEVEL');
          if(a != null && a != ''){
            let begin = row.indexOf('=');
            let length = row.length;
            rowData.debug = row.substring(begin+1,length);
            if(rowData.debug == 'debug'){
              rowData.debug = true;
            }else {
              rowData.debug = false;
            }
          }
          //ccDebug
          let b = row.match('CORE_CHAINCODE_LOGGING_LEVEL');
          if(b != null && b != ''){
            let begin = row.indexOf('=');
            let length = row.length;
            rowData.ccDebug = row.substring(begin+1,length);
            if(rowData.ccDebug == 'debug'){
              rowData.ccDebug = true;
            }else {
              rowData.ccDebug = false;
            }
          }
          //tls
          let c = row.match('CORE_PEER_TLS_ENABLED');
          if(c != null && c != ''){
            let begin = row.indexOf('=');
            let length = row.length;
            rowData.tls = eval((row.substring(begin+1,length)).toLowerCase());
          }
          //clientAuthEnable
          let d = row.match('CORE_PEER_TLS_CLIENTAUTHREQUIRED');
          if(d != null && d != ''){
            let begin = row.indexOf('=');
            let length = row.length;
            rowData.clientAuthEnable = eval((row.substring(begin+1,length)).toLowerCase());
          }

        })


      })
      this.data_peer = data.data;
    }, err => {
      if (err) {
        this._confirm.prompt(err);
      } else {
        this._confirm.prompt('系统服务异常，请检查后重新输入！');
      }
    });
  }

  /*增加peer*/
  addPeer() {
    const dialogRef = this.dialog.open(PeerEditComponent, {
      disableClose: true,
      data: {action: 'new'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._confirm.alert('新增peer成功！');
        this.getPeer();
      }
    });
  }

  /*修改peer*/
  updatePeer(cf) {
    const dialogRef = this.dialog.open(PeerEditComponent, {
      disableClose: true,
      data: {action: 'update', data: cf}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._confirm.alert('修改peer成功！');
        this.getPeer();
      }
    });
  }

  /*启用peer
  *获取host主机列表，选择主机,传主机id+当前ca的配置id
  * */
  turnPeerOn(row) {
    const dialogRef = this.dialog.open(StartContainerComponent, {
      disableClose: true,
      data: {data: row}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this._confirm.alert('启动peer成功！');
        this.getPeer();
      }
    });
  }

  /*设为anchorPeer*/
  turnAnchorPeerOn(row) {
    this._confirm.confirm({
      message: '是否确认设为anchorPeer？',
      onAccept: () => {
        row.anchorPeer = true;
        this._config.turnAnchorPeer(row).subscribe(data => {
          if (data) {
            this._confirm.alert('设为anchorPeer成功！');
            this.getPeer();
          } else {
            this._confirm.alert('设为anchorPeer出错,请稍后再试！',);
            this.getPeer();
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

  /*取消anchorPeer*/
  turnAnchorPeerOff(row) {
    this._confirm.confirm({
      message: '是否确认取消anchorPeer？',
      onAccept: () => {
        row.anchorPeer = false;
        this._config.turnAnchorPeer(row).subscribe(data => {
          if (data) {
            this._confirm.alert('取消anchorPeer成功！');
            this.getPeer();
          } else {
            this._confirm.alert('取消anchorPeer出错,请稍后再试！',);
            this.getPeer();
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

  /*couchdb--*/
  updateCouchdbModel() {
    let query: any = {};
    /*let val = this.couchdbBaseForm.getRawValue();
    if (val.containerName != '') {
      query.containerName = val.containerName;
    }
    if (val.port != '') {
      query.port = val.port;
    }*/
    return query;
  }

  /*查询couchdb列表*/
  getCouchdb() {
    /*this._user.getCouchdb().subscribe(data => {
      this.data_couchdb = data;*/
    this._config.getCouchdb(this.updateCouchdbModel(), this.couchdbPage).subscribe(data => {
      data.data.forEach((rowData,index) => {
        /*port赋值*/
        if(rowData.ports){
          rowData.port = rowData.ports[0];
        }
        rowData.envs.forEach((row,rowIndex) => {
          /*从envs获取couchdbUsername、couchdbPassword*/
          let m = row.match('COUCHDB_USER');
          if(m != null && m != ''){
            /*根据:截取，前面为admin 后面为adnminpw*/
            let begin = row.indexOf('=');
            let length = row.length;
            rowData.couchdbUsername = row.substring(begin+1,length);
          }
          /*从envs获取debug*/
          let n = row.match('COUCHDB_PASSWORD');
          if(n != null && n != ''){
            let begin_ = row.indexOf('=');
            let length_ = row.length;
            rowData.couchdbPassword = row.substring(begin_+1,length_);
          }
        })
      })
      this.data_couchdb = data.data;
    }, err => {
      if (err) {
        this._confirm.prompt(err);
      } else {
        this._confirm.prompt('系统服务异常，请检查后重新输入！');
      }
    });
  }

  /*增加couchdb*/
  addCouchdb() {
    const dialogRef = this.dialog.open(CouchdbEditComponent, {
      disableClose: true,
      data: {action: 'new'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._confirm.alert('新增couchdb成功！');
        this.getCouchdb();
      }
    });
  }

  /*修改couchdb*/
  updateCouchdb(cf) {
    const dialogRef = this.dialog.open(CouchdbEditComponent, {
      disableClose: true,
      data: {action: 'update', data: cf}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._confirm.alert('修改couchdb成功！');
        this.getCouchdb();
      }
    });
  }

  /*启用couchdb
  *获取host主机列表，选择主机,传主机id+当前ca的配置id
  * */
  turnCouchdbOn(row) {
    const dialogRef = this.dialog.open(StartContainerComponent, {
      disableClose: true,
      data: {data: row}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this._confirm.alert('启动couchdb成功！');
        this.getPeer();
      }
    });
  }


}
