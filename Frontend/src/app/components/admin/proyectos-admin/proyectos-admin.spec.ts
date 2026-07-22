import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosAdmin } from './proyectos-admin';

describe('ProyectosAdmin', () => {
  let component: ProyectosAdmin;
  let fixture: ComponentFixture<ProyectosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectosAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(ProyectosAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
