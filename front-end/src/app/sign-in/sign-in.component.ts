import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: false,
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
  isLoading: boolean = false;

  TOKEN_KEY = 'token';

  get authenticatedUser() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  validateForm(): boolean {
    this.errorMessage = '';

    if (!this.signInData.email || !this.signInData.email.trim()) {
      this.errorMessage = 'Email is required.';
      return false;
    }

    if (!this.signInData.password) {
      this.errorMessage = 'Password is required.';
      return false;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.signInData.email.trim())) {
      this.errorMessage = 'Please enter a valid email address.';
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

    this.apiService.postUserSignIn(this.signInData).subscribe(
      res => {
        this.isLoading = false;
        localStorage.setItem(this.TOKEN_KEY, res.token);
        if (this.authenticatedUser) {
          this.router.navigate(['/main']);
        }
      },
      (error) => {
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.status === 429) {
          this.errorMessage = 'Too many login attempts. Please try again later.';
        } else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Sign-in failed. Please check your credentials and try again.';
        }
      }
    );
  }

  ngOnInit() { }

}
