import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratosFreelancer } from './contratos-freelancer';

describe('ContratosFreelancer', () => {
  let component: ContratosFreelancer;
  let fixture: ComponentFixture<ContratosFreelancer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratosFreelancer],
    }).compileComponents();

    fixture = TestBed.createComponent(ContratosFreelancer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
