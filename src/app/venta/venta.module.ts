import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { VentaRoutingModule } from './venta-routing.module';
import { VentaComponent } from './venta.component';

/** Import any ng-zorro components as the module required except icon module */
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';

/** Assign all ng-zorro modules to this array*/
const antdModule = [
    NzButtonModule,

    NzCardModule
]

@NgModule({
  declarations: [
    VentaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    VentaRoutingModule,
    ...antdModule
  ]
})
export class VentaModule { }
