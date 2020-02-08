import { PaisService } from 'src/app/_services/pais.service';
import { PaisDto } from 'src/app/_model/PaisDto.model';
import { MensajesConfirmacion, MensajesInformativos } from './../../_constantes/mensajes.constants';
import { DialogService } from 'src/app/_services/dialog.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DepartamentoService } from 'src/app/_services/departamento.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { DepartamentoDto } from 'src/app/_model/DepartamentoDto.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { RegularExpressions } from 'src/constants';
import { environment } from 'src/environments/environment.debug';
import { Botones, TitulosRecursos, Componentes, Iconos } from 'src/app/_constantes/ui.constants';
import { ActivoDto } from 'src/app/_model/ActivoDto.model';

@Component({
  selector: 'app-gestion-departamento',
  templateUrl: './gestion-departamento.component.html',
  styleUrls: ['./gestion-departamento.component.css'],
})
export class GestionDepartamentoComponent implements OnInit {
  urlApi: string;
  form: FormGroup;
  nuevoDepartamento: DepartamentoDto;
  isSubmitted = false;
  formControls2: any;
  loading: boolean;
  tituloBotonOk: string;
  tituloBotonCancelar: string;
  titulo: string;
  icono: string;
  paises: PaisDto[];

  constructor(
    public fb: FormBuilder,
    private servicioDepartamento: DepartamentoService,
    private router: Router,
    public dialogService: DialogService,
    private alertify: AlertifyService,
    private enrutador: ActivatedRoute,
    private servicioPais: PaisService
  ) {
    this.titulo = TitulosRecursos.gestion + Componentes.departamento;
    this.icono = Iconos.departamento;
    this.createForm();
    this.enrutador.paramMap.subscribe(params => {
      if (
        this.enrutador.snapshot.params !== null &&
        this.enrutador.snapshot.params !== undefined &&
        this.enrutador.snapshot.params.id !== null &&
        this.enrutador.snapshot.params.id !== undefined
      ) {

        this.servicioPais.listarTodo()
        .subscribe(
            (response: PaisDto[]) => {
                this.paises = response;
                console.log(this.paises);
            }, error => {
                this.alertify.error(MensajesInformativos.errorListando + ' Paises');
            }
        );

        this.servicioDepartamento
          .obtenerPorId(this.enrutador.snapshot.params.id)
          .subscribe(response => {
            console.log(response);
            this.nuevoDepartamento = response;
            this.tituloBotonOk = Botones.okActualizar;
            this.tituloBotonCancelar = Botones.regresar;
          });
      } else {
        this.nuevoDepartamento = new DepartamentoDto();
        this.tituloBotonOk = Botones.okCrear;
        this.tituloBotonCancelar = Botones.cancelar;
      }
    });
  }
  ngOnInit() {
    this.urlApi = environment.apiUrl;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.form.dirty) {
      return this.dialogService.confirm(
        MensajesConfirmacion.confirmacionSalidaComponente
      );
    }
    return true;
  }
  createForm() {
    this.form = this.fb.group({
      DivipoValidacion: [
        RegularExpressions.onlyNumbersAndLetters,
        [Validators.required, Validators.minLength(1), Validators.maxLength(10)]
      ],
      NombreValidacion: [
        RegularExpressions.onlyLettersIgnoreCase,
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)]
      ],
      PaisValidacion: [
        [Validators.required]
      ],
      activoValidacion: []
    });
    this.formControls2 = this.form.controls;
  }
  get formControls() {
    return this.form.controls;
  }
  onSubmit() {
    this.isSubmitted = true;
    this.loading = true;
    if (this.form.invalid) {
      this.loading = false;
      return;
    }
    if (
      this.nuevoDepartamento.departamentoId == null ||
      this.nuevoDepartamento.departamentoId === undefined ||
      this.nuevoDepartamento.departamentoId < 1
    ) {
      this.servicioDepartamento.crear(this.nuevoDepartamento).subscribe(
        (Departamento: DepartamentoDto) => {
          this.loading = false;
          this.alertify.success('Departamento registrado en la base de datos');
          this.limpiarFormulario();
        },
        error => {
          this.loading = false;
          console.log(error);
          this.alertify.error('Error gestionando el Departamento');
        }
      );
    } else {
      this.servicioDepartamento.actualizar(this.nuevoDepartamento).subscribe(
        (Departamento: DepartamentoDto) => {
          this.loading = false;
          this.alertify.success('Departamento actualizado en la base de datos');
        },
        error => {
          this.loading = false;
          console.log(error);
          this.alertify.error('Error gestionando el Departamento');
        }
      );
    }
  }

  estados: ActivoDto[] =
  [
    { nombre: 'Si', estado: true },
    { nombre: 'No', estado: false },
  ];
  limpiarFormulario() {
    this.nuevoDepartamento.codigoDepartamento = null;
    this.nuevoDepartamento.nombre = '';
    this.loading = false;
  }

  navegarLista() {
    this.router.navigate(['/Departamento']);
  }
}
