import { DialogService } from 'src/app/_services/dialog.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CiudadService } from 'src/app/_services/ciudad.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { CiudadDto } from 'src/app/_model/CiudadDto.model';
import { RegularExpressions } from 'src/constants';
import { environment } from 'src/environments/environment.debug';
import { DepartamentoDto } from 'src/app/_model/DepartamentoDto.model';
import { DepartamentoService } from 'src/app/_services/departamento.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MensajesConfirmacion } from 'src/app/_constantes/mensajes.constants';
import { Botones, TitulosRecursos, Componentes, Iconos } from 'src/app/_constantes/ui.constants';
import { ActivoDto } from 'src/app/_model/ActivoDto.model';

@Component({
  selector: 'app-gestion-ciudad',
  templateUrl: './gestion-ciudad.component.html',
  styleUrls: ['./gestion-ciudad.component.css'],

})
export class GestionCiudadComponent implements OnInit {
  urlApi: string;
  form: FormGroup;
  nuevoCiudad: CiudadDto;
  departamentos: DepartamentoDto[] = [];
  isSubmitted = false;
  formControls2: any;
  loading: boolean;
  tituloBotonOk: string;
  tituloBotonCancelar: string;
  titulo: string;
  icono: string;

  constructor(
    public fb: FormBuilder,
    private servicioCiudad: CiudadService,
    private alertify: AlertifyService,
    private servicioDepartamento: DepartamentoService,
    private router: Router,
    public dialogService: DialogService,
    private enrutador: ActivatedRoute
  ) {
      this.titulo = TitulosRecursos.gestion + Componentes.ciudad;
      this.icono = Iconos.ciudad;
      this.createForm();
      this.enrutador.paramMap.subscribe(params => {
        if (
          this.enrutador.snapshot.params !== null &&
          this.enrutador.snapshot.params !== undefined &&
          this.enrutador.snapshot.params.id !== null &&
          this.enrutador.snapshot.params.id !== undefined
          ) {
            this.servicioCiudad.obtenerPorId(this.enrutador.snapshot.params.id)
            .subscribe(response => {
              console.log(response);
              this.nuevoCiudad = response;
              this.tituloBotonOk = Botones.okActualizar;
              this.tituloBotonCancelar = Botones.regresar;
            });
          } else {
            this.nuevoCiudad = new CiudadDto();
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
      return this.dialogService.confirm(MensajesConfirmacion.confirmacionSalidaComponente);
    }
    return true;
  }

  createForm() {
    this.form = this.fb.group({
      nombreValidacion: [
        RegularExpressions.onlyLettersIgnoreCase,
        [Validators.required, Validators.minLength(1), Validators.maxLength(100)]
      ],
      divipoValidacion: [
        RegularExpressions.onlyNumbersAndLetters,
        [Validators.required, Validators.minLength(1), Validators.maxLength(10)]
      ],
      DepartamentoIdValidacion: ['', Validators.required],
      activoValidacion: []
    });
    this.formControls2 = this.form.controls;

    this.servicioDepartamento.listar().subscribe(
      (departamento: DepartamentoDto[]) => {
        this.departamentos = departamento;
      },
      error => {
        console.log(error);
      }
    );
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
      this.nuevoCiudad.ciudadId == null ||
      this.nuevoCiudad.ciudadId === undefined ||
      this.nuevoCiudad.ciudadId < 1
    ) {
      this.servicioCiudad.crear(this.nuevoCiudad).subscribe(
        (Ciudad: CiudadDto) => {
          this.loading = false;
          this.alertify.success('Ciudad registrada en la base de datos');
          this.limpiarFormulario();
        },
        error => {
          this.loading = false;
          console.log(error);
          this.alertify.error('Error gestionando la ciudad');
        }
      );
    } else {
      this.servicioCiudad.actualizar(this.nuevoCiudad).subscribe(
        (Ciudad: CiudadDto) => {
          this.loading = false;
          this.alertify.success('Ciudad actualizada en la base de datos');
        },
        error => {
          this.loading = false;
          console.log(error);
          this.alertify.error('Error gestionando la ciudad');
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
    this.nuevoCiudad.divipo = '';
    this.nuevoCiudad.nombre = '';
    this.nuevoCiudad.departamentoId = null;
    this.loading = false;
  }

  navegarLista() {
    this.router.navigate(['/Ciudad']);
  }
}
