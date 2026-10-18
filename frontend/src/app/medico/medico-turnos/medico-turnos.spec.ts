import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoTurnos } from './medico-turnos';

describe('MedicoTurnos', () => {
  let component: MedicoTurnos;
  let fixture: ComponentFixture<MedicoTurnos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoTurnos],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicoTurnos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
