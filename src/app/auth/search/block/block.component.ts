import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ConfigService} from "../../../services/config.service";
import {Router} from "@angular/router";
import {McConfirmService} from "../../../modules/mc-confirm/mc-confirm.service";

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockComponent implements OnInit {

  searchForm :FormGroup;
  baseForm;
  /*区块data*/
  blockData;
  /*块的总数数量*/
  blockCount;
  /*区块列表--字段模板*/
  displayedColumns = ['height', 'txnum', 'hash','last_block_id','datetime','action'];
  /*分页初始化赋值*/
  page = {
    totalElements: 0,
    pageNum: 0,
    pageSize: 10
  };

  constructor(
    private _fb: FormBuilder,
    private _config: ConfigService,
    private _confirm: McConfirmService,
    private _router: Router
  ) {
    this._config.getAllBlock('NULL mdb block NULL NULL NULL NULL').subscribe( dataCount => {
      //查询块总数量
      this.blockCount = dataCount;
      this.page.totalElements = dataCount;
      this.ngOnInit();
    })
  }

  ngOnInit() {
    this.buildForm();
    this.getBlockList();
  }

  get numberStartCtrl():FormControl{
    return this.searchForm.get('numberStart') as FormControl;
  }
  get numberEndCtrl():FormControl{
    return this.searchForm.get('numberEnd') as FormControl;
  }

  buildForm() {
    this.searchForm = this._fb.group({
      numberStart: [''],
      numberEnd: ['']
    });
  }

  /*点击查询按钮触发*/
  doQuery() {
    const query: any = {};
    this.page.pageNum = 0;
    this.getBlockList();
  }

  /*获取区块列表*/
  getBlockList(){
    const val = this.searchForm.getRawValue();
    let startNo = 0, endNo = this.blockCount;
    let limitJson = {skip: 0, limit: this.page.pageSize};
    if (val.numberStart !== '') {
      startNo = parseInt(val.numberStart);
    }
    if (val.numberEnd !== '') {
      endNo = parseInt(val.numberEnd);
    }
    limitJson.skip = startNo + (this.page.pageNum) * this.page.pageSize - 1;
    if (limitJson.skip <0) {limitJson.skip = 0; }
    if ((endNo !== -1) && ((limitJson.skip + limitJson.limit) > endNo)) {
      limitJson.limit = endNo - limitJson.skip;
    }
    this.page.totalElements = endNo - startNo + 1;
    this._config.getBlockList("NULL mdb block NULL NULL "+'\'' + JSON.stringify(limitJson) + '\'').subscribe( data => {
      /*查询块所有列表*/
      if( data.constructor == Object ) {
        /*只有一条数据时候--是个对象格式*/
        let arrayData = [];
        arrayData.push(data);
        this.blockData = arrayData;
      } else {
        this.blockData = data;
      }
    })

  }


  /*根据区块ID号查询当前区块的详情-跳转详情页面*/
  getBlockDetail(row) {
    this._router.navigate(['/auth/search/block-deal',row.height]);
  }

  /*分页按钮触发*/
  pageChanged($event) {
    this.page.pageSize = $event.pageSize;
    this.page.pageNum = $event.pageIndex;
    this.getBlockList();
  }

}
