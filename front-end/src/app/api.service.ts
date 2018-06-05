import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment'
import { CookieService } from 'ngx-cookie-service';

@Injectable()

export class ApiService {

  constructor(
    private http: HttpClient, 
    private route: Router,
    private cookieService: CookieService
    ){}

  users     = []
  tasks     = []
  TOKEN_KEY = 'token'
  path      = 'http://localhost:3000';
  authPath  ='http://localhost:3000/authorization';

  // get token
  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // check for authenticated user
  get authenticatedUser() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // log out user account
  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // post tasks to backend
  postTask(task) {
    this.http.post<any>(this.path + '/tasks', task).subscribe( res => {
      this.tasks = res;
    })
  }

  // get tasks from backend
  getTasks() {
    this.http.get<any>(this.path + '/tasks').subscribe( res => {
      this.tasks = res;
    })
  }

  getTaskDetails(id) {
    return this.http.get(this.path + '/tasks/' + id);
  }

  // get users from backend
  getUsers() {
    this.http.get<any>(this.path + '/users').subscribe( res => {
      this.users = res;
    })
  }

  // get profile from backend
  getProfile(id) {
    return this.http.get(this.path + '/profile/' + id);
  }


  // POST Sign Up to DB function
  postUserSignUp(signUpData) {
    this.http.post<any>(this.authPath + '/sign-up', signUpData).subscribe(res =>{ 
      console.log(res) 
      localStorage.setItem(this.TOKEN_KEY, res.token)  
      if(this.authenticatedUser){
          this.route.navigateByUrl("/sign-up/confirm")
      }else{
        console.log("Registration Failed!")
      }     
    });
  }

  // POST Sign In to DB function
  postUserSignIn(signInData) {
    return this.http.post<any>(this.authPath + '/sign-in', signInData);
    // .subscribe( res => {
    //   console.log(res);
    //   localStorage.setItem('token', res.token);
    //   if(this.authenticatedUser){
    //       this.route.navigateByUrl("/main")
    //   }else{
    //     console.log("GET OUT!")
    //   }     
    // });
  }

}
