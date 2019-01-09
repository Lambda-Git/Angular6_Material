const lineRegExp = /\n/;
export class CliArgs {
  private ArgColumns = {
    /*区块链数据服务*/
    'abci': {
      columns: [
        'name',  //名称
        'sertx',  //网络服务参数
        '*dbstr',  //数据库连接参数
        '*options', //(NOTIFY|TXALL) 选项
        'statefile'   //状态文件，不展示
      ],
      list:'showrun abci',
      key: 'abci_add',
      add: 'abci_add',
      remove: 'abci_del',
      show: 'abci_show',
      turn: 'abci_turn'
    },
    /*区块链接口服务*/
    'mdbserv': {
      columns: [
        'name',  //名称
        'sertx', //网络服务参数
        'clitx',  //网络连接参数
        '*options', //USERAUTH 选项
        'pwd',  //服务密码
        '*dbstr',  //数据库连接参数
        'txtmout'
      ],
      list:'showrun mdbserv',
      key: 'mdbserv_add',
      add: 'mdbserv_add',
      remove: 'mdbserv_del',
      show: 'mdbserv_show',
      turn: 'mdbserv_turn'
    },
    /*区块链系统配置(tmconf)*/
    /*系统参数配置*/
    'tmconf': {
      columns: [
        'name',    //名称
        'dir',    //配置目录
        'chainid',  //区块链名称
        'abcifile',  //状态文件
        'power',  //节点权值，缺省为10
        'abciserv',   //链数据服务端口
        'rpcserv',   //链接口调用端口
        'p2pserv',   //链节点通讯端口
        'ipfsserv',   //文件节点通讯端口
        'ipfsapi',   //文件接口调用端口
        'ipfsgw'  //文件HTTP服务端口
      ],
      list:'showrun tmconf',
      key: 'tmconf_add',
      add: 'tmconf_add',
      remove: 'tmconf_del',
      show: 'tmconf_show',
      turn: 'tmconf_turn'
    },
    /*链节点参数配置*/
    'tmnode': {
      columns: [
        'name',    //链配置名称
        'nodename',    //节点名称
        'pubkey',  //公钥
        'nodeid',  //节点标识
        'addr',  //网络地址
        'powerid'   //节点权值，缺省为10
      ],
      list:'showrun tmnode',
      key: 'tmnode_add',
      add: 'tmnode_add',
      remove: 'tmnode_del',
      show: 'tmnode_show',
      turn: 'tmnode_turn'
    },
    /*区块链用户管理*/
    /*用户管理*/
    'user': {
      columns: [
        'name',  //名称
        'pwd',  //密码
        'notify',  //数据表
      ],
      list:'showrun user',
      key: 'user_add',
      add: 'user_add',
      show: 'user_show',
      turn: 'user_turn',
      remove: 'user_del'
    },
    /*用户服务*/
    'user_set': {
      columns: [
        'servstr',  //网络服务参数
        'secs',  //keepalive时间
      ],
      list:'showrun user',
      key: 'abci_add',
      add: 'user_set'
    },
  };
  private columns = [];
  private config;
  private configId;
  constructor(confid) {
    if (this.ArgColumns[confid]) {
      this.config = this.ArgColumns[confid];
      this.columns = this.ArgColumns[confid].columns;
    }
    if (this.columns == undefined) this.columns = [];
    this.configId = this.ArgColumns[confid].key;
  }

  get list(){return this.config.list};
  get add() {return this.config.add};
  get remove() {return this.config.remove};
  get show() {return this.config.show};
  get turn() {return this.config.turn};
  
  public cli2json(data) {
    let isValidLine = line => {
      if (line.startsWith("#") || line.startsWith("==")) {
        return false;
      }
      return true;
    };
    let line2json = line => {
      let tokens = line.split(/[\s,]+/);
      let jdata = {};
      tokens.forEach(ele => {
        if (ele == '') return;
        let p1 = ele.indexOf("(");
        let p2 = ele.lastIndexOf(")");
        if (p2 == -1) {
          p2 = ele.length;
        }
        if (p1 == -1) {
          jdata[ele] = "";
        } else {
          let k = ele.substring(0, p1);
          let v = ele.substring(p1 + 1, p2);
          if (k=='') return;
          jdata[k] = v;
        }
      });
      return jdata;
    };
    let jdata = {};
    let lines = data.split(/\n/);
    lines.forEach(line => {
      if (isValidLine(line)) {
        jdata = Object.assign({},jdata,line2json(line));
      }
    });
    return jdata;
  }

  public toArgs(val) {
    let args = "";
    this.columns.forEach(col => {
      let cname = col;
      let quota = false;
      if (col.charAt(0) == "*") {
        cname = col.substring(1);
        quota = true;
      }
      args += " ";
      if (val[cname] != "") {
        args += quota ? '"' : "";
        args += val[cname];
        args += quota ? '"' : "";
      } else {
        args += "NULL";
      }
    });
    return args;
  }
  public fromArgs(val) {
    return {};
  }
  public getConfigList(data) {
    let reg1 = /[^\s"']+|"([^"]*)"|'([^']*)'/gi;
    let lines = data.split(lineRegExp);
    let rows = [];
    lines.forEach(line => {
      let m = line.match(reg1);
      if( m != null && m != ''){
        if ((m.length>0)&&(m[0]==this.configId)) {
          let row={};
          this.columns.forEach((col,idx) => {
            let colName = col;
            if (col.charAt(0) == "*") {
              colName = col.substring(1);
            }
            let val = (m[idx+1]!=undefined)?m[idx+1].replace(/^["|'](.*)["|']$/g,'$1'):'';
            if( val == '"NULL"' ){
                val = '';
            }
            row[colName] = (val == 'NULL')?'':val;
          })
          rows.push(row);
        }
      }

    })
    return rows;
  }
}
