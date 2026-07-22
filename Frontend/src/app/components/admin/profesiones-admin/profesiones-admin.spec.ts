import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesionesAdmin } from './profesiones-admin';

describe('ProfesionesAdmin', () => {
  let component: ProfesionesAdmin;
  let fixture: ComponentFixture<ProfesionesAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesionesAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfesionesAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
