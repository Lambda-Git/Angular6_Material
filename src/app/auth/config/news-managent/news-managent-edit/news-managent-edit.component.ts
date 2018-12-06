import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Form, FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {newsConfig} from './newsConfig';
import {NewsService} from '../../../../services/news.service';

@Component({
  selector: 'app-news-managent-edit',
  templateUrl: './news-managent-edit.component.html',
  styleUrls: ['./news-managent-edit.component.css']
})
export class NewsManagentEditComponent implements OnInit {

  /*表单验证*/
  baseForm;
  row;
  isNew = true;
  name;
  payLoadData;

  constructor(
    private _sheetRef: MatDialogRef<NewsManagentEditComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder ,
    private _news: NewsService,
  ) {
    this.name = data.data.username;
    this.payLoadData = data.data.payLoad;
    this.isNew = (data.action === 'new');
    if (data.data) {
      this.row = new newsConfig(data.data);
    } else {
      this.row = new newsConfig();
    }
  }

  ngOnInit() {
    this.getResponse();
  }

  getResponse() {
    this._news.getResponse().subscribe(data => {
          alert(data);
    });
  }

}
