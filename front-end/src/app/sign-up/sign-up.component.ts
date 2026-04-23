import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  signUpData: any = {};
  confirmPassword: string = '';
  errorMessage: string = '';

  TOKEN_KEY = 'token';

  get authenticatedUser() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  Post() {
    // Clear previous error message
    this.errorMessage = '';

    // Validate required fields
    if (!this.signUpData.email || !this.signUpData.password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    // Validate password strength
    if (this.signUpData.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long.';
      return;
    }

    if (!/[a-z]/.test(this.signUpData.password) ||
        !/[A-Z]/.test(this.signUpData.password) ||
        !/[0-9]/.test(this.signUpData.password)) {
      this.errorMessage = 'Password must contain at least one lowercase letter, one uppercase letter, and one number.';
      return;
    }

    // Validate password confirmation
    if (this.signUpData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.apiService.postUserSignUp(this.signUpData).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        if (this.authenticatedUser) {
          this.router.navigate(['/sign-up/confirm']);
        }
      },
      error => {
        // Display error message from backend
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
        console.error('Registration error:', error);
      }
    );
  }

  ngOnInit() { }

}
