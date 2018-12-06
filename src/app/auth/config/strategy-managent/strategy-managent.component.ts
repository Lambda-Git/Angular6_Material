import {Component, OnInit} from '@angular/core';
import {MatBottomSheet, MatDialog} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {RestfulService} from '../../../services/restful.service';
import {McConfirmService} from '../../../modules/mc-confirm/mc-confirm.module';
// import { ConfigService } from '../../../services/config.service';
import {StrategyManagentEditComponent} from './strategy-managent-edit/strategy-managent-edit.component';

@Component({
  selector: 'app-strategy-managent',
  templateUrl: './strategy-managent.component.html',
  styleUrls: ['./strategy-managent.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class StrategyManagentComponent implements OnInit {

  columnsToDisplay = ['name', 'sertx', 'options', 'action'];
  users;
  data = [];
  expandedRow;
  _user;

  constructor(
    private _sheet: MatBottomSheet,
    private _restful: RestfulService,
    // private _config: ConfigService,
    private _confirm: McConfirmService,
    /*伪造假数据*/
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this._user.getStrategy().subscribe(users => {
      this.users = users;
      console.log(this.users);
    });
  }


  // getConfigs() {
  //   this._config.getConfigs('abci').subscribe(data => {
  //     this.data = data;
  //     this.data.forEach(conf => {
  //       this.getConfigStatus(conf.name);
  //     });
  //   });
  // }


  updateConfig(cf) {
    const dialogRef = this.dialog.open(StrategyManagentEditComponent, {
      width: '600px',
      disableClose: true,
      data: {action: 'update', data: cf}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //this.getConfigs();
      }
    });
  }

  /*策略解析*/
  analysisConfig() {
    alert('解析策略？');
  }

  /*检测策略*/
  testConfig() {
    alert('检测策略？');
  }

}
