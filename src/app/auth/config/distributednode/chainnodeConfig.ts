export class chainnodeConfig {
    name:string;
    nodename:String;
    pubkey:String;
    nodeid:String;
    addr:String;
    powerid:String;
    constructor(data=undefined) {
        this.name = '';
        this.nodename = '';
        this.pubkey = '';
        this.nodeid = '';
        this.addr = '';
        this.powerid ='';
        if (data!=undefined) {

            for (let k in data) {
                this[k] = data[k];
            }

        }
    };
}
