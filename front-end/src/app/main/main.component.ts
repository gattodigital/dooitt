import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  // empty object to be filled by form data
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

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getTasks();
  }

}
