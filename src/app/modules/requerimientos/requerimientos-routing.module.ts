import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequerimientosComponent } from './requerimientos.component';
import { CreateComponent } from './create/create.component';

const routes: Routes = [
  {
    path: '',
    component: RequerimientosComponent,
    data: {
        title: 'Requerimientos ',
        headerDisplay: "none"
    }
  },
  {
    path: 'nuevo',
    component: CreateComponent,
    data: {
        title: 'Nuevo Requerimiento ',
        headerDisplay: "none"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequerimientosRoutingModule { }
