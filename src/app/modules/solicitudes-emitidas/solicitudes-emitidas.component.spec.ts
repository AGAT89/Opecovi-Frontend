import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesEmitidasComponent } from './solicitudes-emitidas.component';

describe('SolicitudesEmitidasComponent', () => {
  let component: SolicitudesEmitidasComponent;
  let fixture: ComponentFixture<SolicitudesEmitidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudesEmitidasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesEmitidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
