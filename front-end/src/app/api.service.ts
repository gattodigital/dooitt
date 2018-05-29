import { HttpClient } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';


@Injectable()

export class ApiService {

  constructor(private http: HttpClient) { }

  messages = []
  users = []
  TOKEN_KEY = 'token'

  path = 'http://localhost:3000';
  authPath ='http://localhost:3000/authorization';

  // get messages from backend
  getMessage(userId) {
    this.http.get<any>(this.path + '/posts/' + userId).subscribe( res => {
      this.messages = res;
    })
  }

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

  // post messages to backend
  postMessage(message) {
    this.http.post<any>(this.path + '/post', message).subscribe( res => {
      this.messages = res;
    })
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
          this.route.navigateByUrl("/")
      }else{
          console.log("Registration Failed!")
      }     
    });
  }

  // POST Sign In to DB function
  postUserSignIn(signInData) {
    this.http.post<any>(this.authPath + '/sign-in', signInData).subscribe( res => {
      console.log(res);
      localStorage.setItem('token', res.token);
    });

  }

}
