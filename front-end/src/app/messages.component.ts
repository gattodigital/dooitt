import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from './api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'messages',
  template: `<div *ngFor="let msg of apiService.messages">
               <mat-card>{{ msg.msg }}</mat-card>
            </div>`,
})
export class MessagesComponent {

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    let userId = this.route.snapshot.params.id;
    this.apiService.getMessage(userId);
  }

}
