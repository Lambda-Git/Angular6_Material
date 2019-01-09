export class MDBSERVConfig {
    name:string;
    sertx:string;
    dbstr:string;
    options:string; //(USERAUTHL)
    clitx:string;
    pwd:string;
    constructor(data=undefined) {
        this.name = '';
        this.sertx = '';
        this.dbstr = '';
        this.clitx = '';
        this.options = '';
        this.pwd = '';
        if (data!=undefined) {
            for (let k in data) {
                this[k] = data[k];
            }
        }
    };
}
