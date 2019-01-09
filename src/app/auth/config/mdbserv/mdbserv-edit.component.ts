import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { MDBSERVConfig } from './mdbservConfig';
import { ConfigService } from '../../../services/config.service';
import {Form, FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-mdbserv-edit',
  templateUrl: './mdbserv-edit.component.html',
  styleUrls: ['./mdbserv-edit.component.css']
})

export class MdbservEditComponent implements OnInit {

  /*表单验证*/
  baseForm;
  nameValidator(control: FormControl): any{
    /*仅允许英文字母、数字和下划线*/
    const nameReg =  /^[\u4E00-\u9FA5a-zA-Z0-9_]{3,20}$/
    const result = nameReg.test(control.value);
    return result ? null : { name: '汉字、英文字母、数字、下划线组成，3-20位!' };
  }

  isNew=true;
  row:MDBSERVConfig;
  options;
  constructor(
    private _sheetRef: MatDialogRef<MdbservEditComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _config: ConfigService
  ) {
    this.isNew = (data.action==='new');
    if (data.data) {
      this.row = new MDBSERVConfig(data.data);
    } else {
      this.row = new MDBSERVConfig();
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
      sertx: [this.row.sertx],
      clitx: [this.row.clitx],
      pwd: [this.row.pwd],
      dbstr: [this.row.dbstr],
      multipleOptions : [this._fb.array([])]
    });
    let multipleOptions = ['USERAUTH'];
    this.setMultipleOptions(multipleOptions, this.row.options);
    if(!this.isNew){
      this.nameCtrl.disable();
    }
  }

  setMultipleOptions(multipleOptions:string[],values='') {

    const multipleOptionsFGs = multipleOptions.map(singleOption =>{
      let obj={name: singleOption,checked:(values.indexOf(singleOption)>=0)};
      return this._fb.group(obj)
    });

    const singleOptionFormArray = this._fb.array(multipleOptionsFGs);
    this.baseForm.setControl('multipleOptions', singleOptionFormArray);
  }

  get multipleOptions():FormArray{
    return this.baseForm.get('multipleOptions') as FormArray;
  }

  updateModel() {
    let val = this.baseForm.getRawValue();
    this.row.name = val.name;
    this.row.sertx = val.sertx;
    this.row.clitx = val.clitx;
    this.row.pwd = val.pwd;
    this.row.dbstr = val.dbstr;
    let array = [];
    val.multipleOptions.forEach(option => {
      if( option.checked == true){
        array.push(option.name);
      }
    });
    if(array.length == 0){
      this.row.options = '';
    }else if(array.length == 1){
      this.row.options = array[0];
    }else if(array.length > 1){
      let str = '';
      for(var i = 0; i < array.length; i++){
        str += array[i] + '|';
      }
      if(str.length > 0 ){
        str = str.substr(0,str.length - 1);
      }
      this.row.options = str;
    }
  }

  doSave() {
    this.updateModel();
    this._config.addConfig('mdbserv',this.row).subscribe(data => {
      this._sheetRef.close(this.row);
    })
  }

}
