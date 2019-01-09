export class MDBUSERConfig {
    name:string;
    pwd:string;
    notify:string;
    constructor(data=undefined) {
        this.name = '';
        this.pwd = '';
        this.notify = '';
        if (data!=undefined) {
            for (let k in data) {
                this[k] = data[k];
            }
        }
    };
}
