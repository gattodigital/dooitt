import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  taskDetails

  ngOnInit() {
    let id = this.route.snapshot.params.id;
    this.apiService.getTaskDetails(id).subscribe(data => this.taskDetails = data)   
  }

}
