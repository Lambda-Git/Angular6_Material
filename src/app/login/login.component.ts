import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../services/login.service';
import {McConfirmService} from '../modules/mc-confirm/mc-confirm.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  data = [];
  codeUrl;

  constructor(
    private _login: LoginService,
    private _router: Router,
    private _confirm: McConfirmService
  ) {
  }

  edit = {
    username: 'Admin123$',
    password: 'Admin$123$',
    code: ''
  };

  ngOnInit() {
    this.getValidateCode();
    this.edit.username = 'Admin123$';
    this.edit.password = 'Admin$123$';
    this.edit.code = '';
  }

  /*获取验证码+时间戳*/
  getValidateCode() {
    this.codeUrl =
      environment.env.service_path +
      'saas/common/kaptcha?ts=' +
      new Date().getTime();
  }

  /*登录*/
  doLogin() {
    /*点击登录按钮直接跳转系统首页*/
    this._router.navigate(['/auth/overview']);
    this._login.doLogin(this.edit).subscribe(data => {
        /*登录成功后跳转到系统概览*/
        this._router.navigate(['/auth/overview']);
      },
      err => {
        if (err) {
          this._confirm.prompt(err);
        } else {
          this._confirm.prompt('系统服务调用异常，请检查后重新输入');
        }
      }
    );
  }
}
