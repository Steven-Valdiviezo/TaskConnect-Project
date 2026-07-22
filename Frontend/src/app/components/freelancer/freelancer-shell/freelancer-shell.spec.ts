import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerShell } from './freelancer-shell';

describe('FreelancerShell', () => {
  let component: FreelancerShell;
  let fixture: ComponentFixture<FreelancerShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreelancerShell],
    }).compileComponents();

    fixture = TestBed.createComponent(FreelancerShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
