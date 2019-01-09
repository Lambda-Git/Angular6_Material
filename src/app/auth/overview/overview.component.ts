import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfigService} from '../../services/config.service';
import { EChartOption } from 'echarts';

declare const require: any;

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  /*表单验证*/
  searchForm :FormGroup;
  baseForm;
  /*链data*/
  channelData = {
    channelName:'',
    totalBlock:'',
    totalDeal:'',
    curNodeName:''
  };
  /*区块data*/
  blockData = [];
  /*节点data*/
  nodeData = [];
  /*当前节点状态*/
  curNodeStatus;
  /*资产data*/
  assetsData;
  dealData = {
    id: '',//交易ID号
    addr:'',//发起交易的主机号端口号
    rdhash: '',//交易用户数据的哈希值
    tmstamp:'',//交易的 unix 时间戳
    lasttx:'',//上一笔交易的 ID 号
  };
  /*区块列表--字段模板*/
  displayedColumns = ['height','txnum','datetime'];
  /*资产列表--字段模板*/
  displayedColumn_assets = ['id', 'adress', 'database','number','created','action'];
  /*节点列表--字段模板*/
  displayedColumn_node = ['name', 'addres', 'power','pubkey','status'];
  /*查询分类*/
  searchType = 1;
  /*区块id*/
  blockId;
  /*块的总数数量*/
  blockCount;
  /*资产id*/
  assetsId;
  /*资产表名*/
  assetsNames = [];
  /*当前资产表名*/
  assetsName;
  /*资产查询条件*/
  param ={
    assetsId: '',
    assetsName: ''
  };
  //定时器
  private timer: any;
  private timer_: any;
  /*菜单定位--css参数*/
  menuType;

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _config: ConfigService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.menuType = 1;
    this.getMDBChannel();
    this.getBlockList();
    this.getNodeData();
    this.getAssetsNames();
  }



  buildForm() {
    this.searchForm = this._fb.group({
      id: ['',[Validators.required]],
      assetsTableName: ['']
    });
  }

  updateModel() {
    const query: any = {};
    const val = this.searchForm.getRawValue();
    if (val.id != '') {
      query.id = val.id;
    }
    if(this.searchType == 1){
      this.blockId = query.id;
    }else {
      this.param.assetsName = this.assetsName.replace(/[\r\n]/g,"");
      this.param.assetsId = query.id;
    }
    return query;
  }

  /*手动选择资产表名*/
  selectTableName(value) {
    this.assetsName = value;
  }

  /*选择查询类型*/
  searchForType(value) {
    if(value == '1'){
      this.searchType = 1;
    }else {
      this.searchForm = this._fb.group({
        id: ['',[Validators.required]],
      });
      this.searchType = 2;
    }

  }
  /*根据输入id查询跳转*/
  doSearchFor() {
    this.updateModel();
    if(this.searchType == 1){
      // this._router.navigate(['/auth/config/block-deal',this.blockId]);
      window.open('/auth/search/block-deal/' + this.blockId, '_blank');
    }else{
      // this._router.navigate(['/auth/config/assets-deal',this.assetsId]);
      let params = JSON.stringify(this.param);
      window.open('/auth/search/assets-deal/' + params , '_blank');
    }

  }

  /********************查询链信息--- mdb-cli mdbserv_chaincmd status***************/
  getMDBChannel() {
    this._config.getMDBChannel('NULL status').subscribe(data => {
      this.channelData.channelName = data.result.node_info.network;
      let blockHeight = data.result.sync_info.latest_block_height;
      this.goRunBlockHeight(blockHeight);
      this.channelData.curNodeName = data.result.node_info.moniker;
      /*根据块高度查询当前块的信息--mdb-cli mdbserv_chaincmd block?height= */
      this._config.getTotalDeal('NULL block?height=' + blockHeight ).subscribe( data =>{
        let totalDeal = data.result.block_meta.header.total_txs;
        this.goRunTotalDeal(totalDeal);

        /*查询最后一个区块--最后一笔交易*/
        if( data.result.block.data.txs.length < 2 && data.result.block.data.txs.length > 0){
            /*this.dealData赋值  - base64解码*/
          let datas = JSON.parse(window.atob(data.result.block.data.txs));
          /*显示的交易字段*/
          this.dealData.id = datas.id;
          this.dealData.addr = datas.addr;
          this.dealData.rdhash = datas.asset.rdhash;
          this.dealData.tmstamp = datas.tmstamp;
          this.dealData.lasttx = datas.asset.lasttx;

        }else if(data.result.block.data.txs.length > 2 || data.result.block.data.txs.length == 2 ){
          const datas = JSON.parse(window.atob(data.result.block.data.txs.splice(-1)));
          this.dealData.id = datas.id;
          this.dealData.addr = datas.addr;
          this.dealData.rdhash = datas.asset.rdhash;
          this.dealData.tmstamp = datas.tmstamp;
          this.dealData.lasttx = datas.asset.lasttx;
        }
      })
    });
  }

  /********************查询最新区块信息*******************/
  /*mdb-cli mongoget NULL mdb block NULL NULL --查询所有的块列表*/
  getBlockList(){
    /*先查询块高度*/
    this._config.getAllBlock('NULL mdb block NULL NULL NULL NULL').subscribe( dataCount => {
      //块总数量
      this.blockCount = dataCount;
      if(this.blockCount > 4){
        /*最后一个NULL 为json '{"limit":10,"skip":15}' */
        const limitJson = {
          limit:5, //取5条
          skip:0   //从多少条开始取
        };
        limitJson.skip = dataCount-5;
        // limitJson转为字符串
        let limitJsons = JSON.stringify(limitJson);
        this._config.getBlockList("NULL mdb block NULL NULL "+'\''+limitJsons+'\'').subscribe( data => {
          //降序
          this.blockData = data.reverse();
        })
      }else{
        const limitJson = {
          limit: this.blockCount,
          skip:0   //从多少条开始取
        };
        // limitJson转为字符串
        let limitJsons = JSON.stringify(limitJson);
        this._config.getBlockList("NULL mdb block NULL NULL "+'\''+limitJsons+'\'').subscribe( data => {
          //降序
          this.blockData = data.reverse();
        })
      }


    })

  }

  /*******************查询资产表名*************/
  getAssetsNames() {
    /*mdb-cli mongotab NULL mdb*/
    this._config.getAssetsNames('NULL mdb').subscribe( data => {
      data.forEach( rowData => {
        this.assetsNames.push({
          value: rowData
        });
      });
      if( this.assetsNames.length > 0 ) {
        this.assetsName = this.assetsNames[0].value;
      }

    })
  }

  /*******************查询链上节点信息*************/
  /* mdb-cli tmconf_show */
  getNodeData() {
    this._config.getNodeData('').subscribe( data => {
      /*当前节点状态*/
      this.curNodeStatus = data.status;
      /*节点信息列表*/
      this.nodeData = data.nodeList;
      console.log(this.nodeData);
    })
  }

  /*数字累加--滚动效果*/
  //块高度
  goRunBlockHeight(number) {
    let curNumber = 0;
    if( curNumber < number ) {
      this.timer_ = setInterval(() => {
        // @ts-ignore
        curNumber += parseInt(number/100);
        this.channelData.totalBlock = curNumber.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
        if(curNumber > number) {
          clearInterval(this.timer_);
          this.channelData.totalBlock = number.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
          curNumber = 0;
        }

      }, 10);
    }
  }
  //总交易量
  goRunTotalDeal(number) {
    let curNumber = 0;
    if( curNumber < number ) {
      this.timer = setInterval(() => {
        // @ts-ignore
        curNumber += parseInt(number/100);
        this.channelData.totalDeal = curNumber.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
        if(curNumber > number) {
          clearInterval(this.timer);
          this.channelData.totalDeal = number.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
          curNumber = 0;
        }

      }, 10);
    }
  }


  ngOnDestroy() {

  }


}
