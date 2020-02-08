import { TitulosRecursos, Componentes, Iconos } from 'src/app/_constantes/ui.constants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PaisDto } from 'src/app/_model/PaisDto.model';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { PaisService } from 'src/app/_services/pais.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.css']
})
export class PaisComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) ordenamientoDeTabla: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginador: MatPaginator;

  loading: boolean;
  listaDetecciones: PaisDto[];
  listaDataParaTabla: MatTableDataSource<any>;
  columnasPorMostrar: string[] = [
    'Nombre',
    'Estado',
    'Acciones'];
  criterioDeBusqueda: string;
  urlApi: string;
  titulo: string;
  icono: string;


  constructor(
    private servicioPais: PaisService,
    private servicioAlertify: AlertifyService,
    private enrutador: ActivatedRoute,
    public ventanaModal: MatDialog,
    private router: Router
  ) {
    this.urlApi = environment.apiUrl;
    this.titulo = TitulosRecursos.listar + Componentes.pais;
    this.icono = Iconos.pais;
  }

  ngOnInit() {

    this.listar();

  }

  editar(objEditar: PaisDto) {
    this.router.navigate(['/GestionPais/' + objEditar.paisId]);
  }

  crear() {
    this.router.navigate(['/GestionPais']);
  }

  listar() {
    this.loading = true;
    this.servicioPais.listar()
    .subscribe((response: PaisDto[]) => {
      console.log(response);
      this.generarTabla(response);
      this.loading = false;
    }, error => {
      this.servicioAlertify.error('Error listando los Paiss');
      console.log(error);
      this.loading = false;
    }
    );
  }


  generarTabla(responseAlcance: PaisDto[]) {
    this.listaDataParaTabla = new MatTableDataSource(responseAlcance);
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
  cambiarEstado(objEditar: PaisDto) {
    if (objEditar.activo === true) {
      objEditar.activo = false;
    } else if (objEditar.activo === false) {
      objEditar.activo = true;
    } else if (objEditar.activo === null) {
      objEditar.activo = true;
    }

    this.servicioPais.actualizar(objEditar).subscribe(
      (Pais: PaisDto) => {
        this.loading = false;
        this.servicioAlertify.success('Pais actualizado en la base de datos');
        this.listar();
      },
      error => {
        this.loading = false;
        console.log(error);

        this.servicioAlertify.error('Error gestionando el Pais');
      });
  }

}
