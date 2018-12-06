export class CouchdbConfig {
  couchdbUsername: string;
  couchdbPassword: string;
  port: string;
  containerName: string;

  constructor(data = {}) {
    this.couchdbUsername = '';
    this.couchdbPassword = '';
    this.port = '';
    this.containerName = '';
    if (data != undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          this[k] = data[k];
        }
      }
    }
  }
}
