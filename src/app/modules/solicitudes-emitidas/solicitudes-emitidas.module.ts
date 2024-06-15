import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolicitudesEmitidasRoutingModule } from './solicitudes-emitidas-routing.module';
import { SolicitudesEmitidasComponent } from './solicitudes-emitidas.component';


@NgModule({
  declarations: [
    SolicitudesEmitidasComponent
  ],
  imports: [
    CommonModule,
    SolicitudesEmitidasRoutingModule
  ]
})
export class SolicitudesEmitidasModule { }
