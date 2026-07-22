import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajesFreelancer } from './mensajes-freelancer';

describe('MensajesFreelancer', () => {
  let component: MensajesFreelancer;
  let fixture: ComponentFixture<MensajesFreelancer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajesFreelancer],
    }).compileComponents();

    fixture = TestBed.createComponent(MensajesFreelancer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
