import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpleadosComponent } from './empleados.component';

const routes: Routes = [
  {
    path: '',
    component: EmpleadosComponent,
    data: {
        title: 'Empleados ',
        headerDisplay: "none"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadosRoutingModule { }
