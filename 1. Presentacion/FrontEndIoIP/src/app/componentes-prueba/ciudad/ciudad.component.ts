import { Component, OnInit, ViewChild } from '@angular/core';
import { CiudadDto } from 'src/app/_model/CiudadDto.model';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { CiudadService } from 'src/app/_services/ciudad.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Componentes, TitulosRecursos, Iconos } from 'src/app/_constantes/ui.constants';

@Component({
  selector: 'app-ciudad',
  templateUrl: './ciudad.component.html',
  styleUrls: ['./ciudad.component.css']
})
export class CiudadComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) ordenamientoDeTabla: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginador: MatPaginator;

  loading: boolean;
  listaDetecciones: CiudadDto[];
  listaDataParaTabla: MatTableDataSource<any>;
  columnasPorMostrar: string[] = [
    'Divipo',
    'Nombre',
    'Departamento',
    'Estado',
    'Acciones'
  ];

  criterioDeBusqueda: string;
  urlApi: string;
  titulo: string;
  icono: string;

  constructor(
    private servicioCiudad: CiudadService,
    private servicioAlertify: AlertifyService,
    public ventanaModal: MatDialog,
    private router: Router
  ) {
    this.urlApi = environment.apiUrl;
    this.titulo = TitulosRecursos.listar + Componentes.ciudad;
    this.icono = Iconos.ciudad;
  }

  ngOnInit() {
    this.listar();
  }

  editar(objEditar: CiudadDto) {
    this.router.navigate(['/Ciudad/' + objEditar.ciudadId]);
  }

  crear() {
    this.router.navigate(['/GestionCiudad']);
  }

  listar() {
    this.loading = true;
    this.servicioCiudad.listar()
      .subscribe((response: CiudadDto[]) => {
        console.log(response);
        this.generarTabla(response);
        this.loading = false;
      }, error => {
        this.servicioAlertify.error('Error listando las ciudades');
        console.log(error);
        this.loading = false;
      }
      );
  }

  generarTabla(response: CiudadDto[]) {
    this.listaDataParaTabla = new MatTableDataSource(response);
    this.listaDataParaTabla.sort = this.ordenamientoDeTabla;
    this.listaDataParaTabla.paginator = this.paginador;
  }

  limpiarBusqueda() {
    this.criterioDeBusqueda = '';
    this.filtrarTabla('');
  }

  filtrarTabla(value: string) {
    this.listaDataParaTabla.filter = value.trim().toLowerCase();
  }
  cambiarEstado(objEditar: CiudadDto) {
    if (objEditar.activo === true) {
      objEditar.activo = false;
    } else if (objEditar.activo === false) {
      objEditar.activo = true;
    } else if (objEditar.activo === null) {
      objEditar.activo = true;
    }

    this.servicioCiudad.actualizar(objEditar).subscribe(
      (Ciudad: CiudadDto) => {
        this.loading = false;
        this.servicioAlertify.success('Ciudad actualizada en la base de datos');
        this.listar();
      },
      error => {
        this.loading = false;
        console.log(error);

        this.servicioAlertify.error('Error gestionando la Ciudad');
      });
  }
}
