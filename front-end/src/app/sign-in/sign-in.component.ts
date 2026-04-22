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
  errorMessage = '';
  isLoading = false;

  // Simple client-side validation; returns an error message or empty string
  validate(): string {
    const { email, password } = this.signInData;
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
    this.apiService.postUserSignIn(this.signInData).subscribe(
      res => {
        this.isLoading = false;
        localStorage.setItem('token', res.token);
        this.router.navigate(['/main']);
      },
      err => {
        this.isLoading = false;
        const msg = err && err.error && err.error.message;
        this.errorMessage = msg || 'Sign-in failed. Please check your credentials.';
      }
    );
  }

  ngOnInit() { }

}
