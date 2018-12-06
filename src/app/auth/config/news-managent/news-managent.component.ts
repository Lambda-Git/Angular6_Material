import {Component, OnInit} from '@angular/core';
import {MatBottomSheet, MatDialog} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {RestfulService} from '../../../services/restful.service';
import {McConfirmService} from '../../../modules/mc-confirm/mc-confirm.module';
import {NewsManagentEditComponent} from './news-managent-edit/news-managent-edit.component';
import {NewsService} from '../../../services/news.service';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-news-managent',
  templateUrl: './news-managent.component.html',
  styleUrls: ['./news-managent.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class NewsManagentComponent implements OnInit {

  columnsToDisplay = ['username', 'org', 'body', 'createDate', 'receivers', 'type', 'level', 'action'];
  users;
  data = [];
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
    private _sheet: MatBottomSheet,
    private _restful: RestfulService,
    private _confirm: McConfirmService,
    private _news: NewsService,
    private _fb: FormBuilder,
    public dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.buildForm();
    this.getNews();
  }

  buildForm() {
    /*初始化赋值*/
    this.baseForm = this._fb.group({
      org: [''],
      type: ['-1'],
      level: ['-1'],
    });
  }

  updateModel() {
    const query: any = {};
    const val = this.baseForm.getRawValue();
    if(val.org != ''){
      query.org = val.org;
    }
    if (val.type != -1) {
      query.type = val.type;
    }
    if (val.level != -1) {
      query.level = val.level;
    }
    return query;
  }

  /*分页查询数据*/
  pageChanged($event) {
    this.page.pageSize = $event.pageSize;
    this.page.pageNum = $event.pageIndex + 1;
    this.getNews();
  }

  /*查询消息列表*/
  getNews() {
    this._news.getNews(this.updateModel(),this.page).subscribe(data => {
      this.users = data.data.datas;
      this.page.totalElements = data.data.count;
      console.log(this.users);
    });
  }


  /*payload 和 返回信息 */
  detailMessage(row) {
    const dialogRef = this.dialog.open(NewsManagentEditComponent, {
      disableClose: true,
      data: {data: row}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

}
