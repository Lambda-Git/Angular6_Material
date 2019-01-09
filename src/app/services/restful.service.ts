import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Md5 } from 'ts-md5';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { NgxSpinnerService } from 'ngx-spinner';

import { environment } from '../../environments/environment';
@AutoUnsubscribe()
@Injectable({
  providedIn: 'root'
})
export class RestfulService {
  private _url(path='/mdbcli', service = 'mdbcli') {
    let upath = environment.env['mdbcli_server'];
    let uport = environment.env['mdbcli_port'];
    console.log(window.location.hostname);
    if (upath ===  undefined) {
      upath = window.location.hostname;
    };
    if (uport === undefined) {
      uport = '8080';
    }
    return 'http://' + upath + ':' + uport + '/' + path.replace(/^\//, '');
  }
  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _spinner: NgxSpinnerService
  ) {
  }

  private filterLines(data) {
    let isValidLine=(line) => {
      if (line.startsWith('#') || line.startsWith('==') || line=='') {
        return false;
      }
      return true;
    }
    let jdata = [];
    let lines = data.split(/\n/);
    lines.forEach(line => {
      if (isValidLine(line)) {
        jdata.push(line);
      }
    });
    return jdata.join('\n');
  }
  public mdbcli(cmd,args:any='',multiline=false): Observable<any> {
    var url = this._url();
    var token = '';//this._userAccess.getToken();
    let astr = (typeof args === 'string')?args:args.join(' ');
    let formModel = {
      module:'mdb',
      cmd: cmd,
      args: astr
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      }),
    };
    return Observable.create(observer => {
      this._http.post(url, formModel, {responseType: 'text'}).subscribe(data => {
        if ((data == undefined)|| (data == null)) data = '';
        if (multiline) {
          observer.next(this.filterLines(data));
        } else {
          observer.next(data);
        }
        observer.complete();
      }, err => {
        if (err.status === 401) { // Token Change ,need re login
          this._router.navigate([environment.env.token_err_url]);
        } else {
          observer.error(err);
        }
      });
    });
  }

  public post(u, p = {}, opt: any = { service: 'mdbcli', block: true }): Observable<any> {
    var s = (opt.service == undefined) ? 'service' : opt.service;
    var url = this._url(u, s);
    var token = '';//this._userAccess.getToken();

    return Observable.create(observer => {
      if (opt.block !== false) {
        this._spinner.show();
      }
      this._http.post<any>(url, Object.assign(p, { token: token })).subscribe(data => {
        if (opt.block !== false) {
          this._spinner.hide();
        }
        observer.next(data);
        observer.complete();
      }, err => {
        if (opt.block !== false) {
          this._spinner.hide();
        }
        if (err.status === 401) { // Token Change ,need re login
          this._router.navigate([environment.env.token_err_url]);
        } else {
          observer.error(err);
        }
      });
    });
  }

  public get(u, p = {}): Observable<any> {
    var url = this._url(u);
    var token = '';//this._userAccess.getToken();

    //return this._http.post<any>(url,Object.assign(p,{token:token}));
    return Observable.create(observer => {
      this._spinner.show();
      this._http.get<any>(url, p).subscribe(data => {
        this._spinner.hide();
        observer.next(data);
        observer.complete();
      }, err => {
        this._spinner.hide();
      });
    });
  }

  ngOnDestroy() { }

}
