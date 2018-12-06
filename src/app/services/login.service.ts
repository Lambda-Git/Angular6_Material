import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Md5} from 'ts-md5';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

import {RestfulService} from './restful.service';
import {UserAccessService} from './user-access.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  user;
  private _tokenChecker: Subscription;

  constructor(
    private _restful: RestfulService,
    private _user: UserAccessService,
    private _router: Router
  ) {
  }

  /*登录*/
  public doLogin(user): Observable<any> {
    const u = {
      grant_type: 'password',
      username: user.username,
      password: user.password,
      code: user.code
    };
    return Observable.create(observer => {
      this._restful.post('saas/user/login', u, {auth: true}).subscribe(
        data => {
          if (data.code != 0) {
            /*登录失败返回message*/
            observer.error(data.message);
            return;
          }
          if (data.code == 0) {
            if (data.data == undefined) {
              /*账号被锁定*/
              observer.error(data.message);
              return;
            } else {
              /*登录成功*/
              this._user.setToken(data.data);
              data.token = data.data;
              observer.next(false);
              observer.complete();
            }
          }
        },
        err => {
          if (err.status == 400) {
            observer.error({systemError: false});
          } else {
            observer.error({
              systemError: true,
              msg: '系统服务调用异常，请检查后重新登录！'
            });
          }
        }
      );
    });
  }

  /*获取当前登录人信息*/
  public getCurLoginUser(): Observable<any> {
    return Observable.create(observer => {
      this._restful.post('saas/user/info').subscribe(data => {
        if (data) {
          observer.next(data);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  /*退出*/
  public doLogout() {
    this.user = undefined;
    this._user.clearToken();
    if (this._tokenChecker != undefined) {
      this._tokenChecker.unsubscribe();
    }
    this._router.navigate([environment.env.token_err_url]);
    return;
  }

  /*添加或编辑用户*/
  public doCreateUser(user): Observable<any> {
    if (user.id == undefined) {
      /*新增用户*/
      const key = 'password';
      const value = Md5.hashStr('12345678');
      user[key] = value;
      return Observable.create(observer => {
        this._restful.post('saas/user/add', user).subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
      });
    } else {
      /*修改用户*/
      return Observable.create(observer => {
        this._restful.post('saas/user/update', user).subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
      });
    }
  }

  /*删除用户*/
  public delUser(ids): Observable<any> {
    return Observable.create(observer => {
      this._restful.post('saas/user/delete', ids).subscribe(data => {
        if (data.code != 0) {
          observer.error(data.message);
          return;
        }
        observer.next(data);
        observer.complete();
      });
    });
  }

  /*查询用户列表*/
  public getUserList(q, page): Observable<any> {
    /*assign合并两个对象，过滤undefined*/
    const u = Object.assign({}, q, page);
    return Observable.create(observer => {
      this._restful.post('saas/user/list', u).subscribe(data => {
        if (data.code != 0) {
          observer.error(data.message);
          return;
        }
        observer.next(data);
        observer.complete();
      });
    });
  }

  /*启用或禁用用户*/
  public changeUserStatus(data): Observable<any> {
    const u = {
      id: data.id,
      active: data.active
    };
    return Observable.create(observer => {
      this._restful.post('saas/user/active', u).subscribe(data => {
        if (data.code != 0) {
          observer.error(data.message);
          return;
        }
        observer.next(data);
        observer.complete();
      });
    });
  }

  /*修改密码*/
  public changeUserPassword(oldPass, newPass, confirmPass): Observable<any> {
    /*Md5处理后为32位*/
    const data = {
      oldPass: Md5.hashStr(oldPass),
      newPass: Md5.hashStr(newPass),
      confirmPass: Md5.hashStr(confirmPass)
    };
    return Observable.create(observer => {
      this._restful.post('saas/user/changePass', data).subscribe(result => {
        if (result.code != 0) {
          observer.error(result.message);
          return;
        }
        observer.next(result);
        observer.complete();
      });
    });
  }
}
