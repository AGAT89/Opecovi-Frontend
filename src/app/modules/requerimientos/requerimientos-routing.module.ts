import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequerimientosComponent } from './requerimientos.component';


const routes: Routes = [
  {
    path: '',
    component: RequerimientosComponent,
    data: {
        title: 'Requerimientos ',
        headerDisplay: "none"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequerimientosRoutingModule { }
