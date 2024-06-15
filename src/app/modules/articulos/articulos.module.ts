import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticulosRoutingModule } from './articulos-routing.module';
import { ArticulosComponent } from './articulos.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  NzTableModule,
  NzModalModule,
  NzGridModule
]


@NgModule({
  declarations: [
    ArticulosComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ArticulosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...antdModule
  ],
  providers: [
    ThemeConstantService,
    AppsService,
    TableService
  ]
})
export class ArticulosModule { }
