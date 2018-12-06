import {Component, OnInit} from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef, MatDialog} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {RestfulService} from '../../../services/restful.service';
import {McConfirmService} from '../../../modules/mc-confirm/mc-confirm.module';
import {PassagewayManagentAddComponent} from '../passageway-managent/passageway-managent-add/passageway-managent-add.component';
import {ConfigService} from '../../../services/config.service';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-passageway-managent',
  templateUrl: './passageway-managent.component.html',
  styleUrls: ['./passageway-managent.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PassagewayManagentComponent implements OnInit {

  columnsToDisplay = ['name', 'creator', 'createDate', 'status', 'consensusName', 'timeout', 'msgCount', 'desc', 'genesisBlock', 'action'];
  datas;
  data = [];
  page = {
    totalElements: 0,
    pageNum: 1,
    pageSize: 5
  };
  baseForm;

  constructor(
    private _sheet: MatBottomSheet,
    private _restful: RestfulService,
    private _confirm: McConfirmService,
    private _config: ConfigService,
    private _fb: FormBuilder,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.getPassway();
  }

  buildForm() {
    /*初始化赋值*/
    this.baseForm = this._fb.group({
      name: [''],
      status: ['-1'],
      genesisBlock: ['-1'],
    });
  }

  updateModel() {
    const query: any = {};
    const val = this.baseForm.getRawValue();
    if (val.name != '') {
      query.name = val.name;
    }
    if (val.status != '-1') {
      query.status = val.status;
    }
    if (val.genesisBlock != '-1') {
      /*字符串转boolean*/
      query.genesisBlock = eval(val.genesisBlock.toLowerCase());
    }
    return query;
  }

  getPassway() {
    this._config.getPassway(this.updateModel(), this.page).subscribe(data => {
      this.datas = data.data.datas;
      this.page.totalElements = data.data.count;
    });
  }

  pageChanged($event) {
    this.page.pageSize = $event.pageSize;
    this.page.pageNum = $event.pageIndex + 1;
    this.getPassway();
  }

  /*添加通道*/
  addConfig() {
    const dialogRef = this.dialog.open(PassagewayManagentAddComponent, {
      width: '600px',
      disableClose: true,
      data: {action: 'new'}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  /*修改通道*/
  updateConfig(cf) {
    const dialogRef = this.dialog.open(PassagewayManagentAddComponent, {
      width: '600px',
      disableClose: true,
      data: {action: 'update', data: cf}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  /*删除通道*/
  removeConfig(cf) {
    this._confirm.confirm({
      message: '是否真正删除通道[' + cf.name + ']?',
      onAccept: () => {
        // this._config.removeConfig('abci', cf.name).subscribe(data => {
        //   if (data) {
        //     this._confirm.alert('通道[' + cf.name + ']已经删除');
        //     // this.getConfigs();
        //   } else {
        //     this._confirm.alert('通道[' + cf.name + ']删除出错，请稍后再试', );
        //   }
        // });
      }
    });
  }

  /*签名通道*/
  underwriteConfig(cf) {
    alert('不签--！');
  }
}
