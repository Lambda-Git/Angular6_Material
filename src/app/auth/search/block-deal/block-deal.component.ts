import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {ConfigService} from '../../../services/config.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {BlockDealDetailComponent} from '../block-deal-detail/block-deal-detail.component';

@Component({
  selector: 'app-block-deal',
  templateUrl: './block-deal.component.html',
  styleUrls: ['./block-deal.component.css']
})
export class BlockDealComponent implements OnInit {
  /*区块id--传参跳转到当前块交易列表页面*/
  blockId;
  /*当前块详情信息*/
  blockDetailData = {
    hash: '',//区块的HASH值
    last_block_id: '',//上一个区块的HASH值
    height: '',//区块的ID号
    txnum: '',//区块内的交易数
    tmstamp: '',//创建区块的unix时间戳
    datetime: ''//创建区块的时间
  };
  /*交易列表*/
  blockDealData;
  displayedColumns: string[] = ['id', 'addr', 'operate','tmstamp','action'];
  page = {
    totalElements: 0,
    pageNum: 0,
    pageSize: 10,
    start:0,
    end:10
  };
  /*临时存放所有的数据列表*/
  datas_page;

  /*表单字符串匹配查询*/
  applyFilter(filterValue: string) {
    this.blockDealData.filter = filterValue.trim().toLowerCase();
    console.log(this.blockDealData.filter);
  }


  constructor(
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _config: ConfigService,
    private _matDialog: MatDialog
  ) {
    this._route.params.subscribe(routeParams => {
      this.blockId = routeParams.id;
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.getBlockDealList();
  }

  /*查询指定块上的详情信息*/
  getBlockDealList() {
    this._config.getTotalDeal('NULL block?height='+this.blockId).subscribe( data => {
      //区块详情信息赋值
      this.blockDetailData.hash = data.result.block_meta.block_id.hash;
      this.blockDetailData.last_block_id = data.result.block.header.last_block_id.hash;
      this.blockDetailData.height = data.result.block.header.height;
      this.blockDetailData.txnum = data.result.block.header.num_txs;
      this.blockDetailData.tmstamp =  data.result.block.header.time;
      this.blockDetailData.datetime =  data.result.block.header.time;

      /*分页*/
      this.page.totalElements = data.result.block.header.num_txs;
      if(data.result.block.header.num_txs == '0'){
        this.blockDealData = [];
      }else{
        /*交易列表信息*/
        this.datas_page = [];/*清空datas_page--避免数据重复apend*/
        data.result.block.data.txs.forEach( rowData => {
          this.datas_page.push(JSON.parse(window.atob(rowData)));
        });
        /*交易列表-表单赋值*/
        this.blockDealData = new MatTableDataSource(this.datas_page.slice(this.page.start,this.page.end));
        // /*匹配filter  data 是所有的数据，不仅仅是当前分页10条数据*/
         this.blockDealData.data = this.datas_page;
      }
    })
  }

  getDealList() {
    /*交易列表-表单赋值*/
    this.blockDealData = new MatTableDataSource(this.datas_page.slice(this.page.start,this.page.end));
  }

  pageChanged($event) {
    this.page.pageSize = $event.pageSize;
    this.page.pageNum = $event.pageIndex;
    this.page.start = ($event.pageIndex)*10;
    this.page.end = ($event.pageIndex +1)*10;

    this.getDealList();
  }

  /*弹框展示--查询交易详情信息*/
  searchForDeal(row) {
    console.log(JSON.stringify(row,null,2));

    const dialogRef = this._matDialog.open(BlockDealDetailComponent, {
      width: '800px',
      disableClose: true,
      data: {data: row,title:'交易详情'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });


  }

}
