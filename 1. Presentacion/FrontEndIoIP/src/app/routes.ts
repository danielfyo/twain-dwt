import { GestionDepartamentoComponent } from './componentes-prueba/gestion-departamento/gestion-departamento.component';
import { GestionCiudadComponent } from './componentes-prueba/gestion-ciudad/gestion-ciudad.component';
import { DashboardComponent } from './componentes-prueba/dashboard/dashboard.component';
import { PaisComponent } from './componentes-prueba/pais/pais.component';
import { CiudadComponent } from './componentes-prueba/ciudad/ciudad.component';
import { DepartamentoComponent } from './componentes-prueba/departamento/departamento.component';
// Angular
import { Routes } from '@angular/router';

// Own Components
import { Error404Component } from './componentes-prueba/error404/error404.component';

export const appRoutes: Routes = [

  // Seguridad
  { path: '', redirectTo: '/Dashboard', pathMatch: 'full'},
  { path: 'Dashboard', component: DashboardComponent},

  // listar
  { path: 'Pais', component: PaisComponent},
  { path: 'Departamento', component: DepartamentoComponent },
  { path: 'Ciudad', component: CiudadComponent },
  // gestion
  // { path: 'GestionPais', component: GestionPaisComponent},
  { path: 'Departamento/:id', component: GestionDepartamentoComponent },
  { path: 'GestionDepartamento', component: GestionDepartamentoComponent },
  { path: 'Ciudad/:id', component: GestionCiudadComponent },
  { path: 'GestionCiudad', component: GestionCiudadComponent },
  { path: '**', component: Error404Component }
];
