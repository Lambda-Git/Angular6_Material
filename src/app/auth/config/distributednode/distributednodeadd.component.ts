import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { distributednodeConfig } from './distributednodeConfig';
import { ConfigService } from '../../../services/config.service';
import {Form, FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-distributednodeadd',
  templateUrl: './distributednodeadd.component.html',
  styleUrls: ['./distributednodeadd.component.css']
})
export class DistributednodeaddComponent implements OnInit {

  /*表单验证*/
  baseForm;
  nameValidator(control: FormControl): any{

    /*仅允许英文字母、数字和下划线*/
    const nameReg =  /^[\u4E00-\u9FA5a-zA-Z0-9_]{3,20}$/
    const result = nameReg.test(control.value);
    return result ? null : { name: '汉字、英文字母、数字、下划线组成，3-20位!' };

  }

  isNew=true;
  row:distributednodeConfig;
  options;

  constructor(
    private _sheetRef: MatDialogRef<DistributednodeaddComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb:FormBuilder,
    private _config: ConfigService
  ) {

    this.isNew = (data.action==='new');
    if (data.data) {
      this.row = new distributednodeConfig(data.data);
    } else {
      this.row = new distributednodeConfig();
    }

  }

  ngOnInit() {
    this.buildForm();

  }

  get nameCtrl():FormControl{
      return this.baseForm.get('name') as FormControl;
  }

  buildForm(){
      this.baseForm =this._fb.group({
        name : [this.row.name,[Validators.required,this.nameValidator]],
        dir :[this.row.dir],
        chainid : [this.row.chainid],
        abcifile : [this.row.abcifile],
        power : [this.row.power],
        abciserv : [this.row.abciserv],
        rpcserv : [this.row.rpcserv],
        p2pserv : [this.row.p2pserv],
        ipfsserv : [this.row.ipfsserv],
        ipfsapi : [this.row.ipfsapi],
        ipfsgw : [this.row.ipfsgw]
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
    this._config.addConfig('tmconf',this.row).subscribe(data => {
      this._sheetRef.close(this.row);
    })
  }


}
