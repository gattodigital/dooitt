import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: false,
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
  errorMessage: string = '';
  errorMessages: string[] = [];
  isLoading: boolean = false;

  TOKEN_KEY = 'token';

  get authenticatedUser() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  validatePassword(password: string): { valid: boolean, errors: string[] } {
    const errors: string[] = [];

    if (!password) {
      errors.push('Password is required.');
      return { valid: false, errors };
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long.');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter.');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number.');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character.');
    }

    return { valid: errors.length === 0, errors };
  }

  validateForm(): boolean {
    this.errorMessage = '';
    this.errorMessages = [];

    if (!this.signUpData.email || !this.signUpData.email.trim()) {
      this.errorMessages.push('Email is required.');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.signUpData.email)) {
        this.errorMessages.push('Please enter a valid email address.');
      }
    }

    const passwordValidation = this.validatePassword(this.signUpData.password);
    if (!passwordValidation.valid) {
      this.errorMessages.push(...passwordValidation.errors);
    }

    if (this.errorMessages.length > 0) {
      this.errorMessage = this.errorMessages.join(' ');
      return false;
    }

    return true;
  }

  Post() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.errorMessages = [];

    this.apiService.postUserSignUp(this.signUpData).subscribe(
      res => {
        this.isLoading = false;
        localStorage.setItem('token', res.token);
        if (this.authenticatedUser) {
          this.router.navigate(['/sign-up/confirm']);
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Registration failed:', error);

        if (error.status === 409) {
          this.errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (error.status === 429) {
          this.errorMessage = 'Too many registration attempts. Please try again later.';
        } else if (error.error && error.error.errors && Array.isArray(error.error.errors)) {
          this.errorMessages = error.error.errors;
          this.errorMessage = this.errorMessages.join(' ');
        } else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    );
  }

  ngOnInit() { }

}
