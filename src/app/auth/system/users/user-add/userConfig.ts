export class userConfig {
  username: string;
  email: string;
  phone: string;
  role: number;
  active: number;

  constructor(data = undefined) {
    this.username = '';
    this.email = '';
    this.phone = '';
    this.role = 0;
    this.active = 0;
    if (data != undefined) {
      for (let k in data) {
        this[k] = data[k];
      }
    }
  };
}
