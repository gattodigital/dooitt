import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title="Doo Itt!"

  constructor(private apiService: ApiService) {
    
  }

  ngOnInit() {
  }

}
