import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {

  constructor(
    private apiService: ApiService, 
    private route: ActivatedRoute, 
    private cookieService: CookieService, 
    private router: Router
  ) { }

  signInData = {};

  TOKEN_KEY = 'token'
  path      = 'http://localhost:3000';
  authPath  ='http://localhost:3000/authorization';

  get authenticatedUser() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
  
  Post() {
    this.apiService.postUserSignIn(this.signInData).subscribe( res => {
      console.log(res);
      localStorage.setItem('token', res.token);
      if(this.authenticatedUser){
        this.router.navigate(["../main"]);
      } else {
        console.log("GET OUT!")
      }     
    });
  }

  ngOnInit() { }

}
