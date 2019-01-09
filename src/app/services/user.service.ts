import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() {
    console.log('User Service Init...');
  }

  public getUsers(): Observable<any> {
    let users=[
      {username:'Admin',email:'Admin@maxchaintech.com',phone:'**********',role:1,active:1,createDate:'2018-10-12'},
      {username:'maxchain_1',email:'Admin@maxchaintech.com',phone:'**********',role:1,active:1,createDate:'2018-10-12'},
      {username:'maxchain_2',email:'Admin@maxchaintech.com',phone:'**********',role:1,active:1,createDate:'2018-10-12'},
      {username:'maxchain_3',email:'Admin@maxchaintech.com',phone:'**********',role:1,active:1,createDate:'2018-10-12'},
      {username:'maxchain_4',email:'Admin@maxchaintech.com',phone:'**********',role:1,active:1,createDate:'2018-10-12'}
    ]
    return Observable.create(observer => {
      observer.next(users);
    });
  }
}
