import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteShell } from './cliente-shell';

describe('ClienteShell', () => {
  let component: ClienteShell;
  let fixture: ComponentFixture<ClienteShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteShell],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
