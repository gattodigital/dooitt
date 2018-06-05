import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {

  constructor(
    private apiService: ApiService, 
    private route: ActivatedRoute, 
    private cookieService: CookieService, 
    private router: Router
  ) { }

  signUpData = {};

  TOKEN_KEY = 'token'
  path      = 'http://localhost:3000';
  authPath  ='http://localhost:3000/authorization';

  get authenticatedUser() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // log data to console on button click
  Post() {
    this.apiService.postUserSignUp(this.signUpData).subscribe( res => { 
      console.log(res) 
      localStorage.setItem('token', res.token)  
      if(this.authenticatedUser){
          this.router.navigate(["/sign-up/confirm"]);
      }else{
        console.log("Registration Failed!")
      }     
    });
  }

  ngOnInit() { }

}
