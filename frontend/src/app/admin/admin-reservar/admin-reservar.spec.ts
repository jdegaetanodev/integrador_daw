import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReservar } from './admin-reservar';

describe('AdminReservar', () => {
  let component: AdminReservar;
  let fixture: ComponentFixture<AdminReservar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReservar],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminReservar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
