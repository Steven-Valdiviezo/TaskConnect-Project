import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosFreelancer } from './pagos-freelancer';

describe('PagosFreelancer', () => {
  let component: PagosFreelancer;
  let fixture: ComponentFixture<PagosFreelancer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagosFreelancer],
    }).compileComponents();

    fixture = TestBed.createComponent(PagosFreelancer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
