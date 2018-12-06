import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import {MatDialog} from '@angular/material';

import { LoginService } from '../../services/login.service';
import { ChangePasswordComponent } from '../../auth/change-password/change-password.component';

@Component({
  selector: 'cdk-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
	isOpen: boolean = false;

  	//currentUser = null;
  	Hari;
    user = {
      username: 'Admin123$',
      password: '****'
    };


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
  	  private elementRef: ElementRef,
      private _login: LoginService,
      public dialog: MatDialog
    ) { }


  	ngOnInit() {

  	}


}
