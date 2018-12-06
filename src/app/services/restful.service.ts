import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {NgxSpinnerService} from 'ngx-spinner';

import {environment} from '../../environments/environment';
import {UserAccessService} from './user-access.service';
import {isArray} from 'util';
import {McConfirmService} from '../modules/mc-confirm/mc-confirm.service';

@AutoUnsubscribe()
@Injectable({
  providedIn: 'root'
})
export class RestfulService {
  private _url(path, service = 'service') {
    return environment.env[service + '_path'] + path.replace(/^\//, '');
  }

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _spinner: NgxSpinnerService,
    private _userAccess: UserAccessService,
    private _confirm: McConfirmService
  ) {
    console.log(environment);
  }

  public post(
    u,
    p = {},
    opt: any = {service: 'service', block: true}
  ): Observable<any> {
    const s = opt.service == undefined ? 'service' : opt.service;
    const url = this._url(u, s);
    const auth = opt.auth === true;
    const token = this._userAccess.getToken();
    const appid = btoa(environment.client_id + ':' + environment.client_secret);

    let headers = new HttpHeaders();
    if (auth) {
      headers = headers.append('Authorization', 'Basic ' + appid);
    } else {
      headers = headers.append('Authorization', 'Bearer ' + token || '');
      headers = headers.append('token', token);
    }

    return Observable.create(observer => {
      if (opt.block !== false) {
        this._spinner.show();
      }
      this._http.post<any>(url, p, {headers: headers}).subscribe(
        data => {
          if (opt.block !== false) {
            this._spinner.hide();
          }
          observer.next(data);
          observer.complete();
        },
        err => {
          if (opt.block !== false) {
            this._spinner.hide();
          }
          if (err.status === 401) {
            // Token Change ,need re login
            this._router.navigate([environment.env.token_err_url]);
          } else if (err.status == 0) {
            // this._message.sendMessage(
            //   err.statusText + '/' + err.message,
            //   'error'
            // );
          } else {
            /*后台系统异常没有返回信息*/
            setTimeout(() => {
              this._confirm.prompt('系统服务调用异常，请检查后重新输入');
            }, 0);
          }
        }
      );
    });
  }

  public get(
    u,
    p = {},
    opt: any = {service: 'service', block: true}
  ): Observable<any> {
    const s = opt.service == undefined ? 'service' : opt.service;
    const url = this._url(u, s);
    const auth = opt.auth === true;
    const token = this._userAccess.getToken();
    const appid = btoa(environment.client_id + ':' + environment.client_secret);

    let headers = new HttpHeaders();
    if (auth) {
      headers = headers.append('Authorization', 'Basic ' + appid);
    } else {
      headers = headers.append('Authorization', 'Bearer ' + token || '');
      headers = headers.append('token', token);
    }
    return Observable.create(observer => {
      if (opt.block !== false) {
        this._spinner.show();
      }
      this._http.get<any>(url, {headers: headers}).subscribe(
        data => {
          if (opt.block !== false) {
            this._spinner.hide();
          }
          observer.next(data);
          observer.complete();
        },
        err => {
          if (opt.block !== false) {
            this._spinner.hide();
          }
          if (err.status === 401) {
            // Token Change ,need re login
            this._router.navigate([environment.env.token_err_url]);
          } else if (err.status == 0) {
          } else {
            // console.log(err);
          }
        }
      );
    });
  }

  formPost(
    u,
    p = {},
    opt: any = {service: 'service', block: true, auth: false}
  ): Observable<any> {
    const s = opt.service == undefined ? 'service' : opt.service;
    const auth = opt.auth === true;
    const url = this._url(u, s);
    const token = this._userAccess.getToken();
    //    let formModel = new FormData();
    const appid = btoa(environment.client_id + ':' + environment.client_secret);
    const formModel = Object.keys(p)
      .map(k => k + '=' + p[k])
      .join('&');

    return Observable.create(observer => {
      if (opt.block !== false) {
        this._spinner.show();
      }
      let headers = new HttpHeaders();
      headers = headers.append(
        'Content-Type',
        'application/x-www-form-urlencoded'
      );

      if (auth) {
        headers = headers.append('Authorization', 'Basic ' + appid);
      } else {
        headers = headers.append('Authorization', 'Bearer ' + token || '');
      }

      // let pp = 'grant_type=password&username=admin&password=123456';
      this._http.post<any>(url, formModel, {headers: headers}).subscribe(
        data => {
          if (opt.block !== false) {
            this._spinner.hide();
          }
          observer.next(data);
          observer.complete();
        },
        err => {
          this._spinner.hide();
          if (err.status === 401) {
            // Token Change ,need re login
            this._router.navigate([environment.env.token_err_url]);
          } else {
            observer.error(err);
          }
        }
      );
    });
  }

  uploadFile(
    u,
    params,
    files,
    opt: any = {service: 'service', block: true, auth: false}
  ) {
    const s = opt.service == undefined ? 'service' : opt.service;
    const url = this._url(u, s);
    const auth = opt.auth === true;
    const token = this._userAccess.getToken();
    const appid = btoa(environment.client_id + ':' + environment.client_secret);

    const formModel = new FormData();
    Object.keys(params).forEach(k => formModel.append(k, params[k]));
    formModel.append('token', token);
    if (isArray(files)) {
      files.forEach(f => {
        formModel.append('files', f);
      });
    } else {
      formModel.append('files', files);
    }
    let headers = new HttpHeaders();
    /* headers = headers.append(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );  */

    if (auth) {
      headers = headers.append('Authorization', 'Basic ' + appid);
    } else {
      headers = headers.append('Authorization', 'Bearer ' + token || '');
    }

    return Observable.create(observer => {
      this._spinner.show();
      this._http.post<any>(url, formModel, {headers: headers}).subscribe(
        data => {
          this._spinner.hide();
          observer.next(data);
          observer.complete();
        },
        err => {
          this._spinner.hide();
          if (err.status === 401) {
            // Token Change ,need re login
            this._router.navigate([environment.env.token_err_url]);
          }
        }
      );
    });
  }

  download(u, p = {}): Observable<any> {
    const url = this._url(u);
    const token = this._userAccess.getToken();
    return Observable.create(observer => {
      let headers = new HttpHeaders();
      headers = headers.append('Authorization', 'Bearer ' + token || '');
      this._spinner.show();
      this._http
        .post(url, p, {headers: headers, responseType: 'blob'})
        .subscribe(
          data => {
            this._spinner.hide();
            observer.next(data);
            observer.complete();
          },
          err => {
            observer.error(err);
            this._spinner.hide();
          }
        );
    });
  }
}
