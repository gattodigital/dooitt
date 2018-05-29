import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  // empty object to be filled by form data
  signUpData = {}

  // log data to console on button click
  Post() {
    this.apiService.postUserSignUp(this.signUpData);
  }

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

}
