export class testConfig{
  name:string;
  sertx:string;
  options:string;
  constructor(data=undefined) {
    this.name = '';
    this.sertx = '';
    this.options = '';
    if (data!=undefined) {
      for (let k in data) {
        this[k] = data[k];
      }
    }
  };
}
