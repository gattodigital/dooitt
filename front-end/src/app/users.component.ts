import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'users',
  template: `<div *ngFor="let user of apiService.users">
               <mat-card [routerLink]="['/profile', user._id]">{{ user.lastName }}, {{ user.firstName }}</mat-card>
            </div>`,
})
export class UsersComponent {

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getUsers();
  }

}
