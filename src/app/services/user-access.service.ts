import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAccessService {

  token = undefined;
  token_key = 'saas_token';
  user_key = 'saas_user';
  redirectUrl: string;

  constructor(private _cookie: CookieService) {
    const ck = this._cookie.get(this.token_key);
    if (ck) {
      this.token = ck;
    }
  }

  isLogin() {
    return this.token !== undefined;
  }

  getToken() {
    if (this.token === undefined) {
      this.token = this._cookie.get(this.token_key);
    }
    return this.token;
  }

  getUserInfo() {
    return this._cookie.getObject(this.user_key);
  }

  setToken(t, user = {}) {
    const tout = environment.env['session_timeout'] ? environment.env['session_timeout'] : 600;
    const exDate = new Date((new Date()).getTime() + (tout * 1000));
    this._cookie.put(this.token_key, t, {expires: exDate});
    this.token = t;
    if (user !== undefined) {
      this._cookie.putObject(this.user_key, user, {expires: exDate});
    }
  }

  setUserInfo(user) {
    const tout = environment.env['session_timeout'] ? environment.env['session_timeout'] : 600;
    const exDate = new Date(new Date().getTime() + (tout * 1000));
    this._cookie.put(this.user_key, user, {expires: exDate});
  }

  clearToken() {
    this._cookie.remove(this.user_key);
    this._cookie.remove(this.token_key);
    this.token = undefined;
  }
}
