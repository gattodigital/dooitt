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
  ) { }

  users     = []
  tasks     = []
  TOKEN_KEY = 'token'
  path      = 'http://localhost:3000';
  authPath  ='http://localhost:3000/authorization';

  // POST Sign Up to DB function
  postUserSignUp(signUpData) {
    return this.http.post<any>(this.authPath + '/sign-up', signUpData);
  }

  // POST Sign In to DB function
  postUserSignIn(signInData) {
    return this.http.post<any>(this.authPath + '/sign-in', signInData);
  }

  // Check for authenticated user
  get authenticatedUser() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // POST tasks to backend
  postTask(task) {
    this.http.post<any>(this.path + '/tasks', task).subscribe( res => {
      this.tasks = res;
    });
  }

  // GET tasks from backend
  getTasks() {
    this.http.get<any>(this.path + '/tasks').subscribe( res => {
      this.tasks = res;
    });
  }

  // GET task details from backend
  getTaskDetails(id) {
    return this.http.get(this.path + '/tasks/' + id);
  }

  // GET users from backend
  getUsers() {
    this.http.get<any>(this.path + '/users').subscribe( res => {
      this.users = res;
    });
  }

  // GET user profile from backend
  getProfile(id) {
    return this.http.get(this.path + '/profile/' + id);
  }

  // Log out user account
  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

}
