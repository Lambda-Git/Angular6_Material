import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import {FormBuilder, Validators} from "@angular/forms";
import {ConfigService} from "../../../services/config.service";
import {BlockDealDetailComponent} from "../block-deal-detail/block-deal-detail.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-assets-deal',
  templateUrl: './assets-deal.component.html',
  styleUrls: ['./assets-deal.component.css']
})
export class AssetsDealComponent implements OnInit {

  /*资产id*/
  assetsId;
  /*资产表名*/
  assetsName;
  /*查询表单*/
  searchForm;
  displayedColumns = ['datetime', 'height', 'dealTableName', 'operate', 'record'];
  /*资产详情data*/
  assetsDealData = {
    assetid: '',
    createtx: '',
    createtm: '',
    firstheigh: '',
    firstindex: '',
    lasttx: '',
    lasttm: '',
    lastheight: '',
    lastindex: '',
    lastrdhash: ''
  };
  /*资产中的用户细信息json格式*/
  userInfoJson;
  /*接口查询条件--根据资产id-*/
  limitJson = {
    assetid: ''
  };
  page = {
    totalElements: 0,
    pageNum: 0,
    pageSize: 10,
    start:0,
    end:10
  };
  /*交易修改记录data*/
  recordData;
  /*临时存放record数据*/
  recordArray = [] ;
  /*交易表名*/
  dealTableNames;
  /*当前选中的交易表名*/
  dealTableName;

  constructor(
    private _fb: FormBuilder,
    private _config: ConfigService,
    private _route: ActivatedRoute,
    private _matDialog: MatDialog
  ) {
    this._route.params.subscribe(routeParams => {
      /*取连接跳转带的id参数*/
      let param = JSON.parse(routeParams.id);
      this.assetsId = param.assetsId;
      this.assetsName = param.assetsName;
    });
  }

  ngOnInit() {
    this.getAssetsDetailInfo();
    this.getDealTableName();
  }

  /*获取一条资产详情信息*/
  /* mdb-cli mongoget NULL mdb picc_user '{"assetid":6634805563949581128}' NULL '{"limit":10}'*/
  getAssetsDetailInfo() {
    if(this.assetsId != ''){
      this.limitJson.assetid = this.assetsId;
      /*截取掉limitJsons中的assetid双引号*/
      let limitJsons = JSON.stringify(this.limitJson).replace(":\"",":").replace("\"}","}");
      this._config.getAssetsList('NULL mdb '+ this.assetsName +  ' \''+limitJsons+'\'' + ' NULL NULL').subscribe( data => {
        this.assetsDealData.assetid = data.assetid;
        this.assetsDealData.createtx = data.createtx;
        this.assetsDealData.createtm = data.createtm;
        this.assetsDealData.firstheigh = data.firstheigh;
        this.assetsDealData.firstindex = data.firstindex;
        this.assetsDealData.lasttx = data.lasttx;
        this.assetsDealData.lasttm = data.lasttm;
        this.assetsDealData.lastheight = data.lastheight;
        this.assetsDealData.lastindex = data.lastindex;
        this.assetsDealData.lastrdhash = data.lastrdhash;

        /*用户信息*/
        let userInfo = data.record;
        this.userInfoJson = JSON.stringify(userInfo,null,4);
      })
    }
  }

  /*获取所有交易表名*/
  getDealTableName() {
    this._config.getDealTableName('NULL mdb txtab').subscribe( data => {
      this.dealTableNames = data;
      console.log(this.dealTableNames[0].time);
      //查询当前资产创建时间之后所有的修改记录
      if(this.assetsDealData.createtm != '') {
        let startTime = this.assetsDealData.createtm.substring(0,4) + this.assetsDealData.createtm.substring(5,7);
        this.dealTableNames.forEach( nameData => {
          if( parseInt(nameData.time) > parseInt(startTime) || parseInt(nameData.time) == parseInt(startTime) ) {
            console.log(nameData);
            this.dealTableName = nameData.dealTableName;
            this.getRecordList();
          }
        })
      }
    })
  }

  /*根据 交易表名(时间)+资产id 查询当前资产的交易修改记录
   * mdb-cli mongoget NULL mdb txtab_201812 '{"assetid":6640290204471005934}' NULL NULL
   * */
  getRecordList() {
    if(this.assetsId != '') {
      this.limitJson.assetid = this.assetsId;
      let limitJsons = JSON.stringify(this.limitJson).replace(":\"",":").replace("\"}","}");
      this._config.getRecordList(' NULL mdb ' + this.dealTableName + ' \''+limitJsons+'\'' + ' NULL NULL').subscribe(data => {
        if( data != '0' ) {
          //一条数据时候解析出来为对象，多条解析出来为数组
          if( data.constructor == Object ) {
            //交易表名格式 txtab_201812
            data.dealTableName = 'txtab_' + data.datetime.substring(0,4) + data.datetime.substring(5,7);
            this.recordArray.push(data);
            console.log(this.recordData);
          }else {
            data.forEach( curData => {
              curData.dealTableName = 'txtab_' + curData.datetime.substring(0,4) + curData.datetime.substring(5,7);
            });
            this.recordArray = this.recordArray.concat(data);
            console.log(this.recordData);
          }
        }

        if( this.recordArray.length < 11) {
          /*表单赋值*/
          this.recordData = this.recordArray;
          console.log(this.recordData);
        }else{
          this.recordData = this.recordArray.slice(0,10);
        }
        this.page.totalElements = this.recordArray.length;
      })

    }
  }

  /*分页--数据赋值*/
  getRecordPageList() {
    if(this.page.end > this.page.totalElements) {
      this.recordData = this.recordArray.slice(this.page.start,this.page.totalElements);
    }else{
      this.recordData = this.recordArray.slice(this.page.start,this.page.end);
    }
  }

  createInfo(row) {
    //把字符串中所有的单引号替换成双引号--再转成json对象
    let obj = JSON.parse(row.record.replace(/'/g, '"'));
    const dialogRef = this._matDialog.open(BlockDealDetailComponent, {
      width: '800px',
      disableClose: true,
      data: {data:obj,title:'操作信息'}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  pageChanged($event) {
    this.page.pageSize = $event.pageSize;
    this.page.pageNum = $event.pageIndex;
    this.page.start = ($event.pageIndex)*10;
    this.page.end = ($event.pageIndex +1)*10;
    this.getRecordPageList();
  }

}
