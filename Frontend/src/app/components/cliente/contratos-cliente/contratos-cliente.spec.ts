import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratosCliente } from './contratos-cliente';

describe('ContratosCliente', () => {
  let component: ContratosCliente;
  let fixture: ComponentFixture<ContratosCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratosCliente],
    }).compileComponents();

    fixture = TestBed.createComponent(ContratosCliente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
