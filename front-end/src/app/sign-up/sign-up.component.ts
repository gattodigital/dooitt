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
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  // Client-side validation; returns an error message or empty string
  validate(): string {
    const { email, password, firstName, lastName } = this.signUpData;

    if (!firstName || !firstName.trim()) {
      return 'First name is required.';
    }
    if (!lastName || !lastName.trim()) {
      return 'Last name is required.';
    }
    if (!email || !email.trim()) {
      return 'Email is required.';
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (!password) {
      return 'Password is required.';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return 'Password must contain at least one letter and one number.';
    }
    if (password !== this.confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  }

  Post() {
    this.errorMessage = '';
    const validationError = this.validate();
    if (validationError) {
      this.errorMessage = validationError;
      return;
    }

    this.isLoading = true;
    this.apiService.postUserSignUp(this.signUpData).subscribe(
      res => {
        this.isLoading = false;
        localStorage.setItem('token', res.token);
        this.router.navigate(['/sign-up/confirm']);
      },
      err => {
        this.isLoading = false;
        const msg = err && err.error && err.error.message;
        this.errorMessage = msg || 'Registration failed. Please try again.';
      }
    );
  }

  ngOnInit() { }

}
