import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'cdk-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm :FormGroup;
  loginInfo = {
    username:'',
    password:'',
    valCode:''
  };
  color = 'primary';
  mode = 'determinate';
  value = 50;
  type = 'password';

  constructor(
    private _fb: FormBuilder,
    private _router: Router
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this._fb.group({
      username: [ 'Admin' , [Validators.required] ],
      password: ['Admin' , [Validators.required]],
      valCode: ['1234' , [Validators.required]]
    });
  }

  updateModel() {
    let val = this.loginForm.getRawValue();
    this.loginInfo.username = val.username;
    this.loginInfo.password = val.password;
    this.loginInfo.valCode = val.valCode;
  }

  login() {
    this.updateModel();
    console.log(this.loginInfo);
    /*登录成功后跳转到系统概览*/
    this._router.navigate(['/auth/overview']);
  }

}
