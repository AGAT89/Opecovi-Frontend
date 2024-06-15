import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolicitudesRecibidasRoutingModule } from './solicitudes-recibidas-routing.module';
import { SolicitudesRecibidasComponent } from './solicitudes-recibidas.component';
import { CreateComponent } from './create/create.component';
import { EditarComponent } from './editar/editar.component';


@NgModule({
  declarations: [
    SolicitudesRecibidasComponent,
    CreateComponent,
    EditarComponent
  ],
  imports: [
    CommonModule,
    SolicitudesRecibidasRoutingModule
  ]
})
export class SolicitudesRecibidasModule { }
