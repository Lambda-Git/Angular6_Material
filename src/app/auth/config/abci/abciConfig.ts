export class ABCIConfig {
    name:string;
    sertx:string;
    dbstr:string;
    options:string; //(NOTIFY|TXALL)
    statefile:string;
    constructor(data=undefined) {
        this.name = '';
        this.sertx = '';
        this.dbstr = '';
        this.options = '';
        this.statefile = '';
        if (data!=undefined) {
            for (let k in data) {
                this[k] = data[k];
            }
        }
    };
}
