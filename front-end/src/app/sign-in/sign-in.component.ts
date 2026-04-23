import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  signInData: any = {};
  errorMessage: string = '';

  TOKEN_KEY = 'token';

  get authenticatedUser() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  Post() {
    // Clear previous error message
    this.errorMessage = '';

    // Validate required fields
    if (!this.signInData.email || !this.signInData.password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    this.apiService.postUserSignIn(this.signInData).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        if (this.authenticatedUser) {
          this.router.navigate(['/main']);
        }
      },
      error => {
        // Display error message from backend
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Sign-in failed. Please check your credentials.';
        }
        console.error('Sign-in error:', error);
      }
    );
  }

  ngOnInit() { }

}
