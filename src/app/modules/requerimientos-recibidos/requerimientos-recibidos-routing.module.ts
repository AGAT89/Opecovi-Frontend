import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequerimientosRecibidosComponent } from './requerimientos-recibidos.component';

const routes: Routes = [
  {
    path: '',
    component: RequerimientosRecibidosComponent,
    data: {
        title: 'Requerimientos recibidos ',
        headerDisplay: "none"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequerimientosRecibidosRoutingModule { }
