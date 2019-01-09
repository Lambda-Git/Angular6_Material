import { Injectable } from '@angular/core';
import {observable, Observable} from 'rxjs';

import { RestfulService } from './restful.service';
import { CliArgs } from './cli.args';
import {observeOn} from "rxjs/operators";
import {tryCatch} from "rxjs/internal-compatibility";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(
    private _restful: RestfulService
  ) { }

  public getConfigs(confKey): Observable<any> {
    let CONF = new CliArgs(confKey);
    return Observable.create(observer => {
      this._restful.mdbcli(CONF.list,'',true).subscribe(data => {
        observer.next(CONF.getConfigList(data));
        observer.complete();
      })
    })
  }

  public addConfig(confKey,row): Observable<any> {
    let CONF = new CliArgs(confKey);
    let args = CONF.toArgs(row);
    return Observable.create(observer => {
      this._restful.mdbcli(CONF.add,args).subscribe(data => {
        observer.next(data == '');
        observer.complete();
      },err => {
        observer.next(false);
        observer.complete();
      })
    })
  }

  public removeConfig(confKey,name): Observable<any> {
    let CONF = new CliArgs(confKey);
    return Observable.create(observer => {
      this._restful.mdbcli(CONF.remove,name).subscribe(data => {
        observer.next(data=='');
        observer.complete();
      },err => {
        observer.next(false);
        observer.complete();
      })
    })
  }

  public turnConfigOn(confKey,name): Observable<any> {
    let CONF = new CliArgs(confKey);
    return Observable.create(observer => {
      this._restful.mdbcli(CONF.turn,[name,'ON']).subscribe(data => {
        observer.next(data == '');
        observer.complete();
      },err => {
        observer.next(false);
        observer.complete();
      })
    })
  }
  public turnConfigOff(confKey,name): Observable<any> {
    let CONF = new CliArgs(confKey);
    return Observable.create(observer => {
      this._restful.mdbcli(CONF.turn,[name,'OFF']).subscribe(data => {
        observer.next(data == '');
        observer.complete();
      },err => {
        observer.next(false);
        observer.complete();
      })
    })
  }

  public getConfigStatus(confKey,name): Observable<any> {
    let CONF = new CliArgs(confKey);
    return Observable.create(observer => {
      this._restful.mdbcli(CONF.show,name).subscribe(data => {
        observer.next(CONF.cli2json(data));
        observer.complete();
      },err => {
        observer.next(false);
        observer.complete();
      })
    })
  }

  public saveAllConfig(): Observable<any> {
    return Observable.create(observer => {
      this._restful.mdbcli('saverun').subscribe(data => {
        observer.next(data=='');
        observer.complete();
      },err => {
        observer.next(false);
        observer.complete();
      })
    })
  }

  // 用户管理--查询服务
  public getUserManagement(): Observable<any> {
    return Observable.create(observer => {
      this._restful.mdbcli('showrun user').subscribe(data => {
        /*根据换行截取*/
        let lines = data.split(/(\n)/g);
        let rows = [];
        lines.forEach(line => {
          let m = line.match('user_add');
          if (m != null && m != '') {
            /*根据空格截取*/
            let rowLines = line.split(/[\s,]+/);
            /*拼接row对象*/
            let columns = ['name', 'pwd', 'notify'];
            let row = {};
            columns.forEach((col, idx) => {
              let colName = col;
              let val = (rowLines[idx + 1] != undefined) ? rowLines[idx + 1] : '';
              row[colName] = (val == 'NULL') ? '' : val;
            })

            rows.push(row);

          }
        })
        observer.next(rows);
        observer.complete();
      })
    })
  }

  /*用户管理-状态值查询*/
  public getUserManageStatus(name): Observable<any> {
    return Observable.create(observer => {
      this._restful.mdbcli('showrun user').subscribe(data => {
        let lines = data.split(/(\n)/g);
        let datas = [];
        let status = '';
        lines.forEach(line =>{
          let m = line.match(name);
          let k = [];
          if (m != null && m != '') {
            let lineArray = line.split(/[\s,]+/);
            if(lineArray.length < 4){
              status = lineArray[2];
            }
          }
        })
        /*如果没有取到status 默认为关闭状态*/
        if(status == '' ){
          observer.next('OFF');
          observer.complete();
        }else{
          observer.next('ON');
          observer.complete();
        }

      })
    })
  }

  /*用户管理--新增或者编辑 */
  public saveOrUpdateManagement(confKey,row): Observable<any> {
    let CONF = new CliArgs(confKey);
    let args = CONF.toArgs(row);
    return Observable.create(observer => {
      this._restful.mdbcli('user_add',args).subscribe(data => {
        observer.next(data=='');
        observer.complete();
      },err => {
        observer.next(false);
        observer.complete();
      })
    })
  }

  /*用户管理--开启配置服务*/
  public turnUserManageOn(confKey,name): Observable<any> {
    let CONF = new CliArgs(confKey);
    return Observable.create(observer => {
      this._restful.mdbcli(CONF.turn,[name,'ON']).subscribe(data => {
        observer.next(data == '');
        observer.complete();
      },err => {
        observer.next(false);
        observer.complete();
      })
    })
  }

  /*用户管理--关闭配置服务*/
  public turnUserManageOff(confKey,name):Observable<any> {
    let CONF = new CliArgs(confKey);
    return Observable.create(observer => {
      this._restful.mdbcli(CONF.turn,[name,'OFF']).subscribe(data => {
        observer.next(data == '');
        observer.complete();
      },err => {
        observer.next(false);
        observer.complete();
      })
    })
  }



  /*用户服务--获取user_set参数*/
  public getUserService(): Observable<any> {
    return Observable.create(observer => {
      this._restful.mdbcli('showrun user').subscribe(data => {
        /*根据换行截取*/
        let lines = data.split(/(\n)/g);
        let rows = [];
        lines.forEach(line => {
          let m = line.match('user_set');
          if (m != null && m != '') {
            /*根据空格截取*/
            let rowLines = line.split(/[\s,]+/);
            if(rowLines.length > 2){
              /*拼接row对象*/
              let columns = ['servstr', 'secs'];
              let row = {};
              columns.forEach((col, idx) => {
                let colName = col;
                let val = (rowLines[idx + 1] != undefined) ? rowLines[idx + 1] : '';
                row[colName] = (val == 'NULL') ? '' : val;
              })
              rows.push(row);
            }
          }
        })
        observer.next(rows);
        observer.complete();


      })
    })
  }

  /*用户服务--user_set*/
  public userSet(confKey,row):Observable<any> {
    let CONF = new CliArgs(confKey);
    let args = CONF.toArgs(row);
    return Observable.create(observer => {
      this._restful.mdbcli('user_set ',args).subscribe(data => {
        observer.next(data == '');
        observer.complete();
      },err => {
        observer.next(false);
        observer.complete();
      })
    })
  }
/**************************系统概览--查询********************************/
  /*MAXCHAIN--一条链*/
  public getMDBChannel(row): Observable<any> {
    let args = row;
    return Observable.create(observer => {
      this._restful.mdbcli('mdbserv_chaincmd',args).subscribe(data => {
          if(data != ''){
            /*后台返回为字符串-转为json格式*/
            observer.next(JSON.parse(data));
            observer.complete();
          }
      });
    })
  }

  /*根据链查询的块高度查询总交易量*/
  public getTotalDeal(row): Observable<any> {
    let args = row;
    return Observable.create(observer => {
      this._restful.mdbcli('mdbserv_chaincmd',args).subscribe(data => {
        if(data != ''){
          /*后台返回为字符串-转为json格式*/
          observer.next(JSON.parse(data));
          observer.complete();
        }
      });
    })
  }

  /*链上的节点列表*/
  public getNodeData(row):Observable<any> {
    let args = row;
    return Observable.create(observer => {
      this._restful.mdbcli('tmconf_show',args).subscribe(data =>{
        if(data != ''){
          /*定义json格式*/
          const nodeData = {
            status:'',
            nodeList:[]
          };
          //根据换行截取
          let lines = data.split(/(\n)/g);
          lines.splice(0,1);
          /*取当前节点参数*/
          let lines_1 = lines[1].split(/[\s,]+/);
          lines_1.forEach( rowline => {
            let a = rowline.match('status');
            if (a != null && a != '') {
              let begin = rowline.indexOf('(');
              let last = rowline.indexOf(')');
              nodeData.status = rowline.substring(begin+1,last);
            }
          });
          /*取所有节点信息*/
          lines.splice(0,3);
          lines.forEach( nodeLine => {
            /*过滤掉空串对象*/
            if(nodeLine.length > 2) {
              /*根据空格截取为数组*/
              let nodeInfoData =  nodeLine.split(/[\s,]+/);
                /*2-5为取的参数*/
                let nodeList = {
                  name:'',
                  addres:'',
                  power:'',
                  pubkey:'',
                  status:''
                }
                nodeList.name =  nodeInfoData[1];
                nodeList.addres = nodeInfoData[2];
                nodeList.power = nodeInfoData[3];
                nodeList.pubkey = nodeInfoData[4];
                nodeList.status = nodeInfoData[nodeInfoData.length - 1];
                /*push到json串中*/
                nodeData.nodeList.push(nodeList);
            }
          })
          observer.next(nodeData);
          observer.complete();
        }
      })
    })
  }

  /*查询每秒钟交易数量*/
  public getDealSecond(row): Observable<any> {
    let args = row;
    return Observable.create(observer => {
      this._restful.mdbcli('mdbserv_show',args).subscribe(data => {
        if(data != ''){
          let dealSecond = '';
          //根据换行截取
          let lines = data.split(/(\n)/g);
          lines.splice(0,1);
          let lines_1 = lines[1].split(/[\s,]+/);
          lines_1.forEach( lineData => {
            let a = lineData.match('rate');
            if (a != null && a != '') {
              let begin = lineData.indexOf('(');
              let last = lineData.indexOf(')');
              dealSecond = lineData.substring(begin+1,last);
            }
          })

          observer.next(dealSecond);
          observer.complete();
        }
      });
    })
  }

  /*查询块的总数量*/
  public getAllBlock(row): Observable<any> {
    let args = row;
    return Observable.create(observer => {
      this._restful.mdbcli('mongoget',args).subscribe(data => {
        if(data != undefined){
          observer.next(data);
          observer.complete();
        }
      });
    })
  }


  /*最新5个区块列表*/
  public getBlockList(row): Observable<any> {
    let args = row;
    return Observable.create(observer => {
      this._restful.mdbcli('mongoget',args).subscribe(data => {
        /*error表示后台系统异常*/
        let errorData = data.split(/(\n)/g)[0];
        if(errorData != 'error'){
          observer.next(JSON.parse(data));
          observer.complete();
        }
      });
    })
  }

  /*查询资产表名*/
  public getAssetsNames(row): Observable<any> {
    let args = row;
    return Observable.create(observer => {
      this._restful.mdbcli('mongotab',args).subscribe(data => {
        if(data != ''){
          /*按照都逗号分隔字符串*/
          let assetsNameAry = [];
          /*以换行截取，取第一个为data;避免最后个表名带有换行参数*/
          data.split(/(\n)/g)[0].split(',').forEach( rowData => {
            /*去掉block、_20、file等非资产表*/
            let a = rowData.match('block');
            let b = rowData.match('_20');
            let c = rowData.match('file');
            if( a == null && b == null && c == null) {
              assetsNameAry.push(rowData);
            }
          });
          observer.next(assetsNameAry);
          observer.complete();
        }
      });
    })
  }

  /*根据表名查询+条件==资产列表*/
  public getAssetsList(row): Observable<any> {
    let args = row;
    return Observable.create(observer => {
      this._restful.mdbcli('mongoget',args).subscribe(data => {
        if(data.substring(1,6) == 'error'){
          /*后台系统报错*/
          console.log(data);
        }
        if(data != ''){
          console.log(data);
          let arrayData = JSON.parse(data);
          let array =data.split('},');
          array.forEach( (arrData,index) => {
            let assetid = '';
            let createtx = '';
            let lasttx = '';
            arrData.split(',').forEach( lineData => {
              let a = lineData.match('"assetid"');
              if (a != null && a != '') {
                let begin = lineData.indexOf(':');
                let last = lineData.length;
                /*空格占了一个字符串+1*/
                assetid = lineData.substring(begin+2,last);
              }

              let b = lineData.match('"createtx"');
              if( b != null && b != '') {
                let begin = lineData.indexOf(':');
                let last = lineData.length;
                createtx = lineData.substring(begin+2,last);
              }

              let c = lineData.match('"lasttx"');
              if(c != null && c != '') {
                let begin = lineData.indexOf(':');
                let last = lineData.length;
                lasttx = lineData.substring(begin+2,last);
              }

            })
            if( arrayData != 0) {
              if(arrayData.length != undefined){
                arrayData[index].assetid = assetid;
                arrayData[index].createtx = createtx;
                arrayData[index].lasttx = lasttx;
              } else {
                /*length为undefine为单个对象*/
                arrayData.assetid = assetid;
                arrayData.createtx = createtx;
                arrayData.lasttx = lasttx;
              }
            } else {
              /*arrayData == 0 查询数据为0条  赋空值*/
              arrayData = [];
            }
          })
          observer.next(arrayData);
          observer.complete();
        }
      });
    })
  }

  /*查询当前资产表名里资产总数量*/
  public getCurAssetsCount(row): Observable<any> {
    let args = row;
    return Observable.create(observer => {
      this._restful.mdbcli('mongoget',args).subscribe(data => {
          observer.next(data);
          observer.complete();
      });
    })
  }

  /*查询所有交易表名*/
  public getDealTableName(row): Observable<any> {
    let args = row;
    return Observable.create(observer => {
      this._restful.mdbcli('mongotab',args).subscribe(data => {
        let datas = 'txtab_201808,txtab_201809,txtab_201810,txtab_201811,txtab_201812,txtab_201901';
        if(data != '') {
          let newDatas = [];
          //以换行截取去掉换行导致的空串，再以','截取
          datas.split(/(\n)/g)[0].split(',').forEach( rowData => {
            let obj = {
              dealTableName:'',
              time:''
            };
            let year = rowData.substring(rowData.indexOf('_')+1,rowData.indexOf('_')+5);
            let month = rowData.substring(rowData.indexOf('_')+5,rowData.indexOf('_')+7);
            obj.dealTableName = rowData;
            obj.time = year + month;
            newDatas.push(obj);
          });
          observer.next(newDatas);
          observer.complete();
        }
      });
    })
  }

  /*根据资产表名(时间：年月)+资产id查询资产交易记录*/
  public getRecordList(row): Observable<any> {
    let args = row;
    return Observable.create(observer => {
      this._restful.mdbcli('mongoget',args).subscribe(data => {
        if(data.split(/(\n)/g)[0] != '0') {
          observer.next(JSON.parse(data));
        }else{
          observer.next('0');
        }
        observer.complete();
      });
    })
  }

  /*根据资产表名(时间：年月)+资产id查询资产交易记录--总数
  *  暂未用
  * */
  public getRecordListCount(row): Observable<any> {
    let args = row;
    return Observable.create(observer => {
      this._restful.mdbcli('mongoget',args).subscribe(data => {
        observer.next(data);
        observer.complete();
      });
    })
  }

}
