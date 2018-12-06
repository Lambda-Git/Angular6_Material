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

  init(){
      console.log('SVG Icons inited');
    this._matIconRegistry.addSvgIcon(`file_pdf`, this._domSanitizer.bypassSecurityTrustResourceUrl(`./assets/icons/file-pdf.svg`));
    this._matIconRegistry.addSvgIcon(`file_word`, this._domSanitizer.bypassSecurityTrustResourceUrl(`./assets/icons/file-word.svg`));
    this._matIconRegistry.addSvgIcon(`certificate`, this._domSanitizer.bypassSecurityTrustResourceUrl(`./assets/icons/certificate.svg`));
    this._matIconRegistry.addSvgIcon(`baseline-reorder`, this._domSanitizer.bypassSecurityTrustResourceUrl(`./assets/icons/baseline-reorder.svg`));
  }
}
