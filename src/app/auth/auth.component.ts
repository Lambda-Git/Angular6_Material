import {Component, OnInit, Input, HostListener, ElementRef} from '@angular/core';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {LoginService} from '../services/login.service';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

export class AuthComponent implements OnInit {
  @Input() isVisible = true;
  visibility = 'shown';
  isOpen = false;
  user = {
    username: 'Admin123$',
    password: '****'
  };

  sideNavOpened = true;
  matDrawerOpened = false;
  matDrawerShow = true;
  sideNavMode = 'side';

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

  ngOnChanges() {
    this.visibility = this.isVisible ? 'shown' : 'hidden';
  }

  constructor(
    private media: ObservableMedia,
    private elementRef: ElementRef,
    private _login: LoginService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.getLoginUserInfo();
    this.media.subscribe((mediaChange: MediaChange) => {
      this.toggleView();
    });
  }

  /*获取登录人信息*/
  getLoginUserInfo() {
    this._login.getCurLoginUser().subscribe(data => {
      // this.data = data.data.content;
    });
  }

  /*修改用户信息*/
  setUserInfo(user) {
    user.password = '';
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '600px',
      disableClose: true,
      data: {data: user}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  /*退出*/
  doLogout() {
    this._login.doLogout();
  }


  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation;
    //return outlet.isActivated ? outlet.activatedRoute : ''
  }

  toggleView() {
    if (this.media.isActive('gt-md')) {
      this.sideNavMode = 'side';
      this.sideNavOpened = true;
      this.matDrawerOpened = false;
      this.matDrawerShow = true;
    } else if (this.media.isActive('gt-xs')) {
      this.sideNavMode = 'side';
      this.sideNavOpened = false;
      this.matDrawerOpened = true;
      this.matDrawerShow = true;
    } else if (this.media.isActive('lt-sm')) {
      this.sideNavMode = 'over';
      this.sideNavOpened = false;
      this.matDrawerOpened = false;
      this.matDrawerShow = false;
    }
  }


}
