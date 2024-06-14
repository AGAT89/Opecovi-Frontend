import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequerimientosRecibidosComponent } from './requerimientos-recibidos.component';
import { ShowComponent } from './show/show.component';

const routes: Routes = [
  {
    path: '',
    component: RequerimientosRecibidosComponent,
    data: {
        title: 'Requerimientos recibidos ',
        headerDisplay: "none"
    }
  },
  {
    path: 'ver/:id_requerimiento',
    component: ShowComponent,
    data: {
        title: 'Detalle de Requerimiento ',
        headerDisplay: "none"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequerimientosRecibidosRoutingModule { }
