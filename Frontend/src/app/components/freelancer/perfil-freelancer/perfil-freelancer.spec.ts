import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilFreelancer } from './perfil-freelancer';

describe('PerfilFreelancer', () => {
  let component: PerfilFreelancer;
  let fixture: ComponentFixture<PerfilFreelancer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilFreelancer],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilFreelancer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
