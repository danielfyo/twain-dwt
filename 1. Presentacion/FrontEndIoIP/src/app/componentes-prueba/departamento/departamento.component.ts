import { TitulosRecursos, Componentes, Iconos } from 'src/app/_constantes/ui.constants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DepartamentoDto } from 'src/app/_model/DepartamentoDto.model';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { DepartamentoService } from 'src/app/_services/departamento.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentoComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) ordenamientoDeTabla: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginador: MatPaginator;

  loading: boolean;
  listaDetecciones: DepartamentoDto[];
  listaDataParaTabla: MatTableDataSource<any>;
  columnasPorMostrar: string[] = [
    'Codigo',
    'Nombre',
    'Pais',
    'Estado',
    'Acciones'];
  criterioDeBusqueda: string;
  urlApi: string;
  titulo: string;
  icono: string;


  constructor(
    private servicioDepartamento: DepartamentoService,
    private servicioAlertify: AlertifyService,
    private enrutador: ActivatedRoute,
    public ventanaModal: MatDialog,
    private router: Router
  ) {
    this.urlApi = environment.apiUrl;
    this.titulo = TitulosRecursos.listar + Componentes.departamento;
    this.icono = Iconos.departamento;
  }

  ngOnInit() {

    this.listar();

  }

  editar(objEditar: DepartamentoDto) {
    this.router.navigate(['/GestionDepartamento/' + objEditar.departamentoId]);
  }

  crear() {
    this.router.navigate(['/GestionDepartamento']);
  }

  listar() {
    this.loading = true;
    this.servicioDepartamento.listar()
    .subscribe((response: DepartamentoDto[]) => {
      console.log(response);
      this.generarTabla(response);
      this.loading = false;
    }, error => {
      this.servicioAlertify.error('Error listando los Departamentos');
      console.log(error);
      this.loading = false;
    }
    );
  }


  generarTabla(responseAlcance: DepartamentoDto[]) {
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
  cambiarEstado(objEditar: DepartamentoDto) {
    if (objEditar.activo === true) {
      objEditar.activo = false;
    } else if (objEditar.activo === false) {
      objEditar.activo = true;
    } else if (objEditar.activo === null) {
      objEditar.activo = true;
    }

    this.servicioDepartamento.actualizar(objEditar).subscribe(
      (Departamento: DepartamentoDto) => {
        this.loading = false;
        this.servicioAlertify.success('Departamento actualizado en la base de datos');
        this.listar();
      },
      error => {
        this.loading = false;
        console.log(error);

        this.servicioAlertify.error('Error gestionando el Departamento');
      });
  }

}
