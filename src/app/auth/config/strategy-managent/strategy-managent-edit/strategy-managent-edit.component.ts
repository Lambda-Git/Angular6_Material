import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Form, FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {testConfig} from '../strategy-managent-edit/testConfig';
// import {ConfigService} from '../../../../services/config.service';

@Component({
  selector: 'app-strategy-managent-edit',
  templateUrl: './strategy-managent-edit.component.html',
  styleUrls: ['./strategy-managent-edit.component.css']
})
export class StrategyManagentEditComponent implements OnInit {

  /*表单验证*/
  baseForm;
  row;
  isNew = true;

  constructor(
    private _sheetRef: MatDialogRef<StrategyManagentEditComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder ,
    // private _config: ConfigService
  ) {
    this.isNew = (data.action === 'new');
    if (data.data) {
      this.row = new testConfig(data.data);
    } else {
      this.row = new testConfig();
    }
  }

  ngOnInit() {
    this.buildForm();
  }

  get nameCtrl() : FormControl{
    return this.baseForm.get('name') as FormControl;
  }

  buildForm(){
    this.baseForm = this._fb.group({
      name : [this.row.name,[Validators.required]],
      sertx : [this.row.sertx],
      options : [this.row.options],
    });
  }

  updateModel(){
    let val = this.baseForm.getRawValue();
    this.row.name = val.name;
    this.row.sertx = val.sertx;
    this.row.options = val.options;

  }

  doSend() {
    this.updateModel();
    // this._config.addConfig('abci', this.row).subscribe(data => {
    //   this._sheetRef.close(this.row);
    // });
  }

}
