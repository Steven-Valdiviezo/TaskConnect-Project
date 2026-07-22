import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarTrabajo } from './buscar-trabajo';

describe('BuscarTrabajo', () => {
  let component: BuscarTrabajo;
  let fixture: ComponentFixture<BuscarTrabajo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarTrabajo],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarTrabajo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
