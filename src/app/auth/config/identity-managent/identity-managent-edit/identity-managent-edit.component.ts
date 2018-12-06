import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ConfigService} from '../../../../services/config.service';
import {McConfirmService} from '../../../../modules/mc-confirm/mc-confirm.service';
import {IdentityConfig} from './identityConfig';

@Component({
  selector: 'app-identity-managent-edit',
  templateUrl: './identity-managent-edit.component.html',
  styleUrls: ['./identity-managent-edit.component.css']
})
export class IdentityManagentEditComponent implements OnInit {

  /*表单验证*/
  baseForm;
  row: IdentityConfig;
  isNew = true;
  isRoot = '';

  constructor(
    private _sheetRef: MatDialogRef<IdentityManagentEditComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _confirm: McConfirmService,
    private _config: ConfigService
  ) {

    this.isNew = (data.action === 'new');
    this.isRoot = data.isRoot;
    if (data.data) {
      this.row = new IdentityConfig(data.data);
    } else {
      this.row = new IdentityConfig();
    }
  }

  ngOnInit() {
    this.buildForm();
  }

  get rootCtrl(): FormControl {
    console.log(this.baseForm);
    return this.baseForm.get('root') as FormControl;
  }

  get nameCtrl(): FormControl {
    return this.baseForm.get('name') as FormControl;
  }

  get useCtrl(): FormControl {
    return this.baseForm.get('use') as FormControl;
  }

  buildForm() {
    this.baseForm = this._fb.group({
      name: [this.row.name, [Validators.required]],
      commonName: [this.row.commonName],
      country: [this.row.country],
      state: [this.row.state],
      locality: [this.row.locality],
      organizationName: [this.row.organizationName],
      organizationUnit: [this.row.organizationUnit],
      root: [this.row.root],
      use: [this.row.use]
    });
    this.useCtrl.disable();
    /*如果存在主身份，root不可编辑，则不能重复保存主身份*/
    if (this.isRoot == 'yes') {
      this.rootCtrl.disable();
    }
  }

  updateModel() {
    const val = this.baseForm.getRawValue();
    this.row.name = val.name;
    this.row.commonName = val.commonName;
    this.row.country = val.country;
    this.row.state = val.state;
    this.row.locality = val.locality;
    this.row.organizationName = val.organizationName;
    this.row.organizationUnit = val.organizationUnit;
    this.row.root = val.root;
    this.row.use = val.use;
  }

  /*我的主子身份保存或者更新*/
  doOrgCardSave() {
    this.updateModel();
    this._config.doOrgCardSave(this.row).subscribe(data => {
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
