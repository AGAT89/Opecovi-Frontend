import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
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

const antdModule = [
  NzButtonModule,
  NzCardModule,
  NzFormModule,
  NzInputModule,
  NzDropDownModule,
  NzSelectModule,
  NzTableModule
]

@NgModule({
  declarations: [
    UsuariosComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    UsuariosRoutingModule,
    ...antdModule
  ],
  providers: [
    ThemeConstantService,
    AppsService,
    TableService
  ]
})
export class UsuariosModule { }
