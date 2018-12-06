import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {passwayConfig} from './passwayConfig';
import {ConfigService} from '../../../../services/config.service';
import {Form, FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {McConfirmService} from '../../../../modules/mc-confirm/mc-confirm.service';

@Component({
  selector: 'app-passageway-managent-add',
  templateUrl: './passageway-managent-add.component.html',
  styleUrls: ['./passageway-managent-add.component.css']
})
export class PassagewayManagentAddComponent implements OnInit {

  columnsToDisplay = ['name', 'type', 'creator', 'createDate', 'ordererOrgs'];
  /*表单验证*/
  baseForm;
  consensusData;
  isNew = true;
  row: passwayConfig;
  orgArray = [];

  constructor(
    private _sheetRef: MatDialogRef<PassagewayManagentAddComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _config: ConfigService,
    private _confirm: McConfirmService
  ) {
    this.isNew = (data.action === 'new');
    if (data.data) {
      this.row = new passwayConfig(data.data);
    } else {
      this.row = new passwayConfig();
    }
  }

  ngOnInit() {
    this.buildForm();
    this.getConsensus();
  }

  getConsensus() {
    this._config.getConsensus().subscribe(data => {
      this.consensusData = data.data.datas;
    });
  }

  buildForm() {
    this.baseForm = this._fb.group({
      name: [this.row.name],
      consensusName : [this.row.consensusName],
      timeout: [this.row.timeout],
      msgCount : [this.row.msgCount],
      desc : [this.row.desc]
    });
  }

  updateModel() {
    let val = this.baseForm.getRawValue();
    this.row.name = val.name;
    this.row.systemChannel = val.name;
    this.row.consensusName = val.consensusName;
    this.row.timeout = val.timeout;
    this.row.msgCount = val.msgCount;
    this.row.desc = val.desc;
  }

  /*增加通道/更新通道*/
  doSave() {
    this.updateModel();
    this._config.addPassWay(this.row).subscribe(data => {
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
