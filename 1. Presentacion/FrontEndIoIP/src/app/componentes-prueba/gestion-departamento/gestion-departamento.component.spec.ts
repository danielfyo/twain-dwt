import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDepartamentoComponent } from './gestion-departamento.component';

describe('GestionDepartamentoComponent', () => {
  let component: GestionDepartamentoComponent;
  let fixture: ComponentFixture<GestionDepartamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionDepartamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
