import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ConfigService} from '../../../services/config.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent implements OnInit {

  searchForm;
  /*资产data*/
  private assetsData:Array<any>;
  /*资产表名*/
  assetsNames = [];
  /*当前页面选中的资产表名*/
  assetsName;
  /*资产列表--字段模板*/
  displayedColumn_assets = ['assetid', 'createtx', 'createtm','firstheigh','lasttm','lastrdhash','action'];
  page = {
    totalElements: 0,
    pageNum: 0,
    pageSize: 10
  };
  /*接口查询条件格式-*/
  limitJson = {
    limit:10, //取10条
    skip:0   //从多少条开始取,初始化默认从1条开始
  };
  /*接口查询条件--根据资产id-*/
  limitJsonId = {
    assetid: ''
  };

  constructor(
    private _fb: FormBuilder,
    private _config: ConfigService,
    private _router: Router,
  ) {
  }

  ngOnInit() {
    this.buildForm();
     this.getAssetsNames();
  }

  buildForm() {
    this.searchForm = this._fb.group({
      assetsTableName:['',[Validators.required]],
      assetsId:['']
    });
  }

  /*选择条件点击查询--.*/
  doSearchFor() {
    //切换查询时候初始化值
    this.page.pageNum = 0;
    this.limitJson.limit = 10;
    this.limitJson.skip = 0;
    this.limitJsonId.assetid = '';
    //获取表单上的查询条件
    const query: any = {};
    const val = this.searchForm.getRawValue();
    if(val.assetsTableName != '') {
      this.assetsName = val.assetsTableName;
      if (val.assetsId != '') {
        this.limitJsonId.assetid = val.assetsId;
      }
      this.getAssetsList();
    }

    return query;
  }

  /*查询资产表名*/
  getAssetsNames() {
    /*mdb-cli mongotab NULL mdb*/
    this._config.getAssetsNames('NULL mdb').subscribe( data => {
      data.forEach( rowData => {
        this.assetsNames.push({
          value: rowData
        });
      })
      if( this.assetsNames.length > 0) {
        /*查询表单赋值*/
        this.searchForm = this._fb.group({
          assetsTableName:[this.assetsNames[0].value,[Validators.required]],
          assetsId:['']
        });
        this.assetsName = this.assetsNames[0].value;
        this.getAssetsList();
      }
    })
  }

  getAssetsList(){
    /* 命令行：mdb-cli mongoget NULL mdb 表名picc_user NULL NULL '{"limit":10，"skip":0}'
     * mdb-cli mongoget NULL mdb picc_user '{"assetid":6634805563949581128}' NULL '{"limit":10}'
     */
    // limitJson转为字符串
    let limitJsons = JSON.stringify(this.limitJson);
    if(this.limitJsonId.assetid == '') {
      /*初始化查询--默认查第一个表名里的资产列表*/
      this._config.getAssetsList('NULL mdb '+ this.assetsName + ' NULL NULL ' + '\''+limitJsons+'\'').subscribe( data => {
        if(data.length == undefined) {
          /*只有一条数据时候--是个对象格式*/
          this.page.totalElements = 1;
          let arrayData = [];
          arrayData.push(data);
          this.assetsData = arrayData;
        } else {
          /*获取当前资产表名里所有资产数量*/
          this._config.getCurAssetsCount('NULL mdb '+this.assetsName+' NULL NULL NULL NULL').subscribe( count => {
            this.page.totalElements = count;
          });
          this.assetsData = data;
        }
      })
    } else {
      /*根据资产表名+资产id--查询---一个对象*/
      //添加资产id查询条件--处理
      let limitJsonIds = JSON.stringify(this.limitJsonId).replace(":\"",":").replace("\"}","}");
      this._config.getAssetsList('NULL mdb '+ this.assetsName +' '+ '\''+limitJsonIds+'\'' + ' NULL ' + '\''+limitJsons+'\'').subscribe( data => {
        this.page.totalElements = 1;
        let arrayData = [];
        arrayData.push(data);
        this.assetsData = arrayData;
      })
    }
  }

  pageChanged($event) {
    this.page.pageSize = $event.pageSize;
    this.page.pageNum = $event.pageIndex;
    this.limitJson.skip = ($event.pageIndex)*10;
    this.getAssetsList();
  }

  /*点击跳转--当前资产详情页面*/
  getAssetsDetail(row) {
    let param = {
      assetsId: row.assetid,//资产ID号
      assetsName: this.assetsName
    }
    let params = JSON.stringify(param);

    this._router.navigate(['/auth/search/assets-deal',params]);

  }

}
