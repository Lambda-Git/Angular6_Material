import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ConfigService} from '../../../../services/config.service';
import {McConfirmService} from '../../../../modules/mc-confirm/mc-confirm.service';

@Component({
  selector: 'app-host-container',
  templateUrl: './host-container.component.html',
  styleUrls: ['./host-container.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HostContainerComponent implements OnInit {

  columnsToDisplay = ['image', 'status', 'command', 'state', 'action'];
  datas;
  name;
  hostID;
  expandedRow;

  constructor(
    private _sheetRef: MatDialogRef<HostContainerComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _config: ConfigService,
    private _confirm: McConfirmService
  ) {
    /*容器表单赋值*/
    this.name = data.name;
    this.hostID = data.hostID;
    if (data) {
      this.datas = data.data;
    }

  }

  ngOnInit() {

  }

  /*根据当前主机查询容器*/
  searchContainer() {
    this._config.getContainerByHOst(this.hostID).subscribe(data => {
      /*给表单数据赋值datas*/
      this.datas = data.data;
    }, err => {
      if (err) {
        this._confirm.prompt(err);
      } else {
        this._confirm.prompt('系统服务异常，请检查后重新输入！');
      }
    });
  }


  /*重新启动*/
  reboot(row) {
    row.hostID = this.hostID;
    this._confirm.confirm({
      message: '是否要重启该容器？',
      onAccept: () => {
        this._config.rebootContainer(row).subscribe(data => {
          this._sheetRef.close(row);
          if (data) {
            this._confirm.alert('容器重启成功！');
            this.searchContainer();
          } else {
            this._confirm.alert('容器重启出错，请稍后再试');
            this.searchContainer();
          }
        }, err => {
          if (err) {
            this._confirm.prompt(err);
          } else {
            this._confirm.prompt('系统服务异常，请检查后重新输入！');
          }
        });
      }
    });
  }

  /*kill*/
  kill(row) {
    row.hostID = this.hostID;
    this._confirm.confirm({
      message: '是否要杀死该容器？',
      onAccept: () => {
        this._config.killContainer(row).subscribe(data => {
          this._sheetRef.close(row);
          if (data) {
            this._confirm.alert('杀死容器成功！');
            this.searchContainer();
          } else {
            this._confirm.alert('杀死容器出错，请稍后再试');
            this.searchContainer();
          }
        }, err => {
          if (err) {
            this._confirm.prompt(err);
          } else {
            this._confirm.prompt('系统服务异常，请检查后重新输入！');
          }
        });
      }
    });
  }

  /*展开、收起详情*/
  toggleConfigDetail(row) {
    row.hostID = this.hostID;
    if (this.expandedRow == row) {
      this.expandedRow = undefined;
    } else {
      this.expandedRow = row;

      /*根据主机id、容器id查询info*/
      this._config.getContainerInfo(row).subscribe(data => {
        row.expandedDetailData = data.data;
        /*处理数据一行一行显示*/

      });

    }
  }


}
