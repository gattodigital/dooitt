import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  // empty object to be filled by form data
  signInData = {}

  // log data to console on button click
  Post() {
    this.apiService.postUserSignIn(this.signInData);
  }

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

}
