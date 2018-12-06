export class HostConfig {
  name:string;
  type:string;
  ip:string;
  domain:string;
  protocol:string;
  port : number;
  constructor(data=undefined) {
    this.name = '';
    this.type = 'docker'; /*默认值*/
    this.ip = '';
    this.domain = '';
    this.protocol = '';
    this.port = 2375;
    if (data!=undefined) {
      for (let k in data) {
        this[k] = data[k];
      }
    }
  };
}
