import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    private apiService: ApiService, 
    private route: ActivatedRoute, 
    private cookieService: CookieService, 
    private router: Router
  ) { }

  taskData = {}

  Task() {
    this.apiService.postTask(this.taskData);
  }

  taskTypes = [
    {value: 'personal-0', viewValue: 'Personal'},
    {value: 'business-1', viewValue: 'Business'},
    {value: 'other-2', viewValue: 'Other'}
  ];

  taskPriorities = [
    {value: 'high-0', viewValue: 'High'},
    {value: 'medium-1', viewValue: 'Medium'},
    {value: 'low-2', viewValue: 'Low'}
  ];

  ngOnInit() {
    this.apiService.getTasks();
  }

}
