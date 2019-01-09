export class distributednodeConfig {
    name:string;
    dir:String;
    chainid:String;
    abcifile:String;
    power:String;
    abciserv:String;
    rpcserv:String;
    p2pserv:String;
    ipfsserv:String;
    ipfsapi:String;
    ipfsgw:String;
    constructor(data=undefined) {
        this.name = '';
        this.dir = '';
        this.chainid = '';
        this.abcifile = '';
        this.power = '';
        this.abciserv = '';
        this.rpcserv = '';
        this.p2pserv = '';
        this.ipfsserv = '';
        this.ipfsapi = '';
        this.ipfsgw = '';
        if (data!=undefined) {
            for (let k in data) {
                this[k] = data[k];
            }
        }
    };
}
