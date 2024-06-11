import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequerimientosRecibidosComponent } from './requerimientos-recibidos.component';

describe('RequerimientosRecibidosComponent', () => {
  let component: RequerimientosRecibidosComponent;
  let fixture: ComponentFixture<RequerimientosRecibidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequerimientosRecibidosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequerimientosRecibidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
