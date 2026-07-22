import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisPropuestas } from './mis-propuestas';

describe('MisPropuestas', () => {
  let component: MisPropuestas;
  let fixture: ComponentFixture<MisPropuestas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisPropuestas],
    }).compileComponents();

    fixture = TestBed.createComponent(MisPropuestas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
