import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'post',
  template: `
  <mat-card>
    <mat-card-header>
      <mat-card-title>
        <h3>New Post</h3>
      </mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <form class="example-form">
        <mat-form-field style="width: 100%">
          <textarea matInput [(ngModel)]="postMsg" name="description" placeholder="Post"></textarea>
        </mat-form-field>
        <button mat-raised-button (click)="post()" color="primary">Post</button>
      </form> 
    </mat-card-content>
  </mat-card>
  `,
})
export class PostComponent {
  constructor(private apiService: ApiService){}

  postMsg = ''

  post(){
    //console.log(this.postMsg);
    this.apiService.postMessage({msg: this.postMsg})
  }
}