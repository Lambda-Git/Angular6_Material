import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { MDBUSERConfig } from './mdbuserConfig';
import { ConfigService } from '../../../services/config.service';
import {FormBuilder, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-mdbuser-edit',
  templateUrl: './mdbuser-edit.component.html',
  styleUrls: ['./mdbuser-edit.component.css']
})
export class MdbuserEditComponent implements OnInit {

  /*表单验证*/
  baseForm;
  nameValidator(control: FormControl): any{
    /*仅允许英文字母、数字和下划线*/
    const nameReg =  /^[\u4E00-\u9FA5a-zA-Z0-9_]{3,20}$/
    const result = nameReg.test(control.value);
    return result ? null : { name: '汉字、英文字母、数字、下划线组成，3-20位!' };
  }

  isNew=true;
  row:MDBUSERConfig;
  options;
  constructor(
    private _sheetRef: MatDialogRef<MdbuserEditComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _config: ConfigService
  ) {
    this.isNew = (data.action==='new');
    if (data.data) {
      this.row = new MDBUSERConfig(data.data);
    } else {
      this.row = new MDBUSERConfig();
    }
  }

  ngOnInit() {
    this.buildForm();
  }

  get nameCtrl():FormControl{
    return this.baseForm.get('name') as FormControl;
  }

  buildForm(){
    this.baseForm = this._fb.group({
      name : [this.row.name,[Validators.required,this.nameValidator]],
      pwd: [this.row.pwd],
      notify: [this.row.notify]
    });
    if(!this.isNew){
      this.nameCtrl.disable();
    }
  }

  updateModel() {
    let val = this.baseForm.getRawValue();
    this.row = Object.assign(this.row, val);
  }


  doSave() {
    this.updateModel();
    this._config.saveOrUpdateManagement('user',this.row).subscribe(data => {
      this._sheetRef.close(this.row);
    })
  }


}
