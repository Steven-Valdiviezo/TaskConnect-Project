import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropuestasCliente } from './propuestas-cliente';

describe('PropuestasCliente', () => {
  let component: PropuestasCliente;
  let fixture: ComponentFixture<PropuestasCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropuestasCliente],
    }).compileComponents();

    fixture = TestBed.createComponent(PropuestasCliente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
