// angular core
import { Component, OnInit } from '@angular/core';

// dto
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  showMaster: boolean;
  title = 'Prueba IoIp';


  constructor(
    private router: Router,
  ) {
    // TODO: posible acceso a los componentes enrutados console.log(this.router);
  }

  ngOnInit() {
    this.router.navigate(['/Pais']);
    this.showMaster = true;
  }


  goToLogin() {

  }

  onActivate() {
    window.scroll(0, 0);
  }
}
