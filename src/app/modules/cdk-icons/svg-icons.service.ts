import { Injectable } from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SvgIconsService {

  constructor(
    private _matIconRegistry: MatIconRegistry,
    private _domSanitizer: DomSanitizer
  ) {
  }

  init() {
    console.log('SVG Icons inited!');
    this._matIconRegistry.addSvgIcon(`password`, this._domSanitizer.bypassSecurityTrustResourceUrl(`./assets/icon/password.svg`));
    this._matIconRegistry.addSvgIcon(`watch`, this._domSanitizer.bypassSecurityTrustResourceUrl(`./assets/icon/watch.svg`));
    this._matIconRegistry.addSvgIcon(`noWatch`, this._domSanitizer.bypassSecurityTrustResourceUrl(`./assets/icon/noWatch.svg`));
  }
}
