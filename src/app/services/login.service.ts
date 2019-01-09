import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Md5} from 'ts-md5';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

import {RestfulService} from './restful.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  user;
  private _tokenChecker: Subscription;

  constructor(
    private _restful: RestfulService,
    private _router: Router
  ) {
  }

  /*退出*/
  public doLogout() {
    // this._router.navigate([environment.env.token_err_url]);
    this._router.navigate(['/login']);
    return;
  }

}
