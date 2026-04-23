import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css']
})

export class PortalComponent implements OnInit {

  constructor(public apiService: ApiService, private router: Router) { }

  ngOnInit() {
    if (this.apiService.authenticatedUser) {
      this.router.navigate(['/main']);
    }
  }

}
