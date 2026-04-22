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

  TOKEN_KEY = 'token';

  get authenticatedUser() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  Post() {
    this.apiService.postUserSignIn(this.signInData).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        if (this.authenticatedUser) {
          this.router.navigate(['/main']);
        }
      },
      () => {
        console.error('Sign-in failed. Please check your credentials.');
      }
    );
  }

  ngOnInit() { }

}
