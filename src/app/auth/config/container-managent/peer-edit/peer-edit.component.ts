import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {McConfirmService} from '../../../../modules/mc-confirm/mc-confirm.service';
import {ConfigService} from '../../../../services/config.service';
import {PeerConfig} from './peerConfig';

@Component({
  selector: 'app-peer-edit',
  templateUrl: './peer-edit.component.html',
  styleUrls: ['./peer-edit.component.css']
})
export class PeerEditComponent implements OnInit {

  baseForm;
  isNew = true;
  row: PeerConfig;
  q = {
    used: false,
  };
  page = {};
  containerArrays = [];

  constructor(
    private _sheetRef: MatDialogRef<PeerEditComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _config: ConfigService,
    private _confirm: McConfirmService
  ) {
    this.isNew = (data.action === 'new');
    if (data.data) {
      this.row = new PeerConfig(data.data);
    } else {
      this.row = new PeerConfig();
    }
  }

  ngOnInit() {
    this.buildForm();
    this.getCouchdb();
  }

  /*获取没有被使用的couchdb容器列表*/
  getCouchdb() {
    this._config.getCouchdb( this.q , this.page ).subscribe(data => {
          data.data.forEach( lineData => {
            if (lineData != '') {
              this.containerArrays.push(lineData.containerName);
            }
          });
    });
  }

  get debugCtrl(): FormControl {
    return this.baseForm.get('debug') as FormControl;
  }
  get ccDebugCtrl(): FormControl {
    return this.baseForm.get('ccDebug') as FormControl;
  }
  get tlsCtrl(): FormControl {
    return this.baseForm.get('tls') as FormControl;
  }
  get clientAuthEnableCtrl(): FormControl {
    return this.baseForm.get('clientAuthEnable') as FormControl;
  }
  get anchorPeerCtrl(): FormControl {
    return this.baseForm.get('anchorPeer') as FormControl;
  }

  buildForm() {
    this.baseForm = this._fb.group({
      containerName: [this.row.containerName],
      debug: [this.row.debug],
      ccDebug: [this.row.ccDebug],
      tls: [this.row.tls],
      clientAuthEnable: [this.row.clientAuthEnable],
      anchorPeer: [this.row.anchorPeer],
      couchdbContainerName: [this.row.couchdbContainerName],
      servicePort: [this.row.servicePort],
      eventPort: [this.row.eventPort],
      ccPort: [this.row.ccPort],
    });
  }

  updateModel() {
    const val = this.baseForm.getRawValue();
    this.row.containerName = val.containerName;
    this.row.debug = val.debug;
    this.row.ccDebug = val.ccDebug;
    this.row.tls = val.tls;
    this.row.clientAuthEnable = val.clientAuthEnable;
    this.row.anchorPeer = val.anchorPeer;
    if ( val.couchdbContainerName != '-1') {
      this.row.couchdbContainerName = val.couchdbContainerName;
    }
    this.row.servicePort = val.servicePort;
    this.row.eventPort = val.eventPort;
    this.row.ccPort = val.ccPort;
  }


  /*增加peer/修改peer*/
  doSave() {
    this.updateModel();
    this._config.doPeerSave(this.row).subscribe(data => {
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
