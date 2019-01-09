import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import {McConfirmService} from "../modules/mc-confirm/mc-confirm.service";
import {ConfigService} from "../services/config.service";
import {Router} from "@angular/router";
import { LoginService } from '../services/login.service'


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']

})

export class AuthComponent implements OnInit{

  isOpen: boolean = false;

  @Input() currentUser = null;
  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement) {
    if (!targetElement) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

	constructor(
    private _router: Router,
    private _login: LoginService,
	  private media: ObservableMedia,
    private _confirm: McConfirmService,
    private _config: ConfigService,
    private elementRef: ElementRef
  ) { }

	ngOnInit() {

	}

	/*退出-登录页面*/
  loginOut() {
    this._login.doLogout();
  }

}



