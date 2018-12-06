import {Component, Inject, OnInit} from '@angular/core';
import {RestfulService} from '../../../../services/restful.service';
import {ConfigService} from '../../../../services/config.service';
import {McConfirmService} from '../../../../modules/mc-confirm/mc-confirm.service';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HostContainerComponent} from '../../host-managent/host-container/host-container.component';

@Component({
  selector: 'app-start-container',
  templateUrl: './start-container.component.html',
  styleUrls: ['./start-container.component.css']
})
export class StartContainerComponent implements OnInit {

  columnsToDisplay = ['name', 'ip', 'domain', 'action'];
  datas;
  configID;
  expandedRow;
  /*查询条件表单*/
  baseForm;
  /*分页*/
  page = {
    totalElements: 0,
    pageNum: 1,
    pageSize: 5
  };

  constructor(
    private _sheetRef: MatDialogRef<HostContainerComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _restful: RestfulService,
    private _config: ConfigService,
    private _confirm: McConfirmService,
    private _fb: FormBuilder
  ) {
    this.configID = data.data.id;
  }

  ngOnInit() {
    this.buildForm();
    this.getHost();
  }

  buildForm() {
    /*初始化赋值*/
    this.baseForm = this._fb.group({
      name: [''],
      ip: [''],
    });
  }

  updateModel() {
    const query: any = {};
    const val = this.baseForm.getRawValue();
    if (val.name != '') {
      query.name = val.name;
    }
    if (val.ip != '') {
      query.ip = val.ip;
    }
    return query;
  }

  /*查询主机列表--分页功能*/
  getHost() {
    this._config.getHostListInfo(this.updateModel(), this.page).subscribe(data => {
      this.datas = data.data.datas;
      this.page.totalElements = data.data.count;
    }, err => {
      if (err) {
        this._confirm.prompt(err);
      } else {
        this._confirm.prompt('系统服务异常，请检查后重新输入！');
      }
    });
  }

  /*分页查询数据*/
  pageChanged($event) {
    this.page.pageSize = $event.pageSize;
    this.page.pageNum = $event.pageIndex + 1;
    this.getHost();
  }

  /*选择容主机启动容器*/
  setOnHost(row) {
    row.configID = this.configID;
    this._confirm.confirm({
      message: '是否启用当前配置?',
      onAccept: () => {
        this._config.setOnHost(row).subscribe(data => {
          this._sheetRef.close(row);
          if(data) {
            this._confirm.alert('当前配置已经启用');
            this.getHost();
          } else {
            this._confirm.alert('配置启用出错，请稍后再试');
            this.getHost();
          }
        }, err => {
          if (err) {
            this._confirm.prompt('启动失败！');
          } else {
            this._confirm.prompt('系统服务异常，请检查后重新输入！');
          }
        });
      }
    });
  }

}
