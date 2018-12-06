import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {McConfirmService} from '../../../../modules/mc-confirm/mc-confirm.service';
import {CaConfig} from './caConfig';
import {ConfigService} from '../../../../services/config.service';

@Component({
  selector: 'app-ca-edit',
  templateUrl: './ca-edit.component.html',
  styleUrls: ['./ca-edit.component.css']
})
export class CaEditComponent implements OnInit {

  baseForm;
  isNew = true;
  row: CaConfig;

  constructor(
    private _sheetRef: MatDialogRef<CaEditComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _config: ConfigService,
    private _confirm: McConfirmService
  ) {
    this.isNew = (data.action === 'new');
    if (data.data) {
      this.row = new CaConfig(data.data);
    } else {
      this.row = new CaConfig();
    }
  }

  ngOnInit() {
    this.buildForm();
  }

  get nameCtrl(): FormControl {
    return this.baseForm.get('name') as FormControl;
  }

  get tlsCtrl(): FormControl {
    return this.baseForm.get('tls') as FormControl;
  }

  get debugCtrl(): FormControl {
    return this.baseForm.get('debug') as FormControl;
  }

  buildForm() {
    this.baseForm = this._fb.group({
      name: [this.row.name],
      containerName: [this.row.containerName],
      tls: [this.row.tls],
      debug: [this.row.debug],
      port: [this.row.port],
      admin: [this.row.admin],
      adminpw: [this.row.adminpw],
    });
  }

  updateModel() {
    const val = this.baseForm.getRawValue();
    this.row.name = val.name;
    this.row.containerName = val.containerName;
    this.row.tls = val.tls;
    this.row.debug = val.debug;
    this.row.port = val.port;
    this.row.admin = val.admin;
    this.row.adminpw = val.adminpw;
  }


  /*增加ca/修改ca*/
  doSave() {
    this.updateModel();
    this._config.doCaSave(this.row).subscribe(data => {
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
