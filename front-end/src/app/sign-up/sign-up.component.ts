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

  TOKEN_KEY = 'token';

  get authenticatedUser() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  Post() {
    this.apiService.postUserSignUp(this.signUpData).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        if (this.authenticatedUser) {
          this.router.navigate(['/sign-up/confirm']);
        }
      },
      () => {
        console.error('Registration failed. Please try again.');
      }
    );
  }

  ngOnInit() { }

}
