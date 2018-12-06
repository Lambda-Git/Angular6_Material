import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestfulService } from './restful.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(
    private _restful: RestfulService
  ) { }

  /*查询主机*/
  public getHostListInfo(q, page): Observable<any> {
    const u = Object.assign({}, q, page);
    u.active = 1;
    return Observable.create(observer => {
      this._restful
        .post('saas/host/list', u)
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }

  /*根据主机id查询容器*/
  public getContainerByHOst(row): Observable<any> {
    const u = {
      id: row
    };
    return Observable.create(observer => {
      this._restful
        .post('saas/host/list/container', u)
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }

  /*根据主机id、容器id查询info*/
  public getContainerInfo(row): Observable<any> {
    const u = {
      containerID: row.containerID,
      hostID: row.hostID
    };
    return Observable.create(observer => {
      this._restful
        .post('saas/container/info', u)
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });

  }

  /*重启容器*/
  public rebootContainer(row): Observable<any> {
    const u = {
      hostID : row.hostID,
      containerID : row.containerID,
    };
    return Observable.create(observer => {
      this._restful
        .post('saas/container/restart', u)
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });

  }


  /*kill容器*/
  public killContainer(row): Observable<any> {
    const u = {
      hostID : row.hostID,
      containerID : row.containerID,
    };
    return Observable.create(observer => {
      this._restful
        .post('saas/container/kill', u)
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });

  }

  /*新增或编辑主机*/
  public doCreateHOst(host): Observable<any> {
    if (host.id == undefined) {
      /*新增主机*/
      const u = {
        active: 1,
        domain: host.domain,
        ip: host.ip,
        name: host.name,
        port: host.port,
        protocol: host.protocol,
        type: host.type,

      };
      return Observable.create(observer => {
        this._restful
          .post('saas/host/add', u)
          .subscribe(data => {
            if (data.code != 0) {
              observer.error(data.message);
              return;
            }
            observer.next(data);
            observer.complete();
          });
      });
    } else {
      /*修改主机*/
      const u = {
        id: host.id,
        active: 0,
        name: host.name,
        domain: host.domain,
      };
      return Observable.create(observer => {
        this._restful
          .post('saas/host/update', u)
          .subscribe(data => {
            if (data.code != 0) {
              observer.error(data.message);
              return;
            }
            observer.next(data);
            observer.complete();
          });
      });
    }
  }

  /*删除主机*/
  public delHost(id): Observable<any> {
    const u = {
      id: id,
    };
    return Observable.create(observer => {
      this._restful
        .post('saas/host/delete', u)
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }

  /*查询我的主身份*/
  public getIdentityInfo(q, page): Observable<any> {
    const u = Object.assign({}, q, page);
    return Observable.create(observer => {
      this._restful
        .post('saas/ca/list', u)
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data.data);
          observer.complete();
        });
    });
  }

  /*我的身份保存--更新我的身份*/
  public doOrgCardSave(data): Observable<any> {
    if (data.id == undefined ) {
      /*我的身份保存*/
      return Observable.create(observer => {
        this._restful
          .post('saas/ca/save', data)
          .subscribe(data => {
            if (data.code != 0) {
              observer.error(data.message);
              return;
            }
            observer.next(data);
            observer.complete();
          });
      });
    } else {
      /*更新我的身份*/
      return Observable.create(observer => {
        this._restful
          .post('saas/ca/update', data)
          .subscribe(data => {
            if (data.code != 0) {
              observer.error(data.message);
              return;
            }
            observer.next(data);
            observer.complete();
          });
      });
    }

  }

  /*查询所有的身份信息列表*/
  public geAlltIdentityInfo(q, page): Observable<any> {
    const u = Object.assign({}, q, page);
    return Observable.create(observer => {
      this._restful
        .post('saas/org/list', u)
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }

  /*容器配置管理服务*/

  /*ca查询*/
  public getCa(q, page): Observable<any> {
    const u = Object.assign({}, q, page);
    u.type = 'CA';
    return Observable.create(observer => {
      this._restful
        .post('saas/config/list', u)
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }

  /*新增或编辑ca*/
  public doCaSave(row): Observable<any> {
    if (row.id == undefined) {
      /*新增ca*/
      return Observable.create(observer => {
        this._restful
          .post('saas/config/ca', row)
          .subscribe(data => {
            if (data.code != 0) {
              observer.error(data.message);
              return;
            }
            observer.next(data);
            observer.complete();
          });
      });
    } else {
      /*修改ca*/

      return Observable.create(observer => {
        this._restful
          .post('saas/config/ca', row)
          .subscribe(data => {
            if (data.code != 0) {
              observer.error(data.message);
              return;
            }
            observer.next(data);
            observer.complete();
          });
      });
    }
  }

  /*启动ca*/
  public setOnHost(row): Observable<any> {
    const u = {
      configID: row.configID,
      hostID: row.id,
    };
    return Observable.create(observer => {
      this._restful
        .post('saas/container/start', u)
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }

  /*peer查询*/
  public getPeer(q, page): Observable<any> {
    const u = Object.assign({}, q, page);
    u.type = 'PEER';
    return Observable.create(observer => {
      this._restful
        .post('saas/config/list', u)
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }

  /*新增或编辑peer*/
  public doPeerSave(row): Observable<any> {
    if (row.id == undefined) {
      /*新增peer*/
      return Observable.create(observer => {
        this._restful
          .post('saas/config/peer', row)
          .subscribe(data => {
            if (data.code != 0) {
              observer.error(data.message);
              return;
            }
            observer.next(data);
            observer.complete();
          });
      });
    } else {
      /*修改peer*/
      return Observable.create(observer => {
        this._restful
          .post('saas/config/peer', row)
          .subscribe(data => {
            if (data.code != 0) {
              observer.error(data.message);
              return;
            }
            observer.next(data);
            observer.complete();
          });
      });
    }
  }

  /*peer ---设为anchorPeer/取消anchorPeer */
  public turnAnchorPeer(row): Observable<any> {
    const u = {
      id: row.id,
      anchorPeer: row.anchorPeer,
    };
    return Observable.create(observer => {
      this._restful
        .post('saas/config/peer/anchor', u)
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }

  /*couchdb查询*/
  public getCouchdb(q, page): Observable<any> {
    const u = Object.assign({}, q, page);
    u.type = 'COUCHDB';
    return Observable.create(observer => {
      this._restful
        .post('saas/config/list', u)
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }

  /*新增或编辑couchdb*/
  public doCouchdbSave(row): Observable<any> {
    if (row.id == undefined) {
      /*新增couchdb*/
      return Observable.create(observer => {
        this._restful
          .post('saas/config/couchdb', row)
          .subscribe(data => {
            if (data.code != 0) {
              observer.error(data.message);
              return;
            }
            observer.next(data);
            observer.complete();
          });
      });
    } else {
      /*修改couchdb*/
      return Observable.create(observer => {
        this._restful
          .post('saas/config/couchdb', row)
          .subscribe(data => {
            if (data.code != 0) {
              observer.error(data.message);
              return;
            }
            observer.next(data);
            observer.complete();
          });
      });
    }
  }


  /*获取通道*/
  public getPassway( q, page ): Observable<any> {
    const u = Object.assign({}, q, page);
    return Observable.create(observer => {
      this._restful
        .post('saas/channel/page', u)
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }

  /*查询没有被使用共识名称consensus*/
  public getConsensus(): Observable<any> {
    const u = {
      used: false
    };
    return Observable.create(observer => {
      this._restful
        .post('saas/consensus/list', u)
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }

  /*新增通道/更新通道*/
  public addPassWay(row): Observable<any> {
    /*增加通道*/
    const u = {
      genesisBlock: true,
    }
    const w = Object.assign({}, row, u);
    return Observable.create(observer => {
      this._restful
        .post('saas/channel/add', w)
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }
}
