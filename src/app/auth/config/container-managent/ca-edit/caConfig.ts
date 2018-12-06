export class CaConfig {
  name: string;
  containerName: string;
  tls: boolean;
  debug: boolean;
  port: string;
  admin: string;
  adminpw: string;

  constructor(data = {}) {
    this.name = '';
    this.containerName = '';
    this.tls = false;
    this.debug = false;
    this.port = '';
    this.admin = '';
    this.adminpw = '';
    if (data != undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          this[k] = data[k];
        }
      }
    }
  }
}
