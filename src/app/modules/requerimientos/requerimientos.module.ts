import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequerimientosRoutingModule } from './requerimientos-routing.module';
import { RequerimientosComponent } from './requerimientos.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { AppsService } from 'src/app/shared/services/apps.service';
import { TableService } from 'src/app/shared/services/table.service';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';

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
    RequerimientosComponent,
    CreateComponent,
    EditComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RequerimientosRoutingModule,
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
export class RequerimientosModule { }
