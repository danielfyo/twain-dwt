import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-nav-top',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  constructor(
    private alertify: AlertifyService,
  ) { }

  ngOnInit() {
  }

  logout() {
    window.parent.location.href="/Logout";
  }
}
