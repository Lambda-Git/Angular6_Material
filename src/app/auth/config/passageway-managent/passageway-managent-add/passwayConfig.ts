export class passwayConfig{
  name: string;
  systemChannel: string;
  consensusName: string;
  timeout: string;
  msgCount: string;
  desc: string;
  constructor( data = undefined ) {
    this.name = '';
    this.systemChannel = '';
    this.consensusName = '';
    this.timeout = '';
    this.msgCount = '';
    this.desc = '';
    if ( data != undefined ) {
      for (let k in data) {
        this[k] = data[k];
      }
    }
  };
}
