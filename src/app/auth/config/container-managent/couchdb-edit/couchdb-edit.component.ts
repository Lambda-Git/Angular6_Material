import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {McConfirmService} from '../../../../modules/mc-confirm/mc-confirm.service';
import {ConfigService} from '../../../../services/config.service';
import {CouchdbConfig} from './couchdbConfig';

@Component({
  selector: 'app-couchdb-edit',
  templateUrl: './couchdb-edit.component.html',
  styleUrls: ['./couchdb-edit.component.css']
})
export class CouchdbEditComponent implements OnInit {

  baseForm;
  isNew = true;
  row: CouchdbConfig;

  constructor(
    private _sheetRef: MatDialogRef<CouchdbEditComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _config: ConfigService,
    private _confirm: McConfirmService
  ) {
    this.isNew = (data.action === 'new');
    if (data.data) {

      this.row = new CouchdbConfig(data.data);
    } else {
      this.row = new CouchdbConfig();
    }
  }

  ngOnInit() {
    this.buildForm();
  }

  get couchdbUsernameCtrl(): FormControl {
    return this.baseForm.get('couchdbUsername') as FormControl;
  }

  buildForm() {
    this.baseForm = this._fb.group({
      couchdbUsername: [this.row.couchdbUsername],
      couchdbPassword: [this.row.couchdbPassword],
      port: [this.row.port],
      containerName: [this.row.containerName],
    });
  }

  updateModel() {
    let val = this.baseForm.getRawValue();
    this.row.couchdbUsername = val.couchdbUsername;
    this.row.couchdbPassword = val.couchdbPassword;
    this.row.port = val.port;
    this.row.containerName = val.containerName;
  }


  /*增加couchdb/修改couchdb*/
  doSave() {
    this.updateModel();
    this._config.doCouchdbSave(this.row).subscribe(data => {
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
