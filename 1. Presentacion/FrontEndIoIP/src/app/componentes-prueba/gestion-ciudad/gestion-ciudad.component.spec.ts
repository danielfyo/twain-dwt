import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCiudadComponent } from './gestion-ciudad.component';

describe('GestionCiudadComponent', () => {
  let component: GestionCiudadComponent;
  let fixture: ComponentFixture<GestionCiudadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionCiudadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCiudadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
