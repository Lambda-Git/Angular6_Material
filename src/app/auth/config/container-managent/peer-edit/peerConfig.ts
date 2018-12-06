export class PeerConfig {
  containerName: string;
  debug: boolean;
  ccDebug: boolean;
  tls: boolean;
  clientAuthEnable: boolean;
  anchorPeer: boolean;
  couchdbContainerName: string;
  servicePort: string;
  eventPort: string;
  ccPort: string;
  constructor(data = {}) {
    this.containerName = '';
    this.debug = false;
    this.ccDebug = false;
    this.tls = false;
    this.clientAuthEnable = false;
    this.anchorPeer = false;
    this.couchdbContainerName = '';
    this.servicePort = '';
    this.eventPort = '';
    this.ccPort = '';
    if (data != undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          this[k] = data[k];
        }
      }
    }
  }
}
