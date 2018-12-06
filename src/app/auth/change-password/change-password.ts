export class ChangePassword {
  oldPass: string;
  newPass: string;
  confirmPass: string;

  constructor(data = {}) {
    this.oldPass = '';
    this.newPass = '';
    this.confirmPass = '';
    if (data != undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          this[k] = data[k];
        }
      }
    }
  }
}
