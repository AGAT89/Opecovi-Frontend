import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VentaComponent } from './venta.component';

const routes: Routes = [
    {
        path: '',
        component: VentaComponent,
        data: {
            title: 'Venta',
            headerDisplay: "none"
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VentaRoutingModule { }
