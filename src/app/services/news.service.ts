import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RestfulService} from './restful.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private _restful: RestfulService) {
  }

  getNews(q,page): Observable<any> {
    const u = Object.assign({}, q, page);
    return Observable.create(observer => {
      this._restful.post('saas/message/page', u).subscribe(data => {
        if (data.code != 0) {
          observer.error(data.message);
          return;
        }
        observer.next(data);
        observer.complete();
      });
    });
  }


  /*获取返回消息列表*/
  public getResponse(): Observable<any> {
    const u = {

    }
    return Observable.create(observer => {
      this._restful
        .post('saas/message/Response', u)
        .subscribe(data => {
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
