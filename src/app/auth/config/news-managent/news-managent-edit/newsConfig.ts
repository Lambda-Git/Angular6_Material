export class newsConfig{
  name:string;
  constructor(data=undefined) {
    this.name = '';
    if (data!=undefined) {
      for (let k in data) {
        this[k] = data[k];
      }
    }
  };
}
