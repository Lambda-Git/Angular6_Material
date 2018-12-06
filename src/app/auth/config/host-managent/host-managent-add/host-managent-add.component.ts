import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, Validators} from '@angular/forms';

import {ConfigService} from '../../../../services/config.service';
import {McConfirmService} from '../../../../modules/mc-confirm/mc-confirm.service';
import {HostConfig} from './hostConfig';

@Component({
  selector: 'app-host-managent-add',
  templateUrl: './host-managent-add.component.html',
  styleUrls: ['./host-managent-add.component.css']
})
export class HostManagentAddComponent implements OnInit {

  /*表单验证*/
  baseForm;
  isNew = true;
  row: HostConfig;

  constructor(
    private _sheetRef: MatDialogRef<HostManagentAddComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _config: ConfigService,
    private _confirm: McConfirmService
  ) {
    this.isNew = (data.action === 'new');
    if (data.data) {
      this.row = new HostConfig(data.data);
    } else {
      this.row = new HostConfig();
    }
  }

  ngOnInit() {
    this.buildForm();
  }

  get nameCtrl(): FormControl {
    return this.baseForm.get('name') as FormControl;
  }

  get ipCtrl(): FormControl {
    return this.baseForm.get('ip') as FormControl;
  }

  get domainCtrl(): FormControl {
    return this.baseForm.get('domain') as FormControl;
  }

  /*get typeCtrl(): FormControl {
    return this.baseForm.get('type') as FormControl;
  }
  get protocolCtrl(): FormControl {
    return this.baseForm.get('protocol') as FormControl;
  }
  get portCtrl(): FormControl {
    return this.baseForm.get('port') as FormControl;
  }*/

  buildForm() {
    this.baseForm = this._fb.group({
      name: [this.row.name, [Validators.required]],
      // type : [this.row.type,[Validators.required]],
      ip: [this.row.ip, [Validators.required]],
      // protocol : [this.row.ip,[Validators.required]],
      // port : [this.row.port,[Validators.required]],
      domain: [this.row.domain, [Validators.required]]
    });
    if (!this.isNew) {
      this.ipCtrl.disable();
      // this.typeCtrl.disable();
      // this.protocolCtrl.disable();
      // this.portCtrl.disable();
    }
  }

  updateModel() {
    let val = this.baseForm.getRawValue();
    this.row.name = val.name;
    this.row.ip = val.ip;
    // this.row.type = val.type;
    // this.row.protocol = val.protocol;
    // this.row.port = val.port;
    this.row.type = 'docker';
    this.row.protocol = 'http';
    this.row.port = 2375;
    this.row.domain = val.domain;
  }

  /*增加或编辑主机信息*/
  doSave() {
    this.updateModel();
    this._config.doCreateHOst(this.row).subscribe(data => {
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
