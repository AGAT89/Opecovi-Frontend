import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadosRoutingModule } from './empleados-routing.module';
import { EmpleadosComponent } from './empleados.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { AppsService } from 'src/app/shared/services/apps.service';
import { TableService } from 'src/app/shared/services/table.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';



const antdModule = [
  NzButtonModule,
  NzCardModule,
  NzFormModule,
  NzInputModule,
  NzDropDownModule,
  NzSelectModule,
  NzTableModule,
  NzModalModule,
  NzGridModule
]

@NgModule({
  declarations: [
    EmpleadosComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    EmpleadosRoutingModule,
    FormsModule,
    ReactiveFormsModule, // Asegúrate de importar ReactiveFormsModule

    ...antdModule
  ],
  providers: [
    ThemeConstantService,
    AppsService,
    TableService
  ]
})
export class EmpleadosModule { }
