import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'profile',
  template: `
    <mat-card>
      <mat-card-content>
        <h3>Profile</h3>
        <mat-list>
          <mat-list-item>Name: {{ profile?.firstName }} {{ profile?.lastName }}</mat-list-item>
          <mat-list-item>Email: {{ profile?.email }}</mat-list-item>
        </mat-list>
      </mat-card-content>
    </mat-card>
    <hr>
    
    `,
})
export class ProfileComponent implements OnInit {

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  profile

  ngOnInit(){
      let id = this.route.snapshot.params.id;
      this.apiService.getProfile(id).subscribe(data => this.profile = data)            
  }

}
