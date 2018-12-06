export class IdentityConfig {
  name: string;
  commonName: string;
  country: string;
  state: string;
  locality: string;
  organizationName: string;
  organizationUnit: string;
  root: boolean;
  use: boolean;

  constructor(data = {}) {
    this.name = '';
    this.commonName = '';
    this.country = '';
    this.state = '';
    this.locality = '';
    this.organizationName = '';
    this.organizationUnit = '';
    this.root = false;
    this.use = false;
    if (data != undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          this[k] = data[k];
        }
      }
    }
  }
}
