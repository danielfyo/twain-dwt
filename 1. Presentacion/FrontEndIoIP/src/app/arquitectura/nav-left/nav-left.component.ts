import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.css']
})
export class NavLeftComponent implements OnInit {
  MenuVisible: boolean[] = [];
  urlApi: string;
  constructor(
  ) {
    this.urlApi = environment.apiUrl;
  }

  ngOnInit() {
    this.MenuVisible[0] = false;
  }

  deploySubMenu(opcion: number) {
    this.MenuVisible[opcion] = !this.MenuVisible[opcion];
  }
}
